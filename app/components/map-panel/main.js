import './main.css!';
import style from './resources/google_maps_theme.json!';
import tmpl from './main-tmpl.html!text';
import Vue from 'vue';
import map_loader from "map";

import location_marker_loader from "./location-markers";
import search_markers_loader from "./search-markers";

// Google maps style editor
// https://snazzymaps.com/editorhttps://snazzymaps.com/editor

function googleMap(vm, callback){
	map_loader({
            libraries: ['places']
        })
	   .then(function(googleApi) {

	   		let LocationsAdapter = location_marker_loader(googleApi);
	   		let SearchResultsAdapter = search_markers_loader(googleApi);

		   	class MapContainer{
				constructor(element){
					this.locations = null;
					this.search_results = null;
					this.to_do = null;

					var mapOptions = {
				    	center: new googleApi.maps.LatLng(51,0),
				    	zoom: 5,
				    	mapTypeId: googleApi.maps.MapTypeId.MAP,
				    	styles: style
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
						vm.$root.$broadcast("add_location", {
							title: "Clicked",
							lat: lat,
							lng: lng
						});
					}
				}

				set_center(lat,lng){
					this.map.setCenter(new googleApi.maps.LatLng(lat,lng));
				}

				set_bounds(filter, bounds){
					var rb = null;
					if(bounds){
						// var sw = new googleApi.maps.LatLng(bounds.se.lat, bounds.se.lng),
						// 	ne = new googleApi.maps.LatLng(bounds.nw.lat, bounds.nw.lng);
						// rb = new googleApi.maps.LatLngBounds(se, nw);
						rb = bounds;
					}
					if((!filter || filter == 'locations') && this.locations){
						rb = this.locations.get_bounds(rb);
					}
					if((!filter || filter == 'search') && this.search_results){
						rb = this.search_results.get_bounds(rb);
					}
					if(rb){
						this.map.fitBounds(rb);
					}
				}

				set_line(){
					if(this.locations){
						if(this.locations.line) this.locations.line.setMap(null);
						this.locations.line = new googleApi.maps.Polyline({
							path: this.locations.get_line(),
							strokeColor: "#FF8C8C",
							strokeWeight: 2,
							map: this.map,
							geodesic: true
						});
					}
				}

				set_locations(path){
					if(this.locations){
						this.locations.dispose();
						this.locations = null;
					}
					if(path){
						this.locations = new LocationsAdapter(this, path);
					}
				}

				set_zoom(zoom){
					this.map.setZoom(zoom);
				}

				set_search_results(results){
					if(this.search_results){
						this.search_results.dispose();
					}
					this.search_results = new SearchResultsAdapter(this,results);
					this.set_bounds('search');
				}

				hilite_search(index){
					if(this.search_results){
						this.search_results.hilite(index);
					}
				}

				resize(){
	                var center = this.map.getCenter();
					var resize_and_centre = (center) => {
	                    googleApi.maps.event.trigger(this.map,'resize');
	                    if(center) {
	                    	this.map.panTo(center);
	                    }
	                };

					var proj = this.map.getProjection()
					var point = proj.fromLatLngToPoint(center);
					point.x = point.x - 20;
					var new_center = proj.fromPointToLatLng(point);

	                // easing
					setTimeout(resize_and_centre,300);
					setTimeout(resize_and_centre,600);
	                setTimeout(resize_and_centre.bind(this,center),1000);
				}
			}
	   		vm._map_container_ = new MapContainer(vm.$el);
			callback();
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
  			googleMap(this, function(){
				if(this.url){
	  				this._map_container_.set_locations(this.url);
				}
			}.bind(this)); //Fat arrow didn't work again!!!!
  		},
  		"hook:detached": function(){
  			if(this._map_container_){
  				this._map_container_.dispose();
  				this._map_container_ = null;
  			}
  		},
  		"set-center": function(e){
  			if(this._map_container_){
  				this._map_container_.set_center(e.lat, e.lng);
				this._map_container_.set_zoom(16);
  			}
  		},
		"set-bounds": function(e){
			if(this._map_container_){
				this._map_container_.set_bounds('none', e)
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
		},
		"map-container-resize": function(e){
			if(this._map_container_){
                this._map_container_.resize();
            }
		}
  	},
  	watch:{
  		url(val){
  			if(this._map_container_){
  				this._map_container_.set_locations(val);
  			}
  		}
  	}
});
