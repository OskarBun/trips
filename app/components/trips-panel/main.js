import './main.css!';
import tmpl from './main-tmpl.html!text';
import Vue from 'vue';
import User from 'app/models/user';
import Locations_Panel from './locations-panel/main';

Vue.filter('round', function(value) {
	return Math.round(value);
});

Vue.component('trips-panel', {
	data: function(){
		return {
			items: {},
			new_label: null,
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
			if(this.new_label){
				this.trip = this.trips.create_trip(this.new_label);
				this.new_label = '';
			}
		},
		"open_trip": function(key){
			//I Need to watch to see this's data ever get's set to null
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
		"remove_trip": function(key, e){
			this.trips.remove_trip(key);
			e.stopPropagation();
		}
	},
	ready: function() {
		this.items_adapter = this.trips.list_trips(this.items);
		this.items_adapter._base.on('child_removed', function(key){
			debugger;
			if(this.trip && this.trip.uid == key.key()){
				this.trip = null;
			}
		}.bind(this));
	},
	events: {
		"hook:attached": function(){

		},
		"hook:detached": function(){}
	},
	watch:{
		"items": function(val){
			console.log(val);
		}
	}
});
