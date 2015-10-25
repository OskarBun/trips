import Vue from "vue";
import FirebaseAdapter from 'app/adapters/firebase_adapter';

class Foo extends FirebaseAdapter {
	constructor(container, path, callback, errback) {
		super(path);
		this.container = container;
		this.init(callback, errback);
	}

	setted(value) {
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

	removed(key) {
		this.container[key] = null;
	}
}

class VueFire extends Vue {
    constructor(config, path, callback, errback){
        super(config);
        this.adapter = new Foo(this, path, callback, errback);
    }

	path() {
		return this.adapter.path();
	}
}

export default VueFire;
