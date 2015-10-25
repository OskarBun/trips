import './main.css!';
import tmpl from './main-tmpl.html!text';
import Vue from 'vue';
import Location from 'app/models/location';
import Trip from 'app/models/trip';

export default Vue.extend({
    data: function() {
        return {
            locations: {},
			trip_title: null
        }
    },
    template: tmpl,
    props: ['trip'],
    computed: {
        length(){
            return Object.keys(this.locations).length
        },
        locations_adapter() {
			if(this.trip){
				return this.trip.locations_adapter;
			}
		}
    },
    methods: {
        remove_location(key) {
            var dead_adapter = this.locations[key].adapter;
            this.adapter.update({
                [key]: null
            }, ()=>{
                dead_adapter.set(null);
            });
        },
		close_trip() {
			this.$route.router.go({name:'trips'});
		},
        update_trip_name(e) {
			if(this.trip) {
				this.trip.adapter.change(
					{ label: this.trip.label },
					(error) => { if(error) this.trip.label = trip_title; }
				);
			}
			e.preventDefault();
			e.srcElement[0].blur();
		},
    },
    route: {
		data(transition) {
            var parsed = transition.to.params.path.split('/');
            var key = parsed[0];
            this.trip = new Trip(`${this.$root.base_url}trips/${key}/`, true, key, (snap)=>{
                if(!snap.val()) this.close_trip();
            });
            this.$root.$broadcast("show_trip", this.trip);
            transition.next();
        },
        deactivate(transition) {
            this.trip = null;
            this.$root.$broadcast('hide_trip', this.trip);
            transition.next();
        },
        canReuse: false
	},
    watch: {
        trip: function(value){
            if(value){
                this.adapter = value.locations_adapter._base;
                this.adapter.on('value', function(snap){
                    for(var key in snap.val()) {
                        this.locations.$add(key, new Location(`${this.$root.base_url}locations/${key}`));
                    }
                }.bind(this));
                this.add = this.adapter.on('child_added', (snap) => {
                    var key = snap.key()
                    this.locations.$add(key, new Location(`${this.$root.base_url}locations/${key}`));
                });
                this.remove = this.adapter.on('child_removed', (snap) => {
                    this.locations.$delete(snap.key());
                });
            }
        }
    }
});
