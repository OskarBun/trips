import 'jspm_packages/npm/skeleton-css@2.0.4/css/skeleton.css!';
import 'jspm_packages/npm/font-awesome@4.4.0/css/font-awesome.min.css!';
import 'app/main.css!';
import Vue from 'vue';
import 'firebase';
import User from 'app/models/user';

let fireUrl = 'https://scorching-fire-6566.firebaseio.com/';

var appl = window.appl = new Vue({
            el: ".content",
            data:{
              user: null,
              view: "login",
              session: null
            },
            computed: {},
            methods: {},
            components: {},
            ready: function(){
              this.session = new Firebase(fireUrl);
              this.user = new User(fireUrl);
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
