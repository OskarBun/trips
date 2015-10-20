import Vue from "vue";


VueAdapter(){
	constructor(obj, key){
		this._obj = obj;
		this._obj.$watch("key",(newValue, oldValue) => {
			
		});
	}

	added(){

	}

	changed(){

	}

	removed(){

	}
}