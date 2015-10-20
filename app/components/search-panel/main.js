import './main.css!';
import tmpl from './main-tmpl.html!text';
import Vue from 'vue';
import map_loader from "map";


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
					var permitted = results.map(function(e){
						return {
							lat: e.geometry.location.lat,
							lng: e.geometry.location.lng,
							title: e.formatted_address
						}
					});
					callback(permitted);
		        } else {
		            console.error("Geocode error: " + status);
		        }
    		});
    	});
}

Vue.component('search-panel', {
	data: function(){
		return {
			location: null,
			search: null
		};
	},
  	template: tmpl,
	methods: {
		"do_search": function(e){
			e.preventDefault();
			code_address(this.search,function(result){
				this.$dispatch('search-results', result);
			}.bind(this));
		},
		"do_here": function(e){
			e.preventDefault();
			geo_location(function(result){
				this.location = result;
			}.bind(this));
		}
	},
	watch:{
		'location': function(val){
			if(val){
				this.$dispatch("search-location-set",{
					lat: val.lat(),
					lng: val.lng(),
					term: this.search
				});
			}
		}
	}
});
