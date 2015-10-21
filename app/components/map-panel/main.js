import './main.css!';
import tmpl from './main-tmpl.html!text';
import info_tmpl from './info-tmpl.html!text';
import Vue from 'vue';
import map_loader from "map";
import FirebaseAdapter from 'app/adapters/firebase_adapter';
import Location from 'app/models/location';

import icons from './icons';


function googleMap(vm){
	map_loader({
            libraries: ['places']
        })
	   .then(function(googleApi) {
		   class FireMarker extends googleApi.maps.Marker {
				constructor(config, path){
					super(config);
					this._base = new Firebase(path)
					if(config.draggable){
						googleApi.maps.event.addListener(this, 'dragend', (e) => {
							var location = this.getPosition();
							this._base.update({
								lat: location.lat(),
								lng: location.lng()
							})
						});
					}
				}

				load() {
					return new Promise((resolve, reject) => {
						this._base.once('value', (snap) => {
							var value = snap.val();
							this.setTitle(value.title);
							this.setPosition(new google.maps.LatLng(value.lat,value.lng));
							resolve();
						}, reject);
					})
				}
			}

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
					var m = new FireMarker({
						map: this.container.map,
						icon: icons.RED_ICON,
						draggable: true
					}, `https://scorching-fire-6566.firebaseio.com/reference-test/locations/${key}`, marker => this.markers[key] = marker);
					m.load().then(()=>{
						this.markers[key] = m;
						this.container.set_bounds();
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
			                icon: icons.BLUE_ICON
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
						item.m.setIcon(i===index ? icons.GREEN_ICON: icons.BLUE_ICON);
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
					//This should broadcast for a Location Factory to make it
					if(this.locations){
						var snap = new Firebase('https://scorching-fire-6566.firebaseio.com/reference-test/locations').push({
			                title: "untitled",
			                lat: lat,
			                lng: lng
			            });
						this.locations.set(snap.key(), true);
					}
				}

				marker_dragged(key, value, lat, lng){}

				set_center(lat,lng){
					this.map.setCenter(new google.maps.LatLng(lat,lng));
				}

				set_bounds(filter){
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
						// this.locations.load().then(this.set_bounds);
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
