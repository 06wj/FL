(function(){
	var Rect = FL.Rect;

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
		var bounds = this.bounds;
		var target = this.target;
		var width = this.width;
		var height = this.height;
		var scroll = this.scroll;
		var deadzone = this.deadzone;

		if(target){
			if(deadzone){
				var targetX = target.pos.x + ((target.pos.x > 0)?0.0000001:-0.0000001);
				var targetY = target.pos.y + ((target.pos.y > 0)?0.0000001:-0.0000001);
				
				var edge = targetX - deadzone.x;
				if(scroll.x > edge){
					scroll.x = edge;
				}

				edge = targetX + target.width - deadzone.x - deadzone.width;
				if(scroll.x < edge){
					scroll.x = edge;
				}
				
				edge = targetY - deadzone.y;
				if(scroll.y > edge){
					scroll.y = edge;
				}

				edge = targetY + target.height - deadzone.y - deadzone.height;
				if(scroll.y < edge){
					scroll.y = edge;
				}
			}
			else{
				this.focusOn(target.pos.x + target.width*.5, target.pos.y + target.height*.5);
			}
		}
		
		if(bounds){
			if(scroll.x < bounds.left){
				scroll.x = bounds.left;
			}
			if(scroll.x > bounds.right - width){
				scroll.x = bounds.right - width;
			}
			if(scroll.y < bounds.top){
				scroll.y = bounds.top;
			}
			if(scroll.y > bounds.bottom - height){
				scroll.y = bounds.bottom - height;
			}
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
		var width = this.width;
		var height = this.height;
		switch(style){
			case "platFormer":
				var w = width/5;
				var h = height/3;
				this.deadzone = new Rect((width-w)/2,(height-h)/2 - h*0.25,w,h);
				break;
			case "topDown":
				helper = Math.max(width,height)/4;
				this.deadzone = new Rect((width-helper)/2,(height-helper)/2,helper,helper);
				break;
			case "topDownTight":
				helper = Math.max(width,height)/8;
				this.deadzone = new Rect((width-helper)/2,(height-helper)/2,helper,helper);
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
})();