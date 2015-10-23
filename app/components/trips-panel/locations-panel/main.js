import './main.css!';
import tmpl from './main-tmpl.html!text';
import Vue from 'vue';
import Location from 'app/models/location';

Vue.component('locations-panel', {
    data: function() {
        return {
            locations: {}
        }
    },
    template: tmpl,
    props: ['lsadapter'],
    computed: {
        length: function(){
            return Object.keys(this.locations).length
        }
    },
    methods: {
        remove_location: function(key) {
            this.adapter.update({
                [key]: null
            });
        }
    },
    ready: function() {
        this.adapter = this.lsadapter._base;
        this.adapter.once('value', (snap)=>{
            for(var key in snap.val()) {
                this.locations.$add(key, new Location(`${this.$root.base_url}locations/${key}`));
            }
        });
        this.add = this.adapter.on('child_added', (snap) => {
            var key = snap.key()
            this.locations.$add(key, new Location(`${this.$root.base_url}locations/${key}`));
        });
        this.remove = this.adapter.on('child_removed', (snap) => {
            this.locations.$delete(snap.key());
        });
    },
    beforeDestroy: function() {
        this.adapter.off('child_added', this.add);
        this.adapter.off('child_removed', this.remove);
    }
});
