import './main.css!';
import tmpl from './main-tmpl.html!text';
import Vue from 'vue';

Vue.component('user-panel', {
      template: tmpl,
      props: ['user'],
      computed: {}
  });
