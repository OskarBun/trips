import 'firebase';


class FirebaseAdapter {
	constructor(path, base){
		if(base) this._base = base;
		else this._base = new Firebase(path);
	}

	/**
		if base is in the Firebase cache the
		callbacks to child_added will happen
		immediately - so call init at the end of
		you subclasses constructor.
	 */
	init(callback, errback){
		this._base.once('value', (snapshot) => {
			var value = snapshot.val()
			this.setted(value);
			if(callback) callback(snapshot);
		}, errback);
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

	path(){
		return this._base.toString();
	}

	off(){
		this._base.off();
	}

	set(value, callback){
		return this._base.set(value, callback);
	}


	/**
		will add a child to our base container
	 */
	add(value, callback){
		return this._base.push(value, callback);
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
	remove(key, callback){
		this._base.child(key).remove(callback);
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
