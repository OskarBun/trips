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
            trip: null,
            left_view: true,
            right_view: true
        }
    },
    methods: {
        toggle_left_view() {
            this.left_view = !this.left_view;
            this.map_resize();
        },
        toggle_right_view() {
            this.right_view = !this.right_view;
            this.map_resize();
        },
        map_resize() {
            this.$root.$broadcast("map-container-resize");
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
        },
        left_position() {
            return this.left_view ? "0" : "-20%";
        },
        right_position() {
            return this.right_view ? "0" : "-20%";
        },
        centre_position() {
            var left  = this.left_view  ? "20%" : "0px",
                right = this.right_view ? "20%" : "0px";
            return "left: "+ left +"; right: "+ right +";";
        }
    },
    template: tmpl
});
