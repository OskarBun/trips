import 'firebase';
import VueFire from 'app/adapters/vue_adapter';
import VueFireIterable from 'app/adapters/vue_iterable_adapter';

var TRIPS_PATH = "trips/";
var LOCATION_PATH = "locations/";
var USERS_PATH = "users/"

export default class Trip extends VueFire {
    constructor(url, deep=false, key, callback){
		super({
			data: {
				label: null,
				locations: {},
                users: {}
			},
			methods:{}
		}, url, callback);
        this.uid = key;
        if(deep === undefined || deep){
            this.locations_path = url+LOCATION_PATH;
            this.locations_adapter = new VueFireIterable(this.locations, this.locations_path);
            this.users_adapter = new VueFireIterable(this.users, url+USERS_PATH);
        }
    }

    static create_trip (base_url, label){
		var base = new Firebase(base_url),
            users = {},
            uid = base.getAuth().uid
        users[base.getAuth().uid] = true
		var ftrip = base.push({
			label: label,
			locations: {},
            users: users
		});
		return ftrip.key()
	}

    static open_trip (base_url, key){
		return new Trip(base_url + key + '/', true, key);
	}

    static list_trips (url, container, filter){
        if(filter){
            var base = new Firebase(url).orderByValue("users")
        }
		return new VueFireIterable(container, url);
	}

    static remove_trip (url){
        var dead = new Trip(url);
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
