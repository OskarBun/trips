import Vue from "vue";
import FirebaseAdapter from 'app/adapters/firebase_adapter';

class VueFire extends FirebaseAdapter {
    constructor(config, path){
        super(path);
        this.container = new Vue(config);
		this.container.firebase = this;

        this.init();
    }

    added(key, value) {
        this.container[key] = value;
    }

    changed(key, value) {
        this.container[key] = value;
    }

    remove(key) {
        this.container[key] = null;
    }
}
