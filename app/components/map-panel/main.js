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

		   	class GoogleMap extends FirebaseAdapter{
				constructor(path, element){
					super(path);
					this.markers = {};
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
				    googleApi.maps.event.addListener(this.map, 'click',(e) => {
				    	if(this.to_do === null){
				        	this.to_do = setTimeout(() => {
				        		this.to_do = null;
				        		this.map_clicked(
				        			e.latLng.lat(),
				        			e.latLng.lng());
				        	},300);
				    	}
				    });
				    this.init();
				}

				dispose(){
					for(var marker in this.markers){
						this.markers[marker].map = null;
					}
					this.markers={};
				}

				map_clicked(lat,lng){
					this._base.push({
						title: "untitled",
						lat: lat,
						lng: lng
					});
				}

				marker_dragged(key, value, lat, lng){
					this._base.child(key).update({lat:lat, lng:lng});
				}

				added(key, value){
					var marker = new googleApi.maps.Marker({
		                map: this.map,
		                position: new google.maps.LatLng(value.lat,value.lng),
		                title: value.title,
		                draggable: true
		            });
		            this.markers[key]=marker;
		            googleApi.maps.event.addListener(marker, 'dragend', (e) => {
		                var location = marker.getPosition();
		                this.marker_dragged(key, value,location.lat(), location.lng());
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

				set_center(lat,lng){
					this.map.setCenter(new google.maps.LatLng(lat,lng));
				}
			}
	   		vm._map_ = new GoogleMap(vm.url, vm.$el);
		}, function(err) {
	        console.error(err);
	    });
}


Vue.component('map-panel', {
	data: function(){
		return {
			_map_: null
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
  				this._map_.dispose();
  				this._map_ = null;
  			}
  		},
  		"set_center": function(e){
  			if(this._map_){
  				this._map_.set_center(e.lat, e.lng);
  			}
  		}
  	}
});
