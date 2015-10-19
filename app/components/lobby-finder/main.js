import './main.css!';
import tmpl from './main-tmpl.html!text';
import Vue from 'vue';
import 'app/components/lobby-thumb/main';

Vue.component('lobby-finder', {
    	template: tmpl,
    	props: {
        lobbies: Object,
        setLobby: Function,
        remove: Function
      }
  });
