import 'firebase';


class FirebaseAdapter {
	constructor(path){
		this._base = new Firebase(path);

		this._base.on("child_added", (snapshot, prevChildKey) => {
			this.added(snapshot.key(), snapshot.val());
		});
		this._base.on("child_changed", (snapshot) => {
			this.changed(snapshot.key(),snapshot.val());
		});
		this._base.on("child_removed", (snapshot) => {
			this.removed(snapshot.key());
		});
	}

	added(key, value){

	}

	changed(key, value){

	}

	removed(key){

	}

}

export default FirebaseAdapter