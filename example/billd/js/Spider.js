(function(win){
	var ns = FL.ns("billd");
	FL.import(FL, this, "Utils, MovieClip");
	var speed = 1.5;
	var Spider = ns.Spider = function(){
		MovieClip.apply(this, arguments);
		this.alive = true;
		this.pos = new Vector();
		this.v = new Vector(speed, 0);
		this.a = new Vector(0, .2);
		this.onGround = false;
	};
	Utils.extends(Spider, MovieClip);

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

	Spider.prototype.checkMap = function(map)
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
						this.onGround = true;
						break;
					}
				}
			}
		}
		if(map && this.v.y > 0 && this.onGround)
		{
			this.onGround = false;
			this.pos.minus(this.v);
			this.v.x *= -1;
			this.v.y = 0;
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
		this.time += this.timeStep;

		this.v.plus(this.a);
		if(this.v.y > 5) this.v.y = 5;
		this.pos.plus(this.v);
		this.a.x = 0;
		
		this.alive && this.checkMap(Spider.map);

		if(this.pos.x < this.width) {
			this.pos.x = this.width;
			this.v.x = speed;
		}
		if(this.pos.x > Spider.map.width-this.width) {
			this.pos.x = Spider.map.width-this.width;
			this.v.x = speed * -1;
		}
		this.x = this.pos.x + Spider.map.x;
		this.y = this.pos.y + Spider.map.y;

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