(function(){
	var Utils = FL.Utils;
	var DisplayObjectContainer = FL.DisplayObjectContainer;
	var Mouse = FL.Mouse;
	var Keyboard = FL.Keyboard;

	/**
	 * canvas, width, height, fps
	*/
	var Stage = FL.Stage = function(prop)
	{
		DisplayObjectContainer.call(this, prop);
		this.width = this.width||550;
		this.height = this.height||400;
		this.fps = this.fps||60;
		this.init();
	};
	Utils.extends(Stage, DisplayObjectContainer);

	Stage.prototype.init = function()
	{
		this.stage = this;
		this.timeStep = 1000/this.fps;
		this.canvas.width = this.width;
		this.canvas.height = this.height;
		this.ctx = this.canvas.getContext("2d");
	}

	Stage.prototype.addChildAt = function(obj, at)
	{
		this.superClass.addChildAt.call(this, obj, at);
	};

	Stage.prototype.render = function()
	{
		this.ctx.clearRect(0, 0, this.width, this.height);
		this.superClass.render.call(this, this.ctx)
	}

	Stage.prototype.start = function()
	{
		var that = this;
		this.stop();
		this._interval = setInterval(function(){
				that.render();
				that.callAll("update");
		}, 1000/this.fps);
	};

	Stage.prototype.update = function()
	{
	};

	Stage.prototype.initMouseEvent = function(mouseChildren){
		Mouse.init(this);
		if(mouseChildren)
		{
			this.addEventListener("mousedown", fireChildrenEvent);
			this.addEventListener("mousemove", fireChildrenEvent);
			this.addEventListener("mouseup", fireChildrenEvent);
		}
	};

	Stage.prototype.initKeyboardEvent = function(){
		Keyboard.init();
	};

	Stage.prototype.stop = function()
	{
		clearInterval(this._interval);
	};

	function fireChildrenEvent(e)
	{
		var children = this.children;
		for(var i = 0, l = this.children.length;i < l;i ++)
		{
			var child = children[i];
			
			if(child.mouseEnable && child.hitTestPoint(e.x, e.y))
			{
				child.dispatchEvent(e);
				return;
			}
		}
	}

})();