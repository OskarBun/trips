import './main.css!';
import tmpl from './main-tmpl.html!text';
import Vue from 'vue';
import Trip from 'app/models/trip';


function calc_content_height() {
    var panel = document.getElementsByClassName("TripsPanel")[0],
        head  = panel.getElementsByClassName("title-bar")[0],
        foot  = panel.getElementsByClassName("action-bar")[0];
    return (panel.offsetHeight - head.offsetHeight - foot.offsetHeight) + 'px';
}


Vue.filter('round', function(value) {
	return value ? value.toFixed(4) : null;
});

export default Vue.extend({
	data: function(){
		return {
			items: {},
			new_label: null,
            content_height: "100%"
		};
	},
  	template: tmpl,
  	props: ['trip'],
	computed: {},
	methods: {
		add_trip(e) {
			e.preventDefault();
			if(this.new_label){
				var key = Trip.create_trip(this.$root.base_url+'trips', this.new_label);
				this.new_label = '';
				this.$route.router.go('/'+key);
			}
		},
		open_trip(key) {
			this.$route.router.go('/'+key);
		},

		remove_trip(key, e) {
			Trip.remove_trip(this.$root.base_url+'trips/'+key);
			e.stopPropagation();
		}
	},
	route: {
		data(transition){
			this.trip = null;
			this.items_adapter = Trip.list_trips(this.$root.base_url+'trips', this.items);
			this.items_adapter._base.on('child_removed', function(key){
				if(this.trip && this.trip.uid == key.key()){
					this.$route.router.go({name: 'trips'});
				}
			//Fat arrow wasn't working?!?!?
			}.bind(this));
			transition.next();
		}
	},
    ready(){
        this.$nextTick(() => {
            this.content_height = calc_content_height();
            this.panel_resize = () => this.content_height = calc_content_height();
            window.addEventListener( "resize", this.panel_resize );
        });
    },
    beforeDestroy(){
        window.removeEventListener( "resize", this.panel_resize );
    }
});
