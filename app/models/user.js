import 'firebase';
import Vue from 'vue';

class User extends Vue {
  constructor(url){
    super({
      data: function() {
        return {
          username: null,
          profile-image: null,
          location: null,
          logged-in: false
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
          let permitted = {
            username: authData.github.username,
            profile-image: authData.github.profileImageURL
          }
          if(!snap.val()){
            userSession.set(permitted);
          } else {
            userSession.update(permitted, (error) => {
              Object.assign(this, permitted);
              this.logged-in = true
            });
          }

        });
      } else {
        console.log("User is logged out");
        this.username = null;
        this._uid = null;
        this.logged-in = false;
      }
    });
  }
}

export default User;
