import './main.css!';
import tmpl from './main-tmpl.html!text';
import Vue from 'vue';
import Location from 'app/models/location';

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
			if(this.trip){
				return Object.keys(this.trip.locations).map((key) => {
					return new Location(`https://scorching-fire-6566.firebaseio.com/reference-test/locations/${key}`)
				})
			}
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
