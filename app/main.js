import 'jspm_packages/npm/skeleton-css@2.0.4/css/skeleton.css!';
import 'jspm_packages/npm/font-awesome@4.4.0/css/font-awesome.min.css!';
import 'app/main.css!';
import Vue from 'vue';
import 'firebase';
import 'app/components/map-panel/main';



var appl = window.appl = new Vue({
            el: ".content",
            data:{
              text: "",
              chat: {},
              store: null,
              trip: null
            },
            computed: {},
            methods: {
              addMessage: function(e){
                this.store.push(this.text);
                this.text = ""
                e.preventDefault();
              }
            },
            components: {},
            ready: function() {
              this.store = new Firebase('https://scorching-fire-6566.firebaseio.com/');
              this.store.on('value', (snap) => {
                this.chat = snap.val() || {};
              });
              this.store.on('child_added', (snap) => {
                this.chat[snap.key()] = snap.val();
              });
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
