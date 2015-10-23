import 'firebase';
import Vue from 'vue';
import VueFire from 'app/adapters/vue_adapter';
import VueFireIterable from 'app/adapters/vue_iterable_adapter';

var TRIPS_PATH = "trips/";
var LOCATION_PATH = "locations/";
var USERS_PATH = "users/"

class Trip extends VueFire {
    constructor(url, deep=false, key){
		super({
			data: {
				label: null,
				locations: {},
                users: {}
			},
			methods:{}
		}, url);
        this.uid = key;
        if(deep === undefined || deep){
            this.locations_path = url+LOCATION_PATH;
            this.locations_adapter = new VueFireIterable(this.locations, this.locations_path);
            this.users_adapter = new VueFireIterable(this.users, url+USERS_PATH);
        }
    }
}

class TripFactory {
	constructor(url="https://scorching-fire-6566.firebaseio.com/"){
		this._url = url + TRIPS_PATH;
	}

	create_trip (label){
		var base = new Firebase(this._url);
        var users = {};
        users[base.getAuth().uid] = true
		var ftrip = base.push({
			label: label,
			locations: {},
            users: users
		});
		return new Trip(this._url + ftrip.key() + '/', true, ftrip.key());
	}

	open_trip (key){
		return new Trip(this._url + key + '/', true, key);
	}

	list_trips (container){
		return new VueFireIterable(container, this._url);
	}

    remove_trip (key){
        var dead = new Trip(this._url+key+'/');
        var locations = Object.keys(dead.locations);
        dead.adapter.set(null, (error) => {
            if(!error){
                var locations_ref = dead.adapter._base.root().child('locations')
                locations.forEach((location)=> {
                    locations_ref.update({
                        [location]: null
                    });
                })
            }
        });
    }
}


export default TripFactory;
