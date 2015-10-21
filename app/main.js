import 'jspm_packages/npm/skeleton-css@2.0.4/css/normalize.css!';
import 'jspm_packages/npm/skeleton-css@2.0.4/css/skeleton.css!';
import 'jspm_packages/npm/font-awesome@4.4.0/css/font-awesome.min.css!';
import 'app/main.css!';
import Vue from 'vue';
import 'firebase';
import 'app/components/map-panel/main';
import 'app/components/trips-panel/main';
import 'app/components/user-panel/main';
import 'app/components/search-panel/main';
import 'app/components/results-panel/main';
import User from 'app/models/user';
import TripFactory from 'app/models/trip';


let fire_url = 'https://scorching-fire-6566.firebaseio.com/reference-test/';
Vue.config.debug = true;

function calc_content_height() {
    var user_panel = document.getElementsByClassName("UserPanel")[0];
    return window.innerHeight - user_panel.offsetHeight;
}

var appl = window.appl = new Vue({
    el: "body",
    data:{
        base_url: fire_url,
        base: new Firebase(fire_url),
        user: null,
        trips: new TripFactory(fire_url),
        trip: null,
        loading: true,
        label: null,
        content_height: 500
    },
    computed: {
        trip_url: function() {
            if(this.trip){
                return this.trip.locations_path;
            }
        }
    },
    methods: {},
    components: {},
    ready: function(){
        this.base.onAuth((authData) => {
            if (authData) {
                var user = new User(`${this.base_url}users/${authData.uid}`);
                user._uid = authData.uid;
                user.adapter._base.once('value', (snap) => {
                    let permitted = {
                        username: authData.github.username,
                        profile_image: authData.github.profileImageURL
                    }
                    if(!snap.val()){
                        user.adapter.set(permitted);
                    } else {
                        user.adapter.change(permitted, (error) => {
                            user.logged_in = true
                        });
                    }
                    this.user = user;
                });
            } else {
                console.log("User is logged out");
                this.user = null;
            }
        });
        this.$nextTick(() => {
            this.content_height = calc_content_height();
            window.addEventListener("resize", () => {
                this.content_height = calc_content_height();
            });
        });
        this.loading = false;
    },
    events: {
        "search-location-set": function(e) {
            this.$broadcast('set-center', e);
        },
        "search-location-results": function(e) {
            this.$broadcast('search-results', e);
        },
        "highlight-result": function(e) {
            this.$broadcast('highlight-result', e);
        },
        "add_location": function(e) {

        }
    }
});
