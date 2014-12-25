(function(win){
	var ns = FL.ns("billd");
	eval(FL.import("FL", "Utils, MovieClip"));
	
	var speed = 1.5;
	var Spider = ns.Spider = function(prop){
		MovieClip.call(this, prop);
		this.alive = true;
		this.pos = new Vector();
		this.v = new Vector(speed, 0);
		this.a = new Vector(0, .2);
		this.speed = speed;
		this.onGround = false;
	};
	Utils.extends(Spider, MovieClip);
	FL.merge(Spider.prototype, ns.moveable);

	Spider.prototype.init = function()
	{
		this.addAnimation("stand", "0-9", true, 6);
		this.time = 0;

		this.setImg(R.images["spider"], 41, 24);
		this.originX = this.width>>1;
		this.originY = this.height - 5;
	};

	Spider.prototype.doSth = function()
	{
		var r = Math.random();
		this.scaleX = this.v.x>0?1:-1;
		if(r < .002) 
		{
			this.v.x = -1 * speed;
		}
	};

	Spider.prototype.attack = function(){
		this.scaleX = this.scaleY = 1.4;
		var that = this;
		setTimeout(function(){
			that.scaleX = that.scaleY = 1;
		}, 300)
	};

	Spider.prototype.update = function()
	{
		this.setPos();
		
		if(!this.isInStage) return;
		this.bounds = this.getBounds();
		this.time += this.timeStep;

		this.v.plus(this.a);
		if(this.v.y > 5) this.v.y = 5;
		this.pos.plus(this.v);
		this.a.x = 0;
		
		this.alive && this.checkMap(ns.map);
		this.checkBounds();

		this.alive && this.doSth();
	};

	Spider.create = function(x, y)
	{
		var ball = new Spider();
		ball.init();
		ball.play("stand");
		ball.pos.set(x||0, y||0);
		ball.update();
		return ball;
	}

})(window);