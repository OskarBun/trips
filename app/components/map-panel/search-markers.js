
import Vue from 'vue';
import icons from './icons';
import info_tmpl from './info-tmpl.html!text';


export default function(googleApi){

	class SearchResultsAdapter{
		constructor(container, results){
			this.markers = [];
			this.container = container;
			results.map((item) => {
			let marker = new googleApi.maps.Marker({
                map: container.map,
                position: new googleApi.maps.LatLng(item.lat,item.lng),
                title: item.title,
                icon: icons.BLUE_ICON
            });
			let info = new googleApi.maps.InfoWindow();
            googleApi.maps.event.addListener(marker, 'click', (e) => {
            	if (e.stop) {
            	    e.stop();
            	}
            	this.open_info(marker,info,item);
            });
				this.markers.push({m:marker,i:info});
			});
		}

		dispose(){
			this.markers.map(function(item){
				item.m.setMap(null);
				item.i.setMap(null);
			});
		}

		open_info(marker, info, item){
				var id = "info_" + new Date().getMilliseconds();
			info.setContent('<div id="'+id+'">loading...</div>');
	        info.open(this.container.map,marker);
			new Vue({
				el:"#"+id,
				template: info_tmpl,
				data:item,
				methods: {
					addLocation: function(){
						this.$dispatch('addLocation', this.item);
					}
				}
			});
		}

		get_bounds(rb){
			this.markers.map((marker) => {
				let loc = marker.m.getPosition();
				if(rb===null){
					rb = new googleApi.maps.LatLngBounds(loc, loc);
				} else {
					rb.extend(loc);
				}
			});
			return rb;
		}

		hilite(index){
			this.markers.map((item, i) => {
				item.m.setIcon(i===index ? icons.GREEN_ICON: icons.BLUE_ICON);
			});
		}
	}

	return SearchResultsAdapter;
}