import './main.css!';
import tmpl from './main-tmpl.html!text';
import Vue from 'vue';
import User from 'app/models/user';

Vue.component('users-panel', {
    data: function() {
        return {
            users: {}
        }
    },
    template: tmpl,
    props: ['adapter'],
    computed: {
        length: function(){
            return Object.keys(this.users).length
        }
    },
    methods: {},
    ready: function() {
        this.base = this.adapter._base;
        this.base.once('value', (snap)=>{
            for(var key in snap.val()) {
                this.users.$add(key, new User(`${this.$root.base_url}users/${key}`));
            }
        });
        this.add = this.base.on('child_added', (snap) => {
            var key = snap.key()
            this.users.$add(key, new User(`${this.$root.base_url}users/${key}`));
        });
        this.remove = this.base.on('child_removed', (snap) => {
            this.users.$delete(snap.key());
        });
    },
    beforeDestroy: function() {
        this.base.off('child_added', this.add);
        this.base.off('child_removed', this.remove);
    }
});
