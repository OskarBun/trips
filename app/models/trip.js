import 'firebase';
import Vue from 'vue';
import VueFire from 'app/adapters/vue_adapter';
import VueFireArray from 'app/adapters/vue_array_adapter';

function errback(errorObject) {
  console.log("The read failed: " + errorObject.code);
}

var TRIPS_PATH = "trips/";
var LOCATION_PATH = "locations";

class Trip extends VueFire {
    constructor(url){
		super({
			data: {
				label: null,
				locations: {}
			},
			methods:{
				add_location: function(lat,lng,label){
					var floc = this._base.child("locations").push({
						lat:lat,
						lng:lng,
						label:label
					});
				},
				set_location: function(child, lat, lng){
					// send to firebase the change of location
					child.set({lat:lat, lng:lng});
				}
			}
		}, url);
        this.locations_path = url+'/'+LOCATION_PATH;
        new VueFireArray(this.locations, this.locations_path);
    }
}

class TripFactory {
	constructor(url="https://scorching-fire-6566.firebaseio.com/"){
		this._url = url + TRIPS_PATH;
	}

	create_trip (label){
		var base = new Firebase(this._url);
		var ftrip = base.push({
			label: label,
			locations: {}
		});
		return new Trip(this._url + ftrip.key()).container;
	}

	open_trip (key){
		return new Trip(this._url + key);
	}

	list_trips (container){
		var trips = new VueFireArray(container, this._url);
		return trips._base;
	}
}


export default TripFactory;
