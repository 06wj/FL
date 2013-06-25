(function(){
	var Rect = FL.Rect = function(x, y, width, height){
		this.set(x, y, width, height);
	};

	Rect.prototype.set = function(x, y, width, height)
	{
		this.left = this.x = x||0;
		this.top = this.y = y||0;
		this.width = width||this.width||0;
		this.height = height||this.height||0;

		this.right = this.x + this.width;
		this.bottom = this.y + this.height;
	};

	Rect.prototype.intersects = function(rect){
		return rect.x <= this.right && this.x <= rect.right&&
			rect.y <= this.bottom && this.y <= rect.bottom;
	};

	Rect.prototype.hitTestPoint = function(x, y){
		return x>=this.x && x<=this.right&&
			y>=this.y && y<=this.bottom;
	}
})();