import Vue from "vue";


class VueAdapter {
	constructor(obj, key){
		this._obj = obj;
		this._obj.$watch((a,b) => {
			console.log(a,b);
		},{
		  deep: true
		});
	}

	added(){

	}

	changed(){

	}

	removed(){

	}
}

export default VueAdapter