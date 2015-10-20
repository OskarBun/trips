import 'firebase';


class FirebaseAdapter {
	constructor(path){
		this._base = new Firebase(path);

		base.child(LOCATION_PATH).on("child_added", (snapshot, prevChildKey) => {
			this.added(snapshot.key(), snapshot.val());
		});
		base.child(LOCATION_PATH).on("child_changed", (snapshot) => {
			this.changed(snapshot.key(),snapshot.val());
		});
		base.child(LOCATION_PATH).on("child_removed", (snapshot) => {
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