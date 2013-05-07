(function(win){
	var ns = FL.ns("billd");
	eval(FL.import("FL", "Utils, MovieClip"));
	var speed = 7;
	var Fish = ns.Fish = function(){
		MovieClip.apply(this, arguments);
		this.alive = true;
		this.pos = new Vector();
		this.v = new Vector(0, 0);
		this.a = new Vector(0, .1);
	};
	Utils.extends(Fish, MovieClip);

	Fish.prototype.init = function()
	{
		this.addAnimation("move", [0, 1, 2, 3], true, 4);
		this.time = 0;

		this.setImg(R.images["fish"], 32, 42);
		this.originX = 0;
		this.originY = this.height>>1;
	};

	
	Fish.prototype.update = function()
	{
		this.time += this.timeStep;

		this.v.plus(this.a);
		this.pos.plus(this.v);

		if(this.pos.y > ns.map.height + this.height) 
		{
			this.v.y = -speed;
		}

		var scale = .8;
		this.scaleY = this.v.y>0?-scale:scale;
		this.scaleX = scale;

		this.x = this.pos.x + ns.map.x;
		this.y = this.pos.y + ns.map.y;

	};

	Fish.create = function(x, y)
	{
		var ball = new Fish();
		ball.init();
		ball.play("move");
		ball.pos.set(x||0, y||0);
		ball.update();
		return ball;
	}

})(window);