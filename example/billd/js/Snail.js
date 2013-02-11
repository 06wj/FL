(function(win){
	var ns = FL.ns("billd");
	FL.import(FL, this, "Utils, MovieClip");
	var speed = .5;
	var Snail = ns.Snail = function(){
		MovieClip.apply(this, arguments);

		this.pos = new Vector();
		this.v = new Vector(speed, 0);
		this.a = new Vector(0, .2);
	};
	Utils.extends(Snail, MovieClip);

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
		this.time += this.timeStep;

		this.v.plus(this.a);
		if(this.v.y > 5) this.v.y = 5;
		this.pos.plus(this.v);
		this.a.x = 0;
		if(Snail.map)
		{
			if(this.v.y > 0)
			{
				for(var i = 0, lines = Snail.map.lines,l = lines.length;i < l;i ++)
				{
					var y = lines[i].getY(this.pos.x);
					
					if(y && y <= this.pos.y + 2 && y >= this.pos.y - 5)
					{
						this.pos.y = y;
						this.v.y = 0;
						this.angle = lines[i].getAngle();
						break;
					}
				}
			}
			if(this.pos.x < this.width) {
				this.pos.x = this.width;
				this.v.x = speed;
			}
			if(this.pos.x > Snail.map.width-this.width) {
				this.pos.x = Snail.map.width-this.width;
				this.v.x = speed * -1;
			}
			this.x = this.pos.x + Snail.map.x;
			this.y = this.pos.y + Snail.map.y;

			this.doSth();
		}
	};

	Snail.create = function(x, y)
	{
		var ball = new Snail();
		ball.init();
		ball.play("stand");
		ball.pos.set(x||0, y||0);
		return ball;
	}

})(window);