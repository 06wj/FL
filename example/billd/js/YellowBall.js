(function(win){
	var ns = FL.ns("billd");
	eval(FL.import("FL", "Utils, MovieClip"));

	var speed = 2;
	var LIFE_TIME = 3600;
	var YellowBall = ns.YellowBall = function(){
		MovieClip.apply(this, arguments);

		this.pos = new Vector();
		this.v = new Vector(speed, 0);
		this.a = new Vector(0, .2);
		this.alive = true;
		this.onGround = false;

		this.time = 0;
		this.isDie = false;
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

	};

	YellowBall.prototype.update = function()
	{
		this.x = this.pos.x + ns.map.x;
		this.y = this.pos.y + ns.map.y;
		if(!this.isInStage) return;
		this.bounds = this.getBounds();
		this.time += this.timeStep;

		this.v.plus(this.a);
		if(this.v.y > 5) this.v.y = 5;
		this.pos.plus(this.v);
		this.a.x = 0;
		this.angle += .1;
		if(ns.map)
		{
			if(this.v.y > 0)
			{
				for(var i = 0, lines = ns.map.lines,l = lines.length;i < l;i ++)
				{
					var y = lines[i].getY(this.pos.x);
					
					if(y && y <= this.pos.y + 2 && y >= this.pos.y - 5)
					{
						this.pos.y = y;
						this.angle = lines[i].getAngle();
						this.v.rotate(-this.angle);
						this.v.y *= -1;
						this.v.rotate(this.angle);
						this.onGround = true;
						break;
					}
				}
			}

			if(this.v.y > 0 && this.onGround)
			{
				this.onGround = false;
				this.pos.minus(this.v);
				//this.v.x *= -1;
				this.v.y *= -1;
			}
			
			if(this.pos.x < this.width) {
				this.pos.x = this.width;
				this.v.x = speed;
			}
			if(this.pos.x > ns.map.width-this.width) {
				this.pos.x = ns.map.width-this.width;
				this.v.x = speed * -1;
			}
			this.doSth();

			this.time ++;
			if(this.time > LIFE_TIME){
				this.isDie = true;
			}

			if(this.isDie ||this.v.getLength2() < .5){
				var d = .01;
				this.alpha -= d;
				this.scaleX -= d/3;
				this.scaleY -= d/3;

				if(this.alpha <= 0){
					this.destroy();
				}
			}
		}
	};

	YellowBall.prototype.destroy = function(){
		var index = ns.yellowBalls.indexOf(this);
		if(index > -1) ns.yellowBalls.splice(index, index);
		this.parent && this.parent.removeChild(this);
	};

	YellowBall.create = function(x, y, v)
	{
		var ball = new YellowBall();
		ball.init();
		ball.play("stand");
		ball.pos.set(x||0, y||0);
		if(v) ball.v = v;
		return ball;
	}

})(window);