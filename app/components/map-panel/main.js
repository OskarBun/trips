import './main.css!';
import tmpl from './main-tmpl.html!text';
import Vue from 'vue';
import map_loader from "map";
import FirebaseAdapter from 'app/adapters/firebase_adapter';
	

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
	   		}

		   	class MapContainer{
				constructor(element){
					this.locations = null;
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
					if(this.locations){
						var rb = null, loc = null, marker=null;
						for(var key in this.locations.markers){
							marker = this.locations.markers[key];
							loc = marker.getPosition();
							if(rb===null){
								rb = new google.maps.LatLngBounds(loc, loc);
							} else {
								rb.extend(loc);
								loc = null;
							}
						};
						if(loc){
							this.map.setCenter(loc);
						} else if(rb){
							this.map.fitBounds(rb);
						}
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
  		"set_center": function(e){
  			if(this._map_container_){
  				this._map_container_.set_center(e.lat, e.lng);
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
