import './main.css!';
import tmpl from './main-tmpl.html!text';
import Vue from 'vue';
import User from 'app/models/user';

export default Vue.extend({
    data: function(){
        return {
            user: null
        }
    },
    template: tmpl,
    methods: {
        update(){
            this.user.adapter.change({
                color: this.user.color
            });
        }
    },
    created() {
        this.user = new User(this.base_url+'users/'+this.$route.params.uid, this.$route.params.uid);
    },
    inherit: true
})
