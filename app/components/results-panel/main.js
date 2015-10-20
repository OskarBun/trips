import './main.css!';
import tmpl from './main-tmpl.html!text';
import Vue from 'vue';

Vue.component('results-panel', {
    template: tmpl,
    data: function(){
        return {
            results: null
        }
    },
    props: [],
    methods : {
        highlight: function(index){
            this.$dispatch('highlight-result', index);
        }
    },
    events: {
        "search-results": function(e) {
            this.results = e;
        }
    }
});
