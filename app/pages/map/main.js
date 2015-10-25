import './main.css!';
import tmpl from './main-tmpl.html!text';
import Vue from 'vue';
import 'app/components/icon-component/main';
import 'app/components/map-panel/main';
import 'app/components/trips-panel/main';
import 'app/components/search-panel/main';



export default Vue.extend({
    data() {
        return {
            trip: null
        }
    },
    events: {
        add_location(e) {
            if(this.trip){
                var snap = new Firebase(this.$root.base_url+'locations').push({
                    title: e.title.split(',')[0],
                    lat: e.lat,
                    lng: e.lng
                });
                var change = { [snap.key()]: true }
                this.trip.locations_adapter.change(change);
            }
            return this.trip;
        }
    },
    computed: {
        trip_url() {
            if(this.trip) {
                return this.trip.locations_path;
            }
        }
    },
    template: tmpl
});
