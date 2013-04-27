(function(win){
	var ns = FL.ns("billd");
	FL.import(FL, this, "Utils, MovieClip");
	var speed = .5;
	var Snail = ns.Snail = function(){
		MovieClip.apply(this, arguments);
		this.alive = true;
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

	Snail.prototype.checkMap = function(map)
	{
		if(map && this.v.y > 0)
		{
			var dataArr = map.mapData[(this.x - map.x)>>0];
			if(dataArr){
				for(var i = 0, l = dataArr.length;i < l;i ++)
				{
					var data = dataArr[i];
					if(data.y <= this.pos.y + 2 && data.y >= this.pos.y - 5)
					{
						this.pos.y = data.y;
						this.v.y = 0;
						this.angle = data.ang;
						this.a.x = Math.sin(this.angle) * (Math.cos(this.angle)>0?1:-1) * .07;
						break;
					}
				}
			}
		}
	};

	Snail.prototype.update = function()
	{
		this.time += this.timeStep;

		this.v.plus(this.a);
		if(this.v.y > 5) this.v.y = 5;
		this.pos.plus(this.v);
		this.a.x = 0;
		
		this.alive && this.checkMap(ns.map);

		if(this.pos.x < this.width) {
			this.pos.x = this.width;
			this.v.x = speed;
		}
		if(this.pos.x > ns.map.width-this.width) {
			this.pos.x = ns.map.width-this.width;
			this.v.x = speed * -1;
		}
		this.x = this.pos.x + ns.map.x;
		this.y = this.pos.y + ns.map.y;

		this.alive && this.doSth();
	};

	Snail.create = function(x, y)
	{
		var ball = new Snail();
		ball.init();
		ball.play("stand");
		ball.pos.set(x||0, y||0);
		ball.update();
		return ball;
	}

})(window);