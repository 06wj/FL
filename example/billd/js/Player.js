(function(win){
	var ns = FL.ns("billd");
	eval(FL.import("FL", "Utils, MovieClip, Keyboard, Mouse"));

	var speed1 = 2;
	var speed2 = 3.5;
	var jumpSpeed = -6;
	var maxSpeed = 7;
	var g = .2;
	var LEFT = 1;
	var RIGHT = 2;

	var idleActions = ["play1", "play2", "play3", "stand1", "attack", "stand3"];
	var IDLE_TIME = 300;

	var SHOOT_TIME = 14;

	var Player = ns.Player = function(prop)
	{
		MovieClip.call(this, prop);
		
		this.action = "stand2";
		this.time = 0;

		this.pos = new Vector();
		this.v = new Vector();
		this.a = new Vector(0, g);
		this.alive = true;
		this.idle = false;
		this.idleTime = 0;
		this.idleAction = idleActions[0];
		this.floorV = 0;

		this.shootTime = SHOOT_TIME;
	};
	Utils.extends(Player, MovieClip);

	Player.prototype.init = function()
	{
		this.addAnimation("stand3", "0-5", true, 6);
		this.addAnimation("stand2", "6-11", true, 6);
		this.addAnimation("stand1", "12-19", true, 6);
		this.addAnimation("run2", "20-23", true, 4);
		this.addAnimation("run1", "24-29", true, 6);
		this.addAnimation("swim", "30-35 ", true, 6);
		this.addAnimation("play1", "40-54", true, 6);
		this.addAnimation("play2", "55-59", true, 6);
		this.addAnimation("play3", "88-93", true, 6);
		this.addAnimation("down", "94-95", true, 6);
		this.addAnimation("jump2", "60-70", false, 8);
		this.addAnimation("jump1", "71-77", false, 6);
		this.addAnimation("attack", "80-87", true, 6);
		this.addAnimation("climb", "88-89", true, 6);

		this.setImg(R.images["billd_mc"], 22, 22);
		this.originX = this.width>>1;
		this.originY = this.height;
		this.bounds = this.getBounds();
	};

	Player.prototype.keyAction = function(){		
		if(Math.abs(this.a.x) < .1 && (Keyboard.getIsDown("LEFT") || oState["l"]))
		{
			if(Keyboard.getKeyDelay("LEFT") < 300 || oState["l"] > 1)
			{
				this.v.x = -1*speed2;
			}
			else
			{
				this.v.x = -1*speed1;
			}
			this.scaleX = -1;
		}
		else if(Math.abs(this.a.x) < .1 && (Keyboard.getIsDown("RIGHT") || oState["r"]))
		{
			if(Keyboard.getKeyDelay("RIGHT") < 300 || oState["r"] > 1)
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

		if(this.v.y == 0 && (Keyboard.getIsDown("UP") || Mouse.isDown))
		{
			this.v.y = jumpSpeed;
			this.angle = 0;
		}

		this.a.y = g;
		if(this.checkSlowDown()){
			this.playAction("down");
			this.idleTime = 0;

			this.scaleX = this.slowDownType == RIGHT?-1:1;
			this.a.y = this.v.y > 0?g*.2:g*1.2;

			if(Keyboard.getIsDown("UP") || Mouse.isDown){
				this.v.y = jumpSpeed;
				this.angle = 0;

				this.a.x = this.slowDownType == RIGHT?-maxSpeed*1:maxSpeed*1;
			}
		}
		else if(this.v.y == 0 && Keyboard.getIsDown("SPACE") && this.shootTime >= SHOOT_TIME)
		{
			this.playAction("play2");
			this.idleTime = 0;
			this.shootTime = 0;
		}
		else if(this.v.y != 0) 
		{
			this.playAction("jump2");
			this.idleTime = 0;
		}
		else if(this.shootTime < 12) {
			this.playAction("play2");
			if(this.shootTime == 10){
				var v = new Vector(5, 0);
				var shootAngle = 0.7;
				var angle = this.scaleX==1?this.angle-shootAngle:this.angle+Math.PI+shootAngle;
				v.rotate(angle);
				var pos = new Vector(this.scaleX*12, -16);
				pos.rotate(this.angle);
				pos.plus(this.pos);
				var ball = ns.InstanceFactory.create("yellow_ball", {x:pos.x, y:pos.y, v:v});
				ns.stage.addChild(ball);
				ns.yellowBalls.push(ball);
			}
		}
		else if(Math.abs(this.v.x) == speed1) this.playAction("run1");
		else if(Math.abs(this.v.x) == speed2) this.playAction("run2");
		else if(this.v.x < speed1) 
		{
			this.playAction("idle");
		}
	};


	Player.prototype.playAction = function(name){
		if(name == "idle")
		{
			this.idleTime ++;
			if(this.idleTime > IDLE_TIME)
			{
				if(this.idleTime > IDLE_TIME+100)
				{
					this.idleAction = idleActions[Math.floor(Math.random()*idleActions.length)];
					this.idleTime = IDLE_TIME+1;
				}
				this.play(this.idleAction);
			}
			else
			{
				this.play("stand2");
			}
		}
		else
		{
			this.idleTime = 0;
			this.play(name);
		}
	};
	
	Player.prototype.checkSlowDown = function(){
		return false;
		// return !this.onGround && (this.slowDownType == RIGHT && Keyboard.getIsDown("RIGHT") || (this.slowDownType == LEFT && Keyboard.getIsDown("LEFT")))
		// return !this.onGround && tshis.slowDownType && (Keyboard.getIsDown("RIGHT") || Keyboard.getIsDown("LEFT"));
		return !this.onGround && this.slowDownType && (1||Keyboard.getIsDown("RIGHT") || Keyboard.getIsDown("LEFT"));
	}

	Player.prototype.slowDown = function(x, pos){
		this.v.x = 0;
		this.a.x = 0;
		this.v.y = Math.min(this.v.y, 3);
		if(pos == LEFT){
			this.pos.x = x + this.width*.5;
		}
		else{
			this.pos.x = x - this.width*.5;
		}
		this.slowDownType = pos;
	}

	Player.prototype.walkOnGround = function(y, ang){
		this.pos.y = y;
		this.v.y = 0;
		this.angle = ang;
		this.onGround = true;
	}

	Player.prototype.checkMap = function(map)
	{
		//脚碰地
		if(map && this.v.y >= 0)
		{
			this.angle = 0;
			var dataArr = map.mapData[this.pos.x>>0];
			if(dataArr){
				for(var i = 0, l = dataArr.length;i < l;i ++)
				{
					var data = dataArr[i];
					if(data.y <= this.pos.y + 2 && data.y >= this.pos.y - 5)
					{
						this.walkOnGround(data.y, data.ang);
						break;
					}
				}
			}
		}

		var padding = 3;
		//头碰墙
		var dataArr = map.wallData[(this.pos.y-this.height+padding)>>0];
		if(map && this.v.x > 0)//碰右边墙
		{
			if(dataArr){
				for(var i = 0, l = dataArr.length;i < l;i ++)
				{
					var x = dataArr[i];
					if(x <= this.pos.x + this.width*.5 && x >= this.pos.x + this.width*.5 - 5)
					{
						this.slowDown(x, RIGHT);
						return;
					}
				}
			}
		}
		else if(map && this.v.x < 0)//碰左边墙
		{
			if(dataArr){
				for(var i = 0, l = dataArr.length;i < l;i ++)
				{
					var x = dataArr[i];
					if(x <= this.pos.x - this.width*.5 + 5&& x >= this.pos.x - this.width*.5)
					{
						this.slowDown(x, LEFT);
						return;
					}
				}
			}
		}
		//脚碰墙
		var dataArr = map.wallData[(this.pos.y-padding)>>0];
		if(map && this.v.x > 0)//碰右边墙
		{
			if(dataArr){
				for(var i = 0, l = dataArr.length;i < l;i ++)
				{
					var x = dataArr[i];
					if(x <= this.pos.x + this.width*.5 && x >= this.pos.x + this.width*.5 - 5)
					{
						this.slowDown(x, RIGHT);
						return;
					}
				}
			}
		}
		else if(map && this.v.x < 0)//碰左边墙
		{
			if(dataArr){
				for(var i = 0, l = dataArr.length;i < l;i ++)
				{
					var x = dataArr[i];
					if(x <= this.pos.x - this.width*.5 + 5&& x >= this.pos.x - this.width*.5)
					{
						this.slowDown(x, LEFT);
						return;
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

	Player.prototype.checkFloors = function(floors){
		if(this.v.y>=0)
		{
			for(var i = 0, l = floors.length;i < l;i ++)
			{
				var floor = floors[i];
				if(this.bounds.left < floor.x + floor.width && this.bounds.right > floor.x)
				{
					if(floor.pos.y <= this.pos.y + 2 && floor.pos.y >= this.pos.y - 5) 
					{
						this.walkOnGround(floor.pos.y, 0);
						this.floorV = floor.v.x;
						return;
					}
				}
			}
		}
		this.floorV = 0;
	}

	Player.prototype.checkSprings = function(springs){
		if(this.v.y>0)
		{
			for(var i = 0, l = springs.length;i < l;i ++)
			{
				var spring = springs[i];
				if(!spring.isJump && this.bounds.left < spring.x + spring.width && this.bounds.right > spring.x)
				{
					if(spring.pos.y - spring.height <= this.pos.y + 2 && spring.pos.y - spring.height >= this.pos.y - 5) 
					{
						spring.jump(this);
						this.spring = spring;
						return;
					}
				}
			}
		}
	}

	Player.prototype.update = function()
	{		
		this.shootTime ++;
		this.bounds = this.getBounds();
		this.v.plus(this.a);
		if(this.v.y > maxSpeed) this.v.y = maxSpeed;
		if(this.v.x > speed2) this.v.x = speed2;
		if(this.v.x < -1*speed2) this.v.x = -1*speed2;
		
		this.pos.plus(this.v);
		this.pos.x += this.floorV;
		this.a.x *= .9;

		this.onGround = false;
		this.slowDownType = 0;

		this.checkMap(ns.map);
		this.checkFloors(ns.floors);
		this.checkSprings(ns.springs);

		this.x = this.pos.x + ns.map.x;
		this.y = this.pos.y + ns.map.y;

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


	var oState = {};
	window.ondeviceorientation =  function(e) 
	{
		var ang;
		var o = window.orientation;
		if(o == 90){
			ang = e.beta;
		}
		else if(o == -90){
			ang = -e.beta;
		}
		else if(o == 0){
			ang = e.gamma;	
		}

		oState["l"] = oState["r"] = false;
		if(ang > 15) 
		{
			oState["r"] = 2;
		}
		else if(ang > 5)
		{
			oState["r"] = 1;
		}
		else if(ang < -15) 
		{
			oState["l"] = 2;
		}
		else if(ang < -5)
		{
			oState["l"] = 1;
		}
	}
})(window);

