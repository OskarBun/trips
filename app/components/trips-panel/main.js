import './main.css!';
import tmpl from './main-tmpl.html!text';
import Vue from 'vue';
import Trip from 'app/models/trip';

Vue.filter('round', function(value) {
	return value ? value.toFixed(4) : null;
});

export default Vue.extend({
	data: function(){
		return {
			items: {},
			new_label: null
		};
	},
  	template: tmpl,
  	props: ['trip'],
	computed: {
		locations_adapter() {
			//Silly Async doesn't work quite well enough
			if(this.trip){
				return this.trip.locations_adapter;
			}
		}
	},
	methods: {
		add_trip(e) {
			e.preventDefault();
			if(this.new_label){
				var key = Trip.create_trip(this.$root.base_url+'trips', this.new_label);
				this.new_label = '';
				this.$route.router.go({ name: 'trip', params: { uid: key } });
			}
		},
		open_trip(key) {
			this.$route.router.go({ name: 'trip', params: { uid: key } });
		},

		remove_trip(key, e) {
			Trip.remove_trip(this.$root.base_url+'trips/'+key);
			e.stopPropagation();
		}
	},
	ready() {
		this.trip = null;
		this.items_adapter = Trip.list_trips(this.$root.base_url+'trips', this.items);
		this.items_adapter._base.on('child_removed', function(key){
			if(this.trip && this.trip.uid == key.key()){
				this.$route.router.go({name: 'trips'});
			}
		//Fat arrow wasn't working?!?!?
		}.bind(this));
	},
	events: {},
	watch:{}
});
