(function(win){
	var ns = FL.ns("billd");
	eval(FL.import("FL", "Utils, MovieClip"));
	
	var speed = .5;
	var Snail = ns.Snail = function(prop){
		MovieClip.call(this, prop);
		this.alive = true;
		this.pos = new Vector();
		this.v = new Vector(speed, 0);
		this.a = new Vector(0, .2);
		this.speed = speed;
	};
	Utils.extends(Snail, MovieClip);
	FL.merge(Snail.prototype, ns.moveable);

	Snail.prototype.init = function()
	{
		this.addAnimation("stand", [0, 0, 1], true, 1);
		this.time = 0;

		this.setImg(R.images["snail"], 32, 16);
		this.originX = this.width>>1;
		this.originY = this.height;
	};

	Snail.prototype.doSth = function()
	{
		var r = Math.random();
		this.scaleX = this.v.x>0?1:-1;
		if(r < .002) 
		{
			this.v.x *= -1;
		}
		if(r < .01) this.v.y = -.1;
	};


	Snail.prototype.update = function()
	{
		this.setPos();
	
		if(!this.isInStage) return;
		this.bounds = this.getBounds();
		this.time += this.timeStep;

		this.v.plus(this.a);
		if(this.v.y > 5) this.v.y = 5;
		this.pos.plus(this.v);
		this.a.x = 0;
		
		this.alive && this.checkMap();
		this.checkBounds();
		
		this.alive && this.doSth();
	};

	Snail.create = function(x, y)
	{
		var snail = new Snail();
		snail.init();
		snail.play("stand");
		snail.pos.set(x||0, y||0);
		snail.update();
		return snail;
	}

})(window);