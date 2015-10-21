import './main.css!';
import tmpl from './main-tmpl.html!text';
import user_tmpl from './user-tmpl.html!text';
import trip_tmpl from './trip-tmpl.html!text';
import Vue from 'vue';
import Location from 'app/models/location';
import User from 'app/models/user';

var ReferenceLister = function(){
	return new Promise((resolve, reject) => {

	}
}

Vue.component('trips-panel', {
	data: function(){
		return {
			items: {},
			new_label: null
		};
	},
  	template: tmpl,
  	props: ['trips', 'trip'],
	computed: {
		locations: function() {
			// if(this.trip && this.trip.locations){
			// 	return Object.keys(this.trip.locations).map((key) => {
			// 		return new Location(`https://scorching-fire-6566.firebaseio.com/reference-test/locations/${key}`)
			// 	});
			// }
		},
		users: function() {
			// if(this.trip && this.trip.users){
			// 	return Object.keys(this.trip.users).map(key => {
			// 		return new User(`https://scorching-fire-6566.firebaseio.com/reference-test/users/${key}`)
			// 	});
			// }
		}
	},
	methods: {
		"add_trip": function(){
			this.trip = this.trips.create_trip(this.new_label);
			this.new_label = null;
		},
		"open_trip": function(key){
			this.trip = this.trips.open_trip(key);
		},
		"close_trip": function(){
			this.trip = null;
		}
	},
	events: {
		"hook:attached": function(){
      		this.items_adapter = this.trips.list_trips(this.items);
		},
		"hook:detached": function(){}
	},
	watch:{}
});

Vue.component('list-user', {
	template: user_tmpl,
	props: ['user']
});
