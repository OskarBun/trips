import './main.css!';
import tmpl from './main-tmpl.html!text';
import Vue from 'vue';
import './users-panel/main';

Vue.component('user-panel', {
	template: tmpl,
	props: ['user', 'root', 'trip'],
	computed: {
		user_tag: function() {
			return this.user && this.user.username ? this.user.username : 'Login';
		},
		logged_in: function() {
			return this.user && this.user.logged_in;
		},
		users_adapter: function() {
			if(this.trip){
				return this.trip.users_adapter;
			}
		}
	},
	methods: {
		login: function() {
			this.loginWith('github');
		},
		logout: function() {
			this.root.unauth();
		},
		loginWith: function(provider) {
			this.root.authWithOAuthPopup(provider, function(error, authData) {
				if (error) {
					console.log("Login Failed!", error);
				}
			});
		}
	},
	events: {}
});
