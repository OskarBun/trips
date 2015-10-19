import 'jspm_packages/npm/skeleton-css@2.0.4/css/skeleton.css!';
import 'jspm_packages/npm/font-awesome@4.4.0/css/font-awesome.min.css!';
import 'app/main.css!';
import Vue from 'vue';
import 'app/components/lobby-finder/main';
import viewer from 'app/components/lobby-viewer/main';
import form from 'app/components/lobby-form/main';
import 'firebase';

var appl = window.appl = new Vue({
            el: ".content",
            data:{
                lobbies: {},
                lobbyKey: null,
                store: null
            },
            computed: {
              view: function() {
                return this.lobby ? 'lobby-viewer' : 'none'
              },
              lobby: function() {
                return this.lobbyKey ? this.lobbies[this.lobbyKey] : null;
              }
            },
            methods: {
              setLobby: function(key){
                this.lobbyKey = key
              },
              close: function(){
                this.lobbyKey = null
              },
              newLobby: function(){
                let lobby = {
                  battleground: ''
                }
                this.lobbyKey = this.store.push(lobby).key()
              },
              delete: function(key){
                new Firebase(`https://scorching-fire-6566.firebaseio.com/lobbies/${key}`).remove((error)=>{console.log(error);});
              }
            },
            components: {
              lobbyViewer: viewer,
              lobbyForm: form,
              none: {}
            },
            ready: function(){
              this.store = new Firebase('https://scorching-fire-6566.firebaseio.com/lobbies');
              this.store.on('value', (snap) => {
                this.lobbies = snap.val();
              });
              this.store.on('child_added', (snap) => {
                this.lobbies[snap.key()] = snap.val();
              });
              this.store.on('child_removed', (snap) => {
                delete this.lobbies[snap.key()];
              })
            }
        });
