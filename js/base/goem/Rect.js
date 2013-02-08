(function(win){
	var Rect = win.Rect = function(x, y, width, height){
		this.set(x, y, width, height);
	};

	Rect.prototype.set = function(x, y, width, height)
	{
		this.x = x||0;
		this.y = y||0;
		this.width = width||this.width||0;
		this.height = height||this.height||0;
	};

	Rect.prototype.intersects = function(rect){
		return rect.x <= this.x + this.width && this.x <= rect.x + rect.width&&
			rect.y <= this.y + this.height && this.y <= rect.y + rect.height;
	};

	Rect.prototype.hitTestPoint = function(x, y){
		return x>=this.x && x<=this.x+this.width&&
			y>=this.y && y<=this.y+this.height;
	}
})(FL);