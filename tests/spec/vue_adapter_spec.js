import VueAdapter from "app/adapters/vue_adapter";
import Vue from "vue";
import jasmine from "jasmine-standalone";


class VueTest extends VueAdapter{
	constructor(){
		super(new Vue({
			data:{}
		}),'obj');
		this.output = [];
	}

	added(n,o){
		this.output.push([n,o]);
	}

	changed(n,o){
		this.output.push([n,o]);
	}

	removed(n,o){
		this.output.push([n,o]);
	}

	set_val(key, val){
		this._obj.$set(key,val);
	}

	del_val(key){
		this._obj.$remove(key);
	}

}


jasmine.describe("VueAdapter suite", function() {
	var adapter = new VueTest();
	it("should contruct", function() {
		expect(true).toBe(true);
	});
	it("should set a value", function() {
	 	adapter.set_val("foo","bar");
	 	expect(adapter._obj["foo"]).toBe("bar");
	});
	it("should update a value", function() {
	 	adapter.set_val("foo","bar2");
	 	expect(adapter._obj["foo"]).toBe("bar2");
	});
	it("should remove a value", function() {
	 	adapter.del_val("foo");
	 	expect(adapter._obj["foo"]).toBe(undefined);
	});
});