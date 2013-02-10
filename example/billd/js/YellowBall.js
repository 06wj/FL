(function(win){
	var ns = FL.ns("billd");
	FL.import(FL, this, "Utils, MovieClip");
	var speed = 2;
	var YellowBall = ns.YellowBall = function(){
		MovieClip.apply(this, arguments);

		this.pos = new Vector();
		this.v = new Vector(speed, 0);
		this.a = new Vector(0, .2);
	};
	Utils.extends(YellowBall, MovieClip);

	YellowBall.prototype.init = function()
	{
		this.addAnimation("stand", [0, 1], true, 2);
		this.time = 0;

		this.setImg(R.images["yellow_ball"], 11, 11);
		this.originX = this.width>>1;
		this.originY = this.height;
	};

	YellowBall.prototype.doSth = function()
	{
		var r = Math.random();
		if(r < .005) this.v.x *= -1;
		if(r < .01) this.v.y = -5;
	};

	YellowBall.prototype.update = function()
	{
		this.time += this.timeStep;

		this.v.plus(this.a);
		if(this.v.y > 5) this.v.y = 5;
		this.pos.plus(this.v);
		this.a.x = 0;
		if(YellowBall.map)
		{
			if(this.v.y > 0)
			{
				for(var i = 0, lines = YellowBall.map.lines,l = lines.length;i < l;i ++)
				{
					var y = lines[i].getY(this.pos.x);
					
					if(y && y <= this.pos.y + 2 && y >= this.pos.y - 5)
					{
						this.pos.y = y;
						this.v.y = 0;
						this.angle = lines[i].getAngle();
						this.a.x = Math.sin(this.angle) * (Math.cos(this.angle)>0?1:-1) * .07;

						break;
					}
				}
			}
			if(this.pos.x < this.width) {
				this.pos.x = this.width;
				this.v.x = speed;
			}
			if(this.pos.x > YellowBall.map.width-this.width) {
				this.pos.x = YellowBall.map.width-this.width;
				this.v.x = speed * -1;
			}
			this.x = this.pos.x + YellowBall.map.x;
			this.y = this.pos.y + YellowBall.map.y;

			this.doSth();
		}
	};

	YellowBall.create = function(x, y)
	{
		var ball = new YellowBall();
		ball.init();
		ball.play("stand");
		ball.pos.set(x||0, y||0);
		return ball;
	}

})(window);