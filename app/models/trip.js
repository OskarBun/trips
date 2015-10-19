import 'firebase';
import Vue from 'vue';

function errback(errorObject) {
  console.log("The read failed: " + errorObject.code);
});

var TRIPS_PATH = "trips/";
var LOCATION_PATH = "locations";


class Trip extends Vue {
	constructor(url){
		super({
			data: {
				name: null,
				locations: {}
			},
			methods:{
				add_location: function(lat,lng,label){
					var floc = this._base.child("locations").push({
						lat:lat,
						lng:lng,
						label:label
					});
				}
			}
		});
		var base = new Firebase(url);
		base.on("value",function(snapshot){
			var fdata = snapshot.val();
			this.name = fdata.name;
			this.locations = fdata.locations;
		},errback);
		base.child(LOCATION_PATH).on("child_added", function(snapshot, prevChildKey){
			this.locations.push(snapshot.val());
		});
		base.child(LOCATION_PATH).on("child_changed", function(snapshot){
			this.locations[snapshot.key()]=snapshot.val();
		});
		base.child(LOCATION_PATH).on("child_removed", function(snapshot){
			delete this.locations[snapshot.key()];
		});
		this._base = base;
	}
}



class TripFactory{
	constructor(url="https://scorching-fire-6566.firebaseio.com/"){
		this._url = url + TRIPS_PATH;
	}

	create_trip (name){
		var base = new Firebase(this._url);
		var ftrip = base.push({
			name: name, 
			locations: {} 
		});
		return new Trip(this._url + ftrip.key());
	}

	list_trips (container){
		var trips = new Firebase(this._url);
		trips.on("child_added",function(snapshot){
			container.push(snapshot.val());
		});
		return trips;
	}
}


export default TripFactory;