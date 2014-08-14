(function(win){
	var ns = FL.ns("billd");
	eval(FL.import("FL", "Utils, Bitmap"));

	var DOWN_SPEED = -.1;
	var UP_SPEED = .1;
	var BACK_SPEED = -.05;

	var Spring = ns.Spring = function(prop)
	{
		Bitmap.call(this, prop);
		this.pos = new Vector(this.x, this.y);
		this.isJump = false;
		this.targetSpeed = -13;
	};
	Utils.extends(Spring, Bitmap);

	Spring.prototype.jump = function(target){
		this.isJump = true;
		this.vy = DOWN_SPEED;
		this.target = target;
	};

	Spring.prototype.update = function(){
		if(this.isJump)
		{
			this.scaleY += this.vy;
			if(this.vy == DOWN_SPEED && this.scaleY < .3)
			{
				this.vy = UP_SPEED;
			}
			if(this.vy == UP_SPEED && this.scaleY > 1.5)
			{
				this.vy = BACK_SPEED;
				this.target.v.y = this.targetSpeed;
				this.target = null;
			}
			if(this.vy == BACK_SPEED && this.scaleY < 1)
			{
				this.scaleY = 1;
				this.isJump = false;
			}
			if(this.target)
			{
				this.target.v.y = 0;
				this.target.pos.y = this.pos.y - this.height*this.scaleY;
			}
		}

		this.x = this.pos.x + ns.map.x;
		this.y = this.pos.y + ns.map.y;
	};

	Spring.create = function(x, y, img, targetSpeed){
		var sp = new Spring({
			x:x,
			y:y
		});
		sp.targetSpeed = targetSpeed||-13;
		sp.setImg(img||R.images.spring);
		sp.originY = sp.height;
		return sp;
	};
})(window);