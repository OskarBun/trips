import 'jspm_packages/npm/skeleton-css@2.0.4/css/skeleton.css!';
import 'jspm_packages/npm/font-awesome@4.4.0/css/font-awesome.min.css!';
import 'app/main.css!';
import Vue from 'vue';
import 'firebase';
import 'app/components/map-panel/main';
import User from 'app/models/user';
import TripFactory from 'app/models/trip';


let fireUrl = 'https://scorching-fire-6566.firebaseio.com/'

var appl = window.appl = new Vue({
            el: ".content",
            data:{
              store: null,
              trip: null,
              trips: {},
              user: null
            },
            computed: {
              name: function() {
                return this.user.username || '';
              }
            },
            methods: {
              addMessage: function(e){
                this.store.push(this.text);
                this.text = ""
                e.preventDefault();
              }
            },
            components: {},
            ready: function() {
              this.store = new Firebase(fireUrl);
              this.user = new User(fireUrl);
              this._trip_factory = new TripFactory(fireUrl);
              this._trip_factory.list_trips(this.trips);
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
