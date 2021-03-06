import './main.css!';
import tmpl from './main-tmpl.html!text';
import Vue from 'vue';
import Location from 'app/models/location';
import Trip from 'app/models/trip';


function calc_content_height() {
    var panel = document.getElementsByClassName("LocationsPanel")[0],
        head  = panel.getElementsByClassName("title-bar")[0],
        foot  = panel.getElementsByClassName("action-bar")[0];
    return (panel.offsetHeight - head.offsetHeight - foot.offsetHeight) + 'px';
}

export let __hotReload = true;

export default Vue.extend({
    data: function() {
        return {
            locations: {},
            active_location: null,
			trip_title: null,
            content_height: "100%"
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
        remove_location(key, e) {
            var dead_adapter = this.locations[key].adapter;
            this.adapter.update({
                [key]: null
            }, ()=>{
                dead_adapter.set(null);
            });
            e.stopPropagation();
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
        show_location(key) {
            this.$route.router.go(`/${this.trip.uid}/${key}`);
        }
    },
    route: {
		data(transition) {
            var key, loc_key;
            [key, loc_key] = transition.to.params.path.split('/');
            if( !this.trip || (this.trip && this.trip.uid != key) ){
                this.trip = new Trip(`${this.$root.base_url}trips/${key}/`, true, key, (snap)=>{
                    if(!snap.val()) this.close_trip();
                });
                this.$root.$broadcast("show_trip", this.trip);
            }
            if(loc_key){
                this.active_location = loc_key;
                this.$root.$broadcast('show_location', loc_key);
            }
            transition.next();
        },
        deactivate(transition) {
            this.trip = null;
            this.$root.$broadcast('hide_trip', this.trip);
            transition.next();
        }
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
    },
    ready(){
        this.$nextTick(() => {
            this.content_height = calc_content_height();
            this.panel_resize = () => this.content_height = calc_content_height();
            window.addEventListener( "resize", this.panel_resize );
        });
    },
    beforeDestroy(){
        window.removeEventListener( "resize", this.panel_resize );
    }
});
