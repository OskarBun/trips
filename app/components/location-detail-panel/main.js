import './main.css!';
import tmpl from './main-tmpl.html!text';
import Vue from 'vue';
import Location from 'app/models/location';

Vue.component('location-detail-panel', {
    template: tmpl,
    data() {
        return {
            location: null
        }
    },
    events: {
        show_location(key){
            this.location = new Location(`${this.$root.base_url}locations/${key}`);
        }
    }
});
