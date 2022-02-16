class Base {
	constructor() {
		this._add = this._add.bind(this);
		this.clear = this.clear.bind(this);
	}

	_add(cb) {
		this._cbs.push(cb);
	}

	clear() {
		this._cbs.forEach(cb => cb());
		this._cbs = [];
	}
}

Base.prototype._cbs = [];

export default Base;