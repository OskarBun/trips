import 'firebase';


class FirebaseAdapter {
	constructor(path){
		this._base = new Firebase(path);
	}

	/**
		if base is in the Firebase cache the
		callbacks to child_added will happen
		immediately - so call init at the end of
		you subclasses constructor.
	 */
	init(){
		this._base.on('value', (snapshot) => {
			if(snapshot.val() === null){
				console.log(this);
			}
		});
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

	off(){
		this._base.off();
	}

	set(value){
		return this._base.set(value);
	}


	/**
		will add a child to our base container
	 */
	add(value){
		return this._base.push(value);
	}

	/**
		will update a child to our base container
	 */
	change(obj, callback){
		this._base.update(obj, callback);
	}

	/**
		will remove a child to our base container
	 */
	remove(key){
		this._base.child(key).remove();
	}

	/**
		called after inital load
		sub-class responsibilty
	*/
	setted(value){}

	/**
		called after load or add
		sub-class responsibility
	 */
	added(key, value){}

	/**
		called after change
		sub-class responsibility
	 */
	changed(key, value){}

	/**
		called after remove
		sub-class responsibility
	 */
	removed(key){}

}

export default FirebaseAdapter
