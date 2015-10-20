import './main.css!';
import tmpl from './main-tmpl.html!text';
import info_tmpl from './info-tmpl.html!text';
import Vue from 'vue';
import map_loader from "map";
import FirebaseAdapter from 'app/adapters/firebase_adapter';

import barefoot from './resources/barefoot.svg!text';
import flaf5 from './resources/flag5.svg!text';



var GREEN_ICON='//maps.google.com/mapfiles/ms/icons/green-dot.png';
var BLUE_ICON= "data:image/svg+xml," + encodeURIComponent(flaf5); //'//maps.google.com/mapfiles/ms/icons/blue-dot.png';
var RED_ICON= "data:image/svg+xml," + encodeURIComponent(barefoot); //'//maps.google.com/mapfiles/ms/icons/red-dot.png';




function googleMap(vm){
	map_loader({
            libraries: ['places']
        })
	   .then(function(googleApi) {

	   		class LocationsAdapter extends FirebaseAdapter{

				constructor(container, path){
					super(path);
					this.container = container;
					this.markers = {};

				    this.init();
				}

				dispose(){
					for(var marker in this.markers){
						this.markers[marker].setMap(null);
					}
					this.markers={};
					this.container = null;
				}

				added(key, value){
					var marker = new googleApi.maps.Marker({
		                map: this.container.map,
		                position: new google.maps.LatLng(value.lat,value.lng),
		                title: value.title,
		                icon: RED_ICON,
		                draggable: true
		            });
		            this.markers[key]=marker;
		            googleApi.maps.event.addListener(marker, 'dragend', (e) => {
		                var location = marker.getPosition();
		                this.container.marker_dragged(key, value, location.lat(), location.lng());
		            });
				}

				changed(key, value){
					var marker = this.markers[key];
					if(marker){
						marker.setTitle(value.title);
						marker.setPosition(new google.maps.LatLng(value.lat,value.lng));
					}
				}

				removed(key){
					var marker = this.markers[key];
					if(marker){
            			marker.setMap(null);
						delete this.markers[key]
					}
				}

	   			get_bounds(rb){
					var marker=null;
					for(var key in this.markers){
						marker = this.markers[key];
						let loc = marker.getPosition();
						if(rb===null){
							rb = new google.maps.LatLngBounds(loc, loc);
						} else {
							rb.extend(loc);
						}
					};
					return rb;
	   			}
	   		}

	   		class SearchResultsAdapter{
	   			constructor(container, results){
	   				this.markers = [];
	   				this.container = container;
	   				results.map((item) => {
						let marker = new googleApi.maps.Marker({
			                map: container.map,
			                position: new google.maps.LatLng(item.lat,item.lng),
			                title: item.title,
			                icon: BLUE_ICON
			            });
						let info = new google.maps.InfoWindow();
			            google.maps.event.addListener(marker, 'click', (e) => {
			            	if (e.stop) {
			            	    e.stop();
			            	}
			            	this.open_info(marker,info,item);
			            });
	   					this.markers.push({m:marker,i:info});
	   				});
	   			}

	   			dispose(){
	   				this.markers.map(function(item){
	   					item.m.setMap(null);
	   					item.i.setMap(null);
	   				});
	   			}

	   			open_info(marker, info, item){
	   				var id = "info_" + new Date().getMilliseconds();
					info.setContent('<div id="'+id+'">loading...</div>');
			        info.open(this.container.map,marker);
					new Vue({
						el:"#"+id,
						template: info_tmpl,
						data:item,
						methods: {
							addLocation: function(){
								this.$dispatch('addLocation', this.item);
							}
						}
					});
	   			}

	   			get_bounds(rb){
					this.markers.map((marker) => {
						let loc = marker.m.getPosition();
						if(rb===null){
							rb = new google.maps.LatLngBounds(loc, loc);
						} else {
							rb.extend(loc);
						}
					});
					return rb;
	   			}

				hilite(index){
					this.markers.map((item, i) => {
						item.m.setIcon(i===index ? GREEN_ICON: BLUE_ICON);
					});
				}
	   		}

		   	class MapContainer{
				constructor(element){
					this.locations = null;
					this.search_results = null;
					this.to_do = null;

					var mapOptions = {
				    	center: new google.maps.LatLng(54.8143,-2.9694),
				    	zoom: 15,
				    	mapTypeId: googleApi.maps.MapTypeId.MAP
					};

					this.map = new googleApi.maps.Map(element, mapOptions);

				    googleApi.maps.event.addListener(this.map, 'dblclick', (e) => {
				        if(this.to_do){
				        	clearTimeout(this.to_do);
				    		this.to_do = null;
				        }
				    });
				    googleApi.maps.event.addListener(this.map, 'click', (e) => {
				    	if(this.to_do === null){
				        	this.to_do = setTimeout(() => {
				        		this.to_do = null;
				        		this.map_clicked(
				        			e.latLng.lat(),
				        			e.latLng.lng());
				        	},300);
				    	}
				    });
				}

				dispose(){
					if(this.locations){
						this.locations.dispose();
					}
					if(this.search_results){
						this.search_results.dispose();
					}
					delete this.map;
					this.map = null;
				}

				map_clicked(lat,lng){
					if(this.locations){
						this.locations.add({
							title: "untitled",
							lat: lat,
							lng: lng
						});
					}
				}

				marker_dragged(key, value, lat, lng){
					if(this.locations){
						this.locations.change(key,{lat:lat, lng:lng});
					}
				}

				set_center(lat,lng){
					this.map.setCenter(new google.maps.LatLng(lat,lng));
				}

				set_bounds(){
					var rb = null;
					if(this.locations){
						rb = this.locations.get_bounds(rb);
					}
					if(this.search_results){
						rb = this.search_results.get_bounds(rb);
					}
					if(rb){
						this.map.fitBounds(rb);
					}
				}

				set_locations(path){
					if(this.locations){
						this.locations.dispose();
						this.locations = null;
					}
					if(path){
						this.locations = new LocationsAdapter(this, path);
						this.set_bounds();
					}
				}

				set_search_results(results){
					if(this.search_results){
						this.search_results.dispose();
					}
					this.search_results = new SearchResultsAdapter(this,results);
					this.set_bounds();
				}

				hilite_search(index){
					if(this.search_results){
						this.search_results.hilite(index);
					}
				}
			}
	   		vm._map_container_ = new MapContainer(vm.$el);
		}, function(err) {
	        console.error(err);
	    });
}


Vue.component('map-panel', {
	data: function(){
		return {
			_map_container_: null
		};
	},
  	template: tmpl,
  	props: ['url'],
  	events: {
  		"hook:attached": function(){
  			googleMap(this);
  		},
  		"hook:detached": function(){
  			if(this._map_){
  				this._map_container_.dispose();
  				this._map_container_ = null;
  			}
  		},
  		"set-center": function(e){
  			if(this._map_container_){
  				this._map_container_.set_center(e.lat, e.lng);
  			}
  		},
  		"search-results": function(e){
  			if(this._map_container_){
  				this._map_container_.set_search_results(e);
  			}
  		},
		"highlight-result": function(e){
			if(this._map_container_){
				this._map_container_.hilite_search(e);
			}
		}
  	},
  	watch:{
  		"url": function(val){
  			if(this._map_container_){
  				this._map_container_.set_locations(val);
  			}
  		}
  	}
});
