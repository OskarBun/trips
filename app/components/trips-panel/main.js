import './main.css!';
import tmpl from './main-tmpl.html!text';
import Vue from 'vue';
import TripFactory from "app/models/trip"

Vue.component('trips-panel', {
	data: function(){
		return {
			items: {},
			new_label: null
		};
	},
  	template: tmpl,
  	props: ['trips', 'trip'],
	methods: {
		"add_trip": function(){
			this.trip = this.trips.create_trip(this.new_label);
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
      		this.trips.list_trips(this.items);
		},
		"hook:detached": function(){}
	},
	watch:{}
});
