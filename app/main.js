import 'jspm_packages/npm/skeleton-css@2.0.4/css/normalize.css!';
import 'jspm_packages/npm/skeleton-css@2.0.4/css/skeleton.css!';
import 'jspm_packages/npm/font-awesome@4.4.0/css/font-awesome.min.css!';
import 'app/main.css!';
import Vue from 'vue';
import 'firebase';
import 'app/components/map-panel/main';
import 'app/components/trips-panel/main';
import 'app/components/user-panel/main';
import 'app/components/search-panel/main';
import 'app/components/results-panel/main';
import User from 'app/models/user';
import TripFactory from 'app/models/trip';


let fireUrl = 'https://scorching-fire-6566.firebaseio.com/'

var appl = window.appl = new Vue({
            el: "body",
            data:{
              user: new User(fireUrl),
              trips: new TripFactory(fireUrl),
              trip: null,
              loading: true,
              label: null
            },
            computed: {
              trip_url: function() {
                if(this.trip){
                  return this.trip.locations_path;
                }
              }
            },
            methods: {},
            components: {},
            ready: function(){
                this.loading = false;
            },
            events: {
                "search-location-set": function(e) {
                    this.$broadcast('set-center', e);
                },
                "search-location-results": function(e) {
                    this.$broadcast('search-results', e);
                },
                "highlight-result": function(e) {
                    this.$broadcast('highlight-result', e);
                },
                "add_location": function(e) {

                }
            }
        });


/*
##For in file definition
import './main.css!';
import tmpl from './main-tmpl.html!text';
import Vue from 'vue';

Vue.component('name', {
    	template: tmpl,
    	props: []
  });

##For in file export for component switching
import './main.css!';
import tmpl from './main-tmpl.html!text';
import Vue from 'vue';

export default {
      template: tmpl,
      props: ['lobby','close']
  };
*/
