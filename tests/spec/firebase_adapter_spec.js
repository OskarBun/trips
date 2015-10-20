import FirebaseAdapter from "app/adapters/firebase_adapter";


class BaseTest extends FirebaseAdapter{
	constructor(){
		super();
		this.output = [];
	}

	setted(val){
		this.output.push(["setted",key, val]);
	}

	added(key, val){
		this.output.push(["added",key, val]);
	}

	changed(key, val){
		this.output.push(["changed",key,val]);
	}

	removed(key){
		this.output.push(["removed",key]);
	}

}


/**
describe("VueAdapter suite", function() {
	var adapter = new BaseTest();

	it("should contruct", function() {
		expect(true).toBe(true);
	});
	it("should set a value", function() {
	 	adapter.set("foo","bar");
	 	expect(adapter._obj.foo).toBe("bar");
	});
	it("should update a value", function() {
	 	adapter.set("foo","bar2");
	 	expect(adapter._obj.foo).toBe("bar2");
	});
	it("should remove a value", function() {
	 	adapter.set("foo");
	 	expect(adapter._obj["foo"]).toBe(undefined);
	});
});
*/