import 'firebase';
import Vue from 'vue';
import VueFire from 'app/adapters/vue_adapter';
import VueFireIterable from 'app/adapters/vue_iterable_adapter';

var TRIPS_PATH = "trips/";
var LOCATION_PATH = "locations/";

class Trip extends VueFire {
    constructor(url){
		super({
			data: {
				label: null,
				locations: {},
                users: {}
			},
			methods:{}
		}, url);
        this.locations_path = url+LOCATION_PATH;
        this.locations_adapter = new VueFireIterable(this.locations, this.locations_path);
    }
}

class TripFactory {
	constructor(url="https://scorching-fire-6566.firebaseio.com/"){
		this._url = url + TRIPS_PATH;
	}

	create_trip (label, user){
		var base = new Firebase(this._url);
        var users = {};
        users[user._uid] = true;
		var ftrip = base.push({
			label: label,
			locations: {},
            users: users
		});
		return new Trip(this._url + ftrip.key() + '/');
	}

	open_trip (key){
		return new Trip(this._url + key + '/');
	}

	list_trips (container){
		return new VueFireIterable(container, this._url);
	}
}


export default TripFactory;
