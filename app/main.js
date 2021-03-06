import 'jspm_packages/npm/skeleton-css@2.0.4/css/normalize.css!';
import 'jspm_packages/npm/skeleton-css@2.0.4/css/skeleton.css!';
import 'jspm_packages/npm/font-awesome@4.4.0/css/font-awesome.min.css!';
import 'app/main.css!';
import Vue from 'vue';
import VueRouter from 'vue-router';
import 'firebase';
import Idle from 'idle';
import 'app/components/user-panel/main';
import locations_panel from 'app/components/locations-panel/main';
import trips_panel from 'app/components/trips-panel/main';
import map_page from'app/pages/content/main';
import profile_page from 'app/pages/profile/main';
import User from 'app/models/user';
import Trip from 'app/models/trip';
import {parse_auth_data} from 'app/utils/auth-data';

var fire_url = 'https://scorching-fire-6566.firebaseio.com/';
Vue.config.debug = true;
Vue.use(VueRouter);


function calc_content_height() {
    var user_panel = document.getElementsByClassName("UserPanel")[0];
    return (window.innerHeight - user_panel.offsetHeight) + 'px';
}


var router = window.router = new VueRouter({
    hashbang: true
});

router.map({
    '': {
        component: map_page,
        subRoutes: {
            '/': {
                component: trips_panel,
                name: 'trips'
            },
            '/*path': {
                component: locations_panel,
                name: 'trip'
            }
        }
    },
    '/user/:uid': {
        component: profile_page,
        name: 'user'
    }
});

// router.beforeEach((transition)=>{
//     console.log(transition);
//     transition.next();
// })

router.start({
    data() {
        return {
            base_url: fire_url,
            base: new Firebase(fire_url),
            user: null,
            loading: true,
            content_height: '100%'
        }
    },
    computed: {},
    methods: {},
    events: {},
    components: {},
    ready() {
        this.base.onAuth((auth_data) => {
            if (auth_data) {
                var user = new User(this.base_url+'users/'+auth_data.uid, auth_data.uid),
                    base = user.adapter._base;
                base.once('value', (snap) => {
                    var permitted = parse_auth_data[auth_data.provider](auth_data);
                    permitted.online = 'online';
                    if(!snap.val()){
                        user.adapter.set(permitted);
                    } else {
                        user.adapter.change(permitted);
                    }
                    base.onDisconnect().update({ online: 'offline' });
                    this.idle = new Idle({
        				onAway(){
                            user.adapter.change({online: 'away'});
                        },
        				onAwayBack(){
                            user.adapter.change({online: 'online'})
                        },
        				awayTimeout: 20000 //away with 20 seconds of inactivity
        			}).start();
                    this.user = user;
                });
            } else {
                this.user = null;
            }
        });

        this.$nextTick(() => {
            this.content_height = calc_content_height();
            window.addEventListener( "resize", () => this.content_height = calc_content_height() );
        });

        this.loading = false;
        window.app = this;
    }
}, 'body');
