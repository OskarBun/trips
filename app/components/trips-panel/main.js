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
			users: {}
		};
	},
  	template: tmpl,
  	props: ['trips', 'trip'],
	computed: {},
	methods: {
		"add_trip": function(){
			this.trip = this.trips.create_trip(this.new_label);
			this.new_label = null;
		},
		"open_trip": function(key){
			this.$dispatch('show-trip', key);
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

Vue.component('user-list', {
	template: user_tmpl,
	props: ['user']
});
