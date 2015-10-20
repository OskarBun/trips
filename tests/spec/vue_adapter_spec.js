import FirebaseAdapter from "app/adapters/firebase_adapter";
import Vue from "vue";


class VueFire extends FirebaseAdapter {
    //Container should be a Vue
    constructor(config, path){
        super(path);
        this.container = new Vue(config);

        this.init();
    }

    added(key, value) {
        this.container.$add(key, value)
    }

    changed(key, value) {
        this.container.$set(key, value);
    }

    remove(key, value) {
        this.container.$delete(key);
    }
}

describe("VueAdapter suite", function() {
	var adapter = new VueFire(data: {
		label: null,
		locations: {}
	}, 'https://scorching-fire-6566.firebaseio.com/trips/-K1-bQ2NT5d2SEj26ZIZ');

	it("should contruct", function() {
		expect(true).toBe(true);
	});
	it("should set a value", function() {
	 	adapter.set_val("foo","bar");
	 	expect(adapter._obj.foo).toBe("bar");
	});
	it("should update a value", function() {
	 	adapter.set_val("foo","bar2");
	 	expect(adapter._obj.foo).toBe("bar2");
	});
	it("should remove a value", function() {
	 	adapter.del_val("foo");
	 	expect(adapter._obj["foo"]).toBe(undefined);
	});
});
