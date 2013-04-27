(function(win){
	var ns = FL.ns("billd");

	FL.import(FL, this, "Utils, Canvas");

	var Floor = ns.Floor = function(x, y, width, height){
		width = width||100;
		height = height||10;

		Canvas.call(this, x, y);
		this.cacheCtx.save();
		this.cacheCtx.fillStyle = "#000";
		this.cacheCtx.fillRect(0, 0, width, height);
		this.cacheCtx.restore();
		this.setImage(width, height);

		this.startPos = new Vector(x, y);
		this.pos = new Vector(x, y);
		this.v = new Vector(Math.random()*2+1, 0);
	};
	Utils.extends(Floor, Canvas);

	Floor.prototype.update = function(){
		this.x = this.pos.x + ns.map.x;
		this.y = this.pos.y + ns.map.y;

		this.pos.plus(this.v);

		if(this.pos.x > this.startPos.x + 600 || this.pos.x < this.startPos.x) this.v.x *= -1;
	};


})(window);