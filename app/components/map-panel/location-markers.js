

import FirebaseAdapter from 'app/adapters/firebase_adapter';
import icons from './icons';


export default function(googleApi){

   class FireMarker extends googleApi.maps.Marker {
		constructor(config, path){
			super(config);
			this._base = new Firebase(path)
			if(config.draggable){
				googleApi.maps.event.addListener(this, 'dragend', (e) => {
					var location = this.getPosition();
					this._base.update({
						lat: location.lat(),
						lng: location.lng()
					})
				});
			}
		}

		load() {
			return new Promise((resolve, reject) => {
				this._base.on('value', (snap) => {
					var value = snap.val();
                    if(value){
    					this.setTitle(value.title);
    					this.setPosition(new googleApi.maps.LatLng(value.lat,value.lng));
                    }
					resolve();
				}, reject);
			})
		}
	}

	class LocationsAdapter extends FirebaseAdapter{

		constructor(container, path){
			super(path);
			this.container = container;
			this.markers = {};
            this.line = null;

			this.init();
		}

		dispose(){
			for(var marker in this.markers){
				this.markers[marker].setMap(null);
			}
			this.markers={};
            this.line.setMap(null);
            this.line = null;
			this.container = null;
			this.off();
		}

		added(key, value){
			var m = new FireMarker({
				map: this.container.map,
				icon: icons.RED_ICON,
				draggable: false
			}, this._base.root().toString()+'/locations/'+key, marker => this.markers[key] = marker);
			m.load().then(()=>{
				this.markers[key] = m;
				this.container.set_bounds('locations');
                this.container.set_line();
			});
		}

		changed(key, value){
			var marker = this.markers[key];
			if(marker){
				marker.setTitle(value.title);
				marker.setPosition(new googleApi.maps.LatLng(value.lat,value.lng));
			}
		}

		removed(key){
			var marker = this.markers[key];
			if(marker){
    			marker.setMap(null);
				delete this.markers[key]
                this.container.set_line();
			}
		}

		get_bounds(rb){
			var marker=null;
			for(var key in this.markers){
				marker = this.markers[key];
				let loc = marker.getPosition();
				if(rb===null){
					rb = new googleApi.maps.LatLngBounds(loc, loc);
				} else {
					rb.extend(loc);
				}
			};
			return rb;
		}

        get_line(){
            return Object.keys(this.markers).map((m)=>{
                return this.markers[m].getPosition();
            });
        }
	}

	return LocationsAdapter;

}
