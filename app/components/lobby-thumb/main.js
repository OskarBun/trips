import './main.css!';
import tmpl from './main-tmpl.html!text';
import Vue from 'vue';

Vue.component('lobby-thumb', {
    	template: tmpl,
    	props: ['lobby']
  });
