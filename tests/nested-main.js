import VueRouter from 'vue-router';
import Vue from 'vue';

Vue.use(VueRouter);

var router = new VueRouter()

router.map({
    '': {
        component: {
            template:   '<div class="foo">' +
                          '<h2>This is Foo!</h2>' +
                          '<router-view></router-view>' + // <- nested outlet
                        '</div>'
        },
        subRoutes: {
            '/': {
                component: {
                    template: '<h1>Hello</h1>',
                    route: {
                        data(transition) {
                            console.log("Hello - data");
                            transition.next()
                        }
                    }
                }
            },
            '/not': {
                component: {
                    template: '<h1>Not</h1>',
                    route: {
                        data(transition) {
                            console.log("not - data");
                            transition.next()
                        }
                    }
                }
            }
        }
    }
})

router.start({

}, 'body')
