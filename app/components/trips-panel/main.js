import './main.css!';
import tmpl from './main-tmpl.html!text';
import user_tmpl from './user-tmpl.html!text';
import trip_tmpl from './trip-tmpl.html!text';
import Vue from 'vue';
import User from 'app/models/user';
import Locations_Panel from 'app/components/locations-panel/main';

Vue.filter('round', function(value) {
	return Math.round(value);
});

Vue.component('trips-panel', {
	data: function(){
		return {
			items: {},
			new_label: null,
			locations: {},
			users: {},
			trip_title: null
		};
	},
  	template: tmpl,
  	props: ['trips', 'trip'],
	computed: {
		locations_adapter: function() {
			//Silly Async doesn't work quite well enough
			if(this.trip){
				return this.trip.locations_adapter;
			}
		}
	},
	methods: {
		"add_trip": function(e){
			e.preventDefault();
			this.trip = this.trips.create_trip(this.new_label);
			this.new_label = null;
		},
		"open_trip": function(key){
			this.trip = this.trips.open_trip(key);
		},
		"update_trip_name": function(e) {
			if(this.trip) {
				this.trip.adapter.change(
					{ label: this.trip.label }, 
					(error) => { if(error) this.trip.label = trip_title; }
				);
			}
			e.preventDefault();
			e.srcElement[0].blur();
		},
		"close_trip": function(){
			this.trip = null;
		},
		"remove_trip": function(){
			// add delete stuff here
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

Vue.component('user-list', {
	template: user_tmpl,
	props: ['user']
});
