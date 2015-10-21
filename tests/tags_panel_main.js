import 'jspm_packages/npm/skeleton-css@2.0.4/css/normalize.css!';
import 'jspm_packages/npm/skeleton-css@2.0.4/css/skeleton.css!';
import 'jspm_packages/npm/font-awesome@4.4.0/css/font-awesome.min.css!';
import 'jspm_packages/github/brianreavis/selectize.js@0.12.1/css/selectize.default.css!';


import Vue from 'vue';
import "app/components/tags-panel/main";

Vue.config.debug = true;

var appl = window.appl = new Vue({el: "body"});