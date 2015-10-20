import './main.css!';
import tmpl from './main-tmpl.html!text';
import Vue from 'vue';
import TripFactory from "app/models/trip"

Vue.component('trips-panel', {
	data: function(){
		return {
			trips: {},
			new_label: null
		};
	},
  	template: tmpl,
  	props: ['trip_factory', 'trip'],
	methods: {
		"add_trip": function(){
			this.trip = this.trip_factory.create_trip(this.new_label);
		},
		"open_trip": function(key){
			this.trip = this.trip_factory.open_trip(key);
		},
		"close_trip": function(){
			this.trip = null;
		}
	},
	events: {
		"hook:attached": function(){
      this.trip_factory.list_trips(this.trips);
		},
		"hook:detached": function(){}
	},
	watch:{}
});
