import Vue from "vue";
import FirebaseAdapter from 'app/adapters/firebase_adapter';

class VueFireArray extends FirebaseAdapter {
	//Should be a observable Array
	constructor(container, path){
		super(path);
		this.container = container;
        this.container.firebase = this;

		this.init();
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

export default VueFireArray;
