import Vue from "vue";
import FirebaseAdapter from 'app/adapters/firebase_adapter';

class Foo extends FirebaseAdapter {
	constructor(container, path) {
		super(path);
		this.container = container;
		this.init();
	}

	setted(value) {
		//this.container = value;
		for(var key in value){
			this.container.$set(key,value[key]);
		}
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

class VueFire extends Vue {
    constructor(config, path){
        super(config);
        this.adapter = new Foo(this, path);
    }
}

export default VueFire;
