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
			// noop - forces node to load
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

	/** 
		will add a child to our base container 
	 */
	add(value){
		return this._base.push(value);
	}

	/** 
		will update a child to our base container 
	 */
	change(key,value){
		this._base.child(key).update(value);
	}

	/** 
		will remove a child to our base container 
	 */
	remove(key){
		this._base.child(key).remove();
	}

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