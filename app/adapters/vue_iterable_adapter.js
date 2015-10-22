import Vue from "vue";
import FirebaseAdapter from 'app/adapters/firebase_adapter';

class VueFireIterable extends FirebaseAdapter {
	//container should be a observable {}
	constructor(container, path){
		super(path);
		this.container = container;

		this.init();
	}

	setted(value) {
		for(var key in value){
			this.container.$set(key,value[key]);
		}
	}

	added(key, value) {
        this.container.$add(key, value);
    }

    changed(key, value) {
        this.container.$set(key, value);
    }

    remove(key) {
        this.container.$delete(key);
    }
}

export default VueFireIterable;
