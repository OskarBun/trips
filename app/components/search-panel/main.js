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
	   		if(postcode){
			    var geocoder = new googleApi.maps.Geocoder();
			    geocoder.geocode( { 'address': postcode }, function(results, status) {
			        if (status == googleApi.maps.GeocoderStatus.OK) {
						var permitted = results.map(function(e){
							return {
								lat: e.geometry.location.lat(),
								lng: e.geometry.location.lng(),
								title: e.formatted_address
							}
						});
						callback(permitted);
			        } else {
			            console.error("Geocode error: " + status);
			        }
	    		});
	    	}
	    	else {
	    		callback([]);
	    	}
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
			code_address(this.search, (result) => {
				this.$dispatch('search-location-results', result);
			});
		},
		"do_here": function(e){
			e.preventDefault();
			geo_location((result) => {
				this.location = result;
			});
		},
		"clear": function(e){
			e.preventDefault();
			this.search = null;
			code_address(this.search,(result) => {
				this.$dispatch('search-location-results', result);
			});
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
