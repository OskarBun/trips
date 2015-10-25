import './main.css!';
import tmpl from './main-tmpl.html!text';
import Vue from 'vue';
import User from 'app/models/user';

Vue.component('collab-panel', {
    data: function() {
        return {
            users: {},
            show: false
        }
    },
    template: tmpl,
    props: [],
    computed: {},
    methods: {
        "add_collaborator": function() {
            // add user stuff
        }
    },
    events: {
        show_trip(e) {
            this.base = e.users_adapter._base;
            this.base.once('value', (snap)=>{
                for(var key in snap.val()) {
                    this.users.$add(key, new User(`${this.$root.base_url}users/${key}`, key));
                }
            });
            this.add = this.base.on('child_added', (snap) => {
                var key = snap.key()
                this.users.$add(key, new User(`${this.$root.base_url}users/${key}`, key));
            });
            this.remove = this.base.on('child_removed', (snap) => {
                this.users.$delete(snap.key());
            });
            this.show = true;
        },
        hide_trip(e) {
            this.base.off('child_added', this.add);
            this.base.off('child_removed', this.remove);
            this.base = null;
            this.users = {}
            this.show = false
        }
    },
    ready: function() {
        // this.base = this.adapter._base;
        // this.base.once('value', (snap)=>{
        //     for(var key in snap.val()) {
        //         this.users.$add(key, new User(`${this.$root.base_url}users/${key}`, key));
        //     }
        // });
        // this.add = this.base.on('child_added', (snap) => {
        //     var key = snap.key()
        //     this.users.$add(key, new User(`${this.$root.base_url}users/${key}`, key));
        // });
        // this.remove = this.base.on('child_removed', (snap) => {
        //     this.users.$delete(snap.key());
        // });
    },
    beforeDestroy: function() {
        // this.base.off('child_added', this.add);
        // this.base.off('child_removed', this.remove);
    }
});
