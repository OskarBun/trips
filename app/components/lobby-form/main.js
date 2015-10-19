import './main.css!';
import tmpl from './main-tmpl.html!text';
import Vue from 'vue';

export default {
      template: tmpl,
      props: {
        lobby: {
          type: Object,
          twoWay: true
        },
        close: Function
      }
  };
