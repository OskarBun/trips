import VueFire from 'app/adapters/vue_adapter';

export default class Location extends VueFire {
    constructor(url){
		super({
			data: {
                title: null,
                lat: null,
                lng: null
            },
			methods:{}
		}, url);
    }
}
