import 'firebase';
import Vue from 'vue';

function errback(errorObject) {
  console.log("The read failed: " + errorObject.code);
}

var TRIPS_PATH = "trips/";
var LOCATION_PATH = "locations";


class Trip extends Vue {
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
		});
		var base = new Firebase(url);
		base.on("value",(snapshot) => {
			var fdata = snapshot.val();
			this.label = fdata.label;
			this.locations = fdata.locations || {};
		});
		base.child(LOCATION_PATH).on("child_added", (snapshot, prevChildKey) => {
			this.locations.$add(snapshot.key(), snapshot.val());
		});
		base.child(LOCATION_PATH).on("child_changed", (snapshot) => {
			this.locations.$set(snapshot.key(),snapshot.val());
		});
		base.child(LOCATION_PATH).on("child_removed", (snapshot) => {
			this.locations.$delete(snapshot.key());
		});
		this._base = base;
    this.locations_path = url+LOCATION_PATH;
	}
}

class TripFactory{
	constructor(url="https://scorching-fire-6566.firebaseio.com/"){
		this._url = url + TRIPS_PATH;
	}

	create_trip (label){
		var base = new Firebase(this._url);
		var ftrip = base.push({
			label: label,
			locations: {}
		});
		return new Trip(this._url + ftrip.key());
	}

	open_trip (key){
		return new Trip(this._url + key);
	}

	list_trips (container){
		var trips = new Firebase(this._url);
		trips.on("child_added",function(snapshot){
			container.$add(snapshot.key(), snapshot.val());
		});
		return trips;
	}
}


export default TripFactory;
