import './main.css!';
import tmpl from './main-tmpl.html!text';
import Vue from 'vue';
import './collab-panel/main';

Vue.component('user-panel', {
	template: tmpl,
	props: ['user', 'root'],
	computed: {
		users_adapter: function() {
			if(this.trip){
				return this.trip.users_adapter;
			}
		}
	},
	methods: {
		logout: function() {
			this.root.unauth();
		},
		login: function(provider) {
			this.root.authWithOAuthPopup(provider, function(error, authData) {
				if (error) {
					console.log("Login Failed!", error);
				}
			});
		}
	},
	events: {}
});
