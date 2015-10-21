import './main.css!';
import tmpl from './main-tmpl.html!text';
import Vue from 'vue';

Vue.component('user-panel', {
	template: tmpl,
	props: ['user', 'root'],
	computed: {
		user_tag: function() {
			return this.user && this.user.username ? this.user.username : 'Login';
		},
		logged_in: function() {
			return this.user && this.user.logged_in;
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
	}
});
