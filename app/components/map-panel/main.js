import './main.css!';
import tmpl from './main-tmpl.html!text';
import Vue from 'vue';
import map_loader from "map";
import TripFactory from "app/models/trip"


function getDescendantWithClass(element, clName) {
    var i, children = element.childNodes;
    for (i = 0; i < children.length; i++) {
        if (children[i].className &&
            children[i].className.split(' ').indexOf(clName) >= 0)
        {
            return children[i];
         }
     }
     for (i = 0; i < children.length; i++) {
         var match = getDescendantWithClass(children[i], clName);
         if (match !== null) {
             return match;
         }
     }
     return null;
}


        
function geo_location(callback){
	if (navigator.geolocation){
		navigator.geolocation.getCurrentPosition(function(position){
			map_loader({
		            libraries: ['places']
		        })
			   .then(function(googleApi) {
					var value = new googleApi.maps.LatLng(
							position.coords.latitude, 
							position.coords.longitude);
					callback(value);
				});
		});
    }
	else{
		console.error("Geolocation is not supported by this browser.");
	}
}


function code_address(postcode, callback){
	map_loader({
            libraries: ['geocoder']
        })
	   .then(function(googleApi) {
		    var geocoder = new googleApi.maps.Geocoder();
		    geocoder.geocode( { 'address': postcode }, function(results, status) {
		        if (status == googleApi.maps.GeocoderStatus.OK) {
		        	var value = results[0].geometry.location;
					callback(value);
		        } else {
		            console.error("Geocode error: " + status);
		        }
    		});
    	});
}

	

function googleMap(vm, element){
	map_loader({
            libraries: ['places']
        })
	   .then(function(googleApi) {
		   	class GoogleMap{
				constructor(vm, element){
					if(vm.location == null){
						vm.location = new google.maps.LatLng(54.8143,-2.9694);
			   		}
					var mapOptions = {
				    	center: vm.location,
				    	zoom: 15,
				    	mapTypeId: googleApi.maps.MapTypeId.MAP
					};
					this.vm = vm;
					this.map = new googleApi.maps.Map(element, mapOptions);
					this.to_do = null;
					this.markers = [];

				    googleApi.maps.event.addListener(map, 'dblclick', (e) => {
				        if(this.to_do){
				        	clearTimeout(this.to_do);
				    		this.to_do = null;
				        }
				    });
				    googleApi.maps.event.addListener(map, 'click',(e) => {
				    	if(this.to_do === null){
				        	this.to_do = setTimeout(function(){
				        		this.to_do = null;
				        		this.vm.do_map_clicked(e.latLng.lat(),e.latLng.lng());
				        	},300);
				    	}
				    });
					vm._map_ = this;
				}

				add_marker(item){
					var marker = new googleApi.maps.Marker({
		                map: map,
		                position: item.location,
		                title: item.title,
		                draggable: true
		            });
		            this.markers.push({marker:marker, item:item});
		            googleApi.maps.event.addListener(marker, 'dragend', (e) => {
		                var location = marker.getPosition();
		                this.vm.do_marker_dragged(marker.item,location.lat(), location.lng());
		            });
				}

				remove_marker(item){
					this.markers.some((marker, index) => {
						if(marker.item == item){
							this.markers.splice(index,1);
							return true;
						}
					});
				}

				set_center(location){
					this.map.setCenter(location);
				}
			}
	   		return new GoogleMap(vm, element);
		}, function(err) {
	        console.error(err);
	    });
}

Vue.component('map-panel', {
	data: function(){
		return {
			_map_: null,
			location: null,
			search: null,
			trip: null,
			trips: [],
			new_label: null
		};
	},
  	template: tmpl,
  	props: ['trip_factory'],
	methods: {
		"do_search": function(e){
			e.preventDefault();
			code_address(this.search,function(result){
				this.location = result;
			}.bind(this));
		},
		"do_here": function(e){
			e.preventDefault();
			geo_location(function(result){
				this.location = result;
			}.bind(this));
		},
		"add_trip": function(){
			this.trip = this.trip_factory.create_trip(this.new_label);
		},
		"open_trip": function(trip){
			this.trip = trip;
		},
		"close_trip": function(){
			this.trip = null;
		},
		"do_map_clicked": function(lat,lng){
			if(this.trip){
				this.trip.add_location(lat,lng,"untitled");
			}
		},
		"do_marker_dragged": function(item, lat, lng){
			this.trip.set_location(item, lat, lng);
		}
	},
  	events: {
  		"hook:attached": function(){
            this.trip_factory.list_trips(this.trips);
  			var element = getDescendantWithClass(this.$el, "map");
  			googleMap(this, element);
  		},
  		"hook:detached": function(){
  			this._map_ = null;
  		}
  	},
  	watch:{
  		"location": function(val){
  			if(val && this._map_){
  				this._map_.set_center(val);
  			}
  		}
  	}
});
