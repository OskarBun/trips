import './main.css!';
import tmpl from './main-tmpl.html!text';
import Vue from 'vue';
import map_loader from "map";

import location_marker_loader from "./location-markers";
import search_markers_loader from "./search-markers";


function googleMap(vm){
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
				    	center: new googleApi.maps.LatLng(54.8143,-2.9694),
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
						var change = { [snap.key()]: true }
						this.locations.change(change);
					}
				}

				marker_dragged(key, value, lat, lng){}

				set_center(lat,lng){
					this.map.setCenter(new googleApi.maps.LatLng(lat,lng));
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
