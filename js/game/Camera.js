(function(win){
	var Rect = win.Rect;

	var Camera = FL.Camera = function(x, y, width, height, zoom){
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.zoom = zoom||1;

		this.scroll = new Vector;
		this.bounds = null;
		this.target = null;
		this.deadzone = null;
	};

	Camera.prototype.update = function(){
		if(this.target != null)
		{
			if(this.deadzone == null)
				this.focusOn(this.target.x + this.target.width*.5, this.target.y + this.target.height*.5);
			else
			{
				
				var targetX = this.target.x + ((this.target.x > 0)?0.0000001:-0.0000001);
				var targetY = this.target.y + ((this.target.y > 0)?0.0000001:-0.0000001);
				
				var edge = targetX - deadzone.x;
				if(this.scroll.x > edge)
					this.scroll.x = edge;
				edge = targetX + this.target.width - this.deadzone.x - this.deadzone.width;
				if(this.scroll.x < edge)
					this.scroll.x = edge;
				
				edge = targetY - this.deadzone.y;
				if(this.scroll.y > edge)
					this.scroll.y = edge;
				edge = targetY + this.target.height - this.deadzone.y - this.deadzone.height;
				if(this.scroll.y < edge)
					this.scroll.y = edge;
			}
		}
		
		if(this.bounds != null)
		{
			if(this.scroll.x < this.bounds.left)
				this.scroll.x = bounds.left;
			if(scroll.x > this.bounds.right - width)
				this.scroll.x = bounds.right - width;
			if(scroll.y < this.bounds.top)
				this.scroll.y = bounds.top;
			if(scroll.y > this.bounds.bottom - height)
				this.scroll.y = this.bounds.bottom - height;
		}
	};

	/**
	 *
	 *style:platFormer  topDown  topDownTight direct
	 *
	*/
	Camera.prototype.follow = function(target, style){
		this.target = target;
		var helper;
		switch(style)
		{
			case "platFormer":
				var w = this.width/8;
				var h = this.height/3;
				this.deadzone = new Rect((this.width-w)/2,(this.height-h)/2 - h*0.25,w,h);
				break;
			case "topDown":
				helper = Math.max(this.width,this.height)/4;
				this.deadzone = new Rect((this.width-helper)/2,(this.height-helper)/2,helper,helper);
				break;
			case "topDownTight":
				helper = Math.max(width,height)/8;
				this.deadzone = new Rect((this.width-helper)/2,(this.height-helper)/2,helper,helper);
				break;
			case "direct":
			default:
				this.deadzone = null;
				break;
		}
	}

	Camera.prototype.focusOn = function(point){
		this.scroll.set(point.x - this.width*0.5,point.y - this.height*0.5);
	};

	Camera.prototype.setBounds = function(x, y, width, height){
		this.bounds = this.bounds||new Rect();
		this.bounds.set(x, y, width, height);
		this.update();
	}
})(FL);