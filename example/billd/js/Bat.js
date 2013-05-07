(function(win){
	var ns = FL.ns("billd");
	eval(FL.import("FL", "Utils, MovieClip"));
	var speed = 7;
	var Bat = ns.Bat = function(){
		MovieClip.apply(this, arguments);
		this.alive = true;
		this.pos = new Vector();
		this.v = new Vector(1, 0);
		this.a = new Vector(0, 0);
	};
	Utils.extends(Bat, MovieClip);

	Bat.prototype.init = function()
	{
		this.addAnimation("move", [0, 1, 2, 3], true, 4);
		this.setImg(R.images["bat"], 71, 48);
		this.setCenter();

		this.time = 0;
		this.state = "move";
	};

	Bat.prototype.update = function()
	{
		if(!this.target) return;

		if(this.state == "move")
		{
			this.a = this.target.pos.minusNew(this.pos);
			var l = this.a.getLength();
			l = l==0?.001:l;
			this.a.setLength(50/l);
			this.a.rotate(.2);
			if(Math.random()<.01) this.v.rotate(.1);
			if(l < 10)
			{
				this.state = "idle";
				this.a.set(0, -.1);
				this.v.y = -1;
				this.v.x *= 2;
			}
		}
		else if(this.state == "idle")
		{
			if(Math.abs(this.target.pos.x - this.pos.x) > 300 && Math.random()<.01)
			{
				this.state = "move";
				this.a.set(0, 0);
				this.v.set(0, 0);
			}
		}

		this.v.plus(this.a);
		this.v.cut(5);
		this.pos.plus(this.v);

		this.scaleX = this.v.x>0?1:-1;

		this.x = this.pos.x + ns.map.x;
		this.y = this.pos.y + ns.map.y;
	};

	Bat.create = function(x, y)
	{
		var bat = new Bat();
		/*bat.init();
		bat.play("move");
		bat.pos.set(x||0, y||0);
		bat.update();*/
		return bat;
	}

})(window);