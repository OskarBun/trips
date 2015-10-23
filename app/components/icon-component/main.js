import './main.css!';
import tmpl from './flag-tmpl.svg!text';
import Vue from 'vue';

Vue.component('icon-component', {
  	template: tmpl,
  	props: [
  		"fill"
  	]
});