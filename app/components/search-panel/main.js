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
								bounds: e.geometry.viewport, //This is going to make dad angry LatLngBounds
								lat: e.geometry.location.lat(),
								lng: e.geometry.location.lng(),
								title: e.formatted_address
							}
						});
						callback(permitted);
			        } else {
			            callback([])
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
			search: null,
			results: null,
			here_pending: false,
			search_pending: false
		};
	},
  	template: tmpl,
	methods: {
		"do_search": function(e){
			e.preventDefault();
			this.search_pending = true;
			code_address(this.search, (result) => {
				this.results = result;
				this.$root.$broadcast('search-results', result);
				this.search_pending = false;
			});
		},
		"do_here": function(e){
			e.preventDefault();
			this.here_pending = true;
			geo_location((result) => {
				this.here_pending = false;
				this.location = result;
			});
		},
		"clear": function(e){
			e.preventDefault();
			this.search = null;
			code_address(this.search,(result) => {
				this.results = null;
				this.$root.$broadcast('search-results', result);
			});
		},
		"highlight": function(index){
            this.$root.$broadcast('highlight-result', index);
        },
		"add_to_trip": function(result){
			this.$root.$broadcast("add_location",result)
			this.search = null;
			this.results = null;
			this.$root.$broadcast('search-results', []);
		},
		"set_bounds": function(bounds, e){
			e.stopPropagation();
			this.$root.$broadcast('set-bounds', bounds)
		}
	},
	watch:{
		"location": function(val){
			if(val){
				this.$root.$broadcast("set-center",{
					lat: val.lat(),
					lng: val.lng(),
					term: this.search
				});
			}
		}
	}
});
