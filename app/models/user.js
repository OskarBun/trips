import 'firebase';
import Vue from 'vue';

let defaults = {
  data: function() {
    return {
      username: null,
      location: null
    }
  }
}

class User extends Vue {
  constructor(url){
    super(defaults);
    this._url = url;
    this._session = new Firebase(url);
    this._uid = null;
    this.init();
  }

  init(){
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
        });
      } else {
        console.log("User is logged out");
        this.username = null;
      }
    });
  }

  update(user) {
    new Firebase(`${this._url}users/${this._uid}`).update(user);
  }

  login() {
    this.loginWith('github');
  }

  loginWith(provider) {
    this._session.authWithOAuthPopup(provider, function(error, authData) {
      if (error) {
        console.log("Login Failed!", error);
      }
    });
  }

  logout() {
    this._session.unauth();
  }
}

export default User;
