(function(win){
	var Heap = function(compare){
		this._heap = [];
		if(compare){
			this._compare = compare;
		}
		else{
			this._compare = function(a, b){return a - b};
		}
	};

	Heap.prototype.enqueue = function(v){
		this._heap.push(v);
		this._checkUp(this._heap.length - 1);
		return v;
	};
	
	Heap.prototype.dequeue = function(){
		if(this._heap.length < 3) return this._heap.shift();
		var last = this._heap.pop();
		var v = this._heap[0];
		var i = 0;
		var j = this._getSmallChild(i);
		while(j > 0){
			this._swap(i, j);
			i = j;
			j = this._getSmallChild(i);
		}

		this.update(i, last);
		return v;
	};
	
	Heap.prototype.update = function(i, v){
		this._heap[i] = v;
		
		var j = (i - 1) >> 1;
		if (i > 0 && this._compare(this._heap[j], this._heap[i]) > 0){
			this._swap(i, j);
			this._checkUp(j);
		}
		else{
			this._checkDown(i);
		}
	};

	Heap.prototype._swap = function(i, j){
		var temp = this._heap[i];
		this._heap[i] = this._heap[j];
		this._heap[j] = temp;
		return this;
	};

	Heap.prototype._checkDown = function(i){
		var j = this._getSmallChild(i);
		while (j && this._compare(this._heap[j], this._heap[i]) < 0)
		{
			this._swap(i, j);
			i = j;
			j = this._getSmallChild(i);
		}
	};
		
	Heap.prototype._checkUp = function(i){
		var j = (i - 1) >> 1;
		while (i > 0 && _compare(_heap[j], _heap[i]) > 0)
		{
			swap(i, j);
			i = j;
			j = (i - 1) >> 1;
		}
	};

	Heap.prototype._getSmallChild = function(i){
		var end = this._heap.length - 1;
		var l = (i<<1) + 1;
		var r = (i<<1) + 2;
		if(l > end) return null;
		if(r > end) return l;
		return this._compare(this._heap[l], this._heap[r])<0?l:r;
	};
	
	Heap.prototype.indexOf = function(v){
		return _heap.indexOf(v);
	};
	
	Heap.prototype.toString = Heap.prototype.valueOf = function(){
		return this._heap.toString();
	};
})(FL);