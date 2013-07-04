(function(){
	var Utils = FL.Utils;
	var DisplayObjectContainer = FL.DisplayObjectContainer;
	var Mouse = FL.Mouse;
	var Keyboard = FL.Keyboard;

	var Stage = FL.Stage = function(canvas, width, height, fps)
	{
		DisplayObjectContainer.call(this);
		this.init(canvas, width, height, fps);
	};
	Utils.extends(Stage, DisplayObjectContainer);

	Stage.prototype.init = function(canvas, width, height, fps)
	{
		this.canvas = canvas;
		this.width = canvas.width = width||550;
		this.height = canvas.height = height||400;
		this.fps = fps||60;
		this.timeStep = 1000/this.fps;
		this.ctx = canvas.getContext("2d");
	}

	Stage.prototype.addChildAt = function(obj, at)
	{
		this.stage = this;
		this.superClass.addChildAt.call(this, obj, at);
	};

	Stage.prototype.render = function()
	{
		this.ctx.clearRect(0, 0, this.width, this.height);
		this.superClass._draw.call(this, this.ctx);
	}

	Stage.prototype.start = function()
	{
		this.stop();
		var that = this;
		this._interval = setInterval(function(){
				that.render();
				that.update();
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