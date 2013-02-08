(function(win){
	var Rect = win.Rect;
	var QuadTree = win.QuadTree = function(rect){
		this.q1 = null;
		this.q2 = null;
		this.q3 = null;
		this.q4 = null;
		
		this.data = [];
		this.parent = null;
		this.rect = rect;
	};

	QuadTree.prototype.createChildren = function(depth){
		if(depth == 0) return;
		
		var rect = this.rect;
		var w = rect.width * .5;
		var h = rect.height * .5;

		this.q1 = new QuadTree(new Rect(rect.x + w, rect.y, w, h));
		this.q2 = new QuadTree(new Rect(rect.x, rect.y, w, h));
		this.q3 = new QuadTree(new Rect(rect.x, rect.y + h, w, h));
		this.q4 = new QuadTree(new Rect(rect.x + w, rect.y + h, w, h));

		this.q1.parent = this.q2.parent = this.q3.parent = this.q4.parent = this;
		
		this.q1.createChildren(depth-1);
		this.q2.createChildren(depth-1);
		this.q3.createChildren(depth-1);
		this.q4.createChildren(depth-1);
	};

	QuadTree.prototype.isIn = function(x, y){
		return x>=this.rect.x && x<this.rect.x+this.rect.width&&
			y>=this.rect.y && y<this.rect.y+this.rect.height;
	};
	
	QuadTree.prototype.add = function(v, x, y){
		if(!this.isIn(x, y)) return null;
		if(this.hasChildren()){
			return this.q1.add(v, x, y)||this.q2.add(v, x, y)||this.q3.add(v, x, y)||this.q4.add(v, x, y)
		}
		else{
			this.data.push(v);
			return this;
		}
	};

	QuadTree.prototype.remove = function(v, x, y){
		if(!this.isIn(x, y)) return null;
		if(this.hasChildren()){
			return this.q1.remove(v, x, y)||this.q2.remove(v, x, y)||this.q3.remove(v, x, y)||this.q4.remove(v, x, y)
		}
		else{
			var i = this.data.indexOf(v);
			if(i < 0) return null;
			else{
				this.data.splice(i, 1);
				return this;
			}
		}
	};

	QuadTree.prototype.hasChildren = function(){
		return this.q1&&this.q2&&this.q3&&this.q4;
	};

	QuadTree.prototype.getRectData =function(rect){
		if(!rect.intersects(this.rect)) return [];
		var result = this.data.slice();
		if(this.hasChildren()){
			result = result.concat(this.q1.getRectData(this.rect));
			result = result.concat(this.q2.getRectData(this.rect));
			result = result.concat(this.q3.getRectData(this.rect));
			result = result.concat(this.q4.getRectData(this.rect));
		};
		return result;
	};
})(FL);