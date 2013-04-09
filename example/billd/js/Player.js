(function(win){
	var ns = FL.ns("billd");
	FL.import(FL, this, "Utils, MovieClip, Keyboard");

	var speed1 = 2;
	var speed2 = 3.5;
	var jumpSpeed = -6;

	var Player = ns.Player = function()
	{
		MovieClip.apply(this, arguments);
		
		this.action = "stand2";
		this.time = 0;

		this.pos = new Vector();
		this.v = new Vector();
		this.a = new Vector(0, .2);
		this.alive = true;
	};
	Utils.extends(Player, MovieClip);

	Player.prototype.init = function()
	{
		this.addAnimation("stand3", "0-5", true, 6);
		this.addAnimation("stand2", "6-11", true, 6);
		this.addAnimation("stand1", "12-19", true, 6);
		this.addAnimation("run2", "20-23", true, 4);
		this.addAnimation("run1", "24-29", true, 6);
		this.addAnimation("play1", "40-54", true, 6);
		this.addAnimation("play0", "55-59", true, 6);
		this.addAnimation("jump2", "60-70", false, 8);
		this.addAnimation("jump1", "71-77", false, 6);
		this.addAnimation("attack", "80-87", true, 6);

		this.setImg(R.images["billd_mc"], 22, 22);
		this.originX = this.width>>1;
		this.originY = this.height;
	};

	Player.prototype.keyAction = function(){
		if(Math.abs(this.a.x) < .001 && Keyboard.getIsDown("LEFT"))
		{
			if(Keyboard.getKeyDelay("LEFT") < 300)
			{
				this.v.x = -1*speed2;
			}
			else
			{
				this.v.x = -1*speed1;
			}
			this.scaleX = -1;
		}
		else if(Math.abs(this.a.x) < .001 && Keyboard.getIsDown("RIGHT"))
		{
			if(Keyboard.getKeyDelay("RIGHT") < 300)
			{
				this.v.x = speed2;
			}
			else
			{
				this.v.x = speed1;
			}
			this.scaleX = 1;
		}
		else 
		{
			this.v.x *= .9;
		}

		if(this.v.y == 0 && Keyboard.getIsDown("UP"))
		{
			this.v.y = jumpSpeed;
			this.angle = 0;
		}

		if(this.v.y == 0 && Keyboard.getIsDown("SPACE"))
		{
			this.play("attack")
		}
		else if(this.v.y != 0) 
		{
			this.play("jump2")
		}
		else if(Math.abs(this.v.x) == speed1) this.play("run1");
		else if(Math.abs(this.v.x) == speed2) this.play("run2");
		else if(this.v.x < speed1) this.play("stand2");
	};

	Player.prototype.checkMap = function(map)
	{
		if(map && this.v.y >= 0)
		{
			var dataArr = map.mapData[this.pos.x>>0];
			if(dataArr){
				for(var i = 0, l = dataArr.length;i < l;i ++)
				{
					var data = dataArr[i];
					if(data.y <= this.pos.y + 2 && data.y >= this.pos.y - 5)
					{
						this.pos.y = data.y;
						this.v.y = 0;
						this.angle = data.ang;
						break;
					}
				}
			}
		}
	};

	Player.prototype.die  =function()
	{
		this.alive = false;
		var that = this;
		setTimeout(function(){
			that.alive = true;
			that.alpha = 1;
		}, 2000);
	}

	Player.prototype.update = function()
	{		
		this.v.plus(this.a);
		if(this.v.y > 5) this.v.y = 5;
		if(this.v.x > speed2) this.v.x = speed2;
		if(this.v.x < -1*speed2) this.v.x = -1*speed2;

		this.pos.plus(this.v);
		this.a.x *= .9;

		this.checkMap(this.map);

		this.x = this.pos.x + this.map.x;
		this.y = this.pos.y + this.map.y;

		this.keyAction();
	
		if( !this.alive)
		{
			this.time++;
			if(this.time%10>5)
			{
				this.alpha = 1;
			}
			else
			{
				this.alpha = 0;
			}
		}	
	};

	Player.create = function(x, y)
	{
		var player = new Player();
		player.init();
		player.play("play1");
		player.pos.set(x, y);
		return player;
	}

})(window);