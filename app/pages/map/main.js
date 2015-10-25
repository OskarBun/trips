import './main.css!';
import tmpl from './main-tmpl.html!text';
import Vue from 'vue';
import 'app/components/icon-component/main';
import 'app/components/map-panel/main';
import 'app/components/trips-panel/main';
import 'app/components/search-panel/main';

function calc_content_height() {
    var user_panel = document.getElementsByClassName("UserPanel")[0];
    return window.innerHeight - user_panel.offsetHeight;
}


export default Vue.extend({
    data() {
        return {
            trip: null,
            content_height: 500
        }
    },
    methods: {
        add_location(e) {
            if(this.trip){
                var snap = new Firebase(this.base_url+'locations').push({
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
    template: tmpl,
    ready(){
        this.$nextTick(() => {
            this.content_height = calc_content_height();
            window.addEventListener( "resize", () => this.content_height = calc_content_height() );
        });
    }
});
