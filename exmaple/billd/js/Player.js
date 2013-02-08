(function(win){
	var ns = FL.ns("billd");
	FL.import(FL, this, "Utils, MovieClip, Keyboard");

	var speed1 = 1;
	var speed2 = 2.5;
	
	var Player = ns.Player = function()
	{
		MovieClip.apply(this, arguments);
		
		this.action = "stand2";
		this.time = 0;

		this.pos = new Vector();
		this.v = new Vector();
		this.a = new Vector(0, .2);
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
		if(Keyboard.getIsDown("LEFT"))
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
		else if(Keyboard.getIsDown("RIGHT"))
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
			this.v.x = 0;
		}

		if(this.pos.y >= height && Keyboard.getIsDown("UP"))
		{
			this.v.y = -5;
		}
		// if(this.pos.y < height && Keyboard.getIsDown("down"))
		// {
		// 	this.v.y = 0;
		// 	this.play("jump1");
		// }

		if(this.pos.y >= height && Keyboard.getIsDown("SPACE"))
		{
			this.play("attack")
		}
		else if(this.pos.y < height) 
		{
			if(this.v.y > 0) this.play("jump1");
			else this.play("jump2");
		}
		else if(Math.abs(this.v.x) == speed1) this.play("run1");
		else if(Math.abs(this.v.x) == speed2) this.play("run2");
		else if(this.v.x == 0) this.play("stand2");
	};

	Player.prototype.update = function()
	{
		this.time += this.timeStep;

		this.v.plus(this.a);
		this.pos.plus(this.v);
		if(this.pos.y > height)
		{
			this.pos.y = height;
			this.v.y = 0;
		}

		this.x = this.pos.x;
		this.y = this.pos.y;

		this.keyAction();
	};

	Player.create = function()
	{
		player = new Player();
		player.init();
		stage.addChild(player);
		player.play("play1");
		player.pos.set(width>>1, height);
	}

})(window);