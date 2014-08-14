(function(win){
	var ns = FL.ns("billd");

	eval(FL.import("FL", "Utils, Canvas"));

	var speedx = 2;
	var speedy = 2;

	var Floor = ns.Floor = function(fpoints, width, height){
		width = width||84;
		height = height||9;

		Canvas.call(this);
		this.cacheCtx.save();
		this.cacheCtx.fillStyle = "#BF8230";
		this.cacheCtx.fillRect(0, 0, width, height);
		this.cacheCtx.strokeRect(0, 0, width, height);
		this.cacheCtx.restore();
		this.setImage(width, height);

		this.init(fpoints);
	};
	Utils.extends(Floor, Canvas);

	Floor.prototype.init = function(fpoints) {
		this.fpoints = fpoints.data.map(function(p){return new Vector(p.x, p.y)});
		this.fpoints = this.fpoints.concat(this.fpoints.slice(1,-1).reverse());
		this.length = this.fpoints.length;

		this.pos = new Vector(this.fpoints[0].x, this.fpoints[0].y);
		this.v = new Vector();
		this.setState(1);
	}

	Floor.prototype.setState = function(state) {
		this.state = state%this.length;

		this.point = this.fpoints[this.state];
		this.dis = this.point.minusNew(this.fpoints[(this.state+this.length-1)%this.length]);
		this.v.x = this.dis.x == 0?0:this.dis.x > 0?speedx:-speedy;
		this.v.y = this.dis.y == 0?0:this.dis.y > 0?speedy:-speedy;
		this.v.set(this.dis.x, this.dis.y);
		this.v.setLength(2);
	};

	Floor.prototype.update = function(){
		this.x = this.pos.x + ns.map.x;
		this.y = this.pos.y + ns.map.y;

		this.pos.plus(this.v);

		if((this.dis.x > 0 && this.pos.x >= this.point.x)|| (this.pos.x <= this.point.x && this.dis.x < 0)) 
		{
			this.v.x = 0;
			this.pos.x = this.point.x;
		}
		if((this.dis.y > 0 && this.pos.y >= this.point.y) || (this.pos.y <= this.point.y && this.dis.y < 0)) 
		{
			this.v.y = 0;
			this.pos.y = this.point.y;
		}
		if(this.v.x == 0 && this.v.y == 0)
		{
			this.setState(this.state+1);
		}
	};


})(window);