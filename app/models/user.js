import 'firebase';
import Vue from 'vue';

class User extends Vue {
  constructor(url){
    super({
      data: function() {
        return {
          username: null,
          location: null,
          loggedIn: false
        }
      },
      methods: {
        login: function() {
          this.loginWith('github');
        },
        logout: function() {
          this._session.unauth();
        },
        update: function(user) {
          new Firebase(`${this._url}users/${this._uid}`).update(user);
        },
        loginWith: function(provider) {
          this._session.authWithOAuthPopup(provider, function(error, authData) {
            if (error) {
              console.log("Login Failed!", error);
            }
          });
        }
      }
    });
    this._url = url;
    this._session = new Firebase(url);
    this._uid = null;
    this._session.onAuth((authData) => {
      if (authData) {
        console.log("User " + authData.uid + " is logged in with " + authData.provider);
        this._uid = authData.uid;
        let userSession = new Firebase(`${this._url}users/${authData.uid}`);
        userSession.on('value', (snap) => {
          let val = snap.val();
          if(!val){
            userSession.set({
              username: authData.github.username,
              location: null
            });
          } else {
            this.username = val.username;
            this.location = val.location
          }
          this.loggedIn = true
        });
      } else {
        console.log("User is logged out");
        this.username = null;
        this._uid = null;
        this.loggedIn = false;
      }
    });
  }
}

export default User;
