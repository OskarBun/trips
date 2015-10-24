import './main.css!';
import tmpl from './main-tmpl.html!text';
import Vue from 'vue';
import 'app/components/icon-component/main';
import 'app/components/map-panel/main';
import 'app/components/trips-panel/main';
import 'app/components/search-panel/main';

export default Vue.extend({
    template: tmpl,
    inherit: true
});
