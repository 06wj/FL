(function(win){
	var Utils = win.Utils;
	var DisplayObject = win.DisplayObject;

	var DisplayObjectContainer = win.DisplayObjectContainer = function(x, y, parent)
	{
		if(parent)
		{
			parent.addChild(this);
		}
		DisplayObject.call(this, x, y);
		this.children = [];
	};

	Utils.extends(DisplayObjectContainer, DisplayObject);

	DisplayObjectContainer.prototype.addChildAt = function(child, at) {
		at = at=="undefined"?this.children.length:at;
		this.removeChild(child);
		this.children.splice(at, 0, child);
		child.parent = this;
		
		if(this.stage)
		{
			var prop = {stage:this.stage, timeStep:this.timeStep};
			if(child instanceof DisplayObjectContainer) child.setAll(prop);
			else Utils.merge(child, prop);
		}
	};

	DisplayObjectContainer.prototype.addChild = function()
	{
		var at = this.children.length;
		for(var i = 0, l = arguments.length;i < l;i ++)
		{
			this.addChildAt(arguments[i], at++);
		}
	};

	
	DisplayObjectContainer.prototype._debugDraw = function(ctx){
		
	};

	DisplayObjectContainer.prototype.removeChild = function(obj)
	{
		var index = typeof(obj) === "number"?obj:this.children.indexOf(obj);
		if(index < 0) {
			return;
		}
		this.children[index].parent = null;
		this.children.splice(index, 1);
	};

	DisplayObjectContainer.prototype._draw = function(ctx){
		ctx.save();
		ctx.translate(this.x, this.y);
		for(var i = 0, l = this.children.length;i < l;i ++){
			this.children[i].render(ctx);
		}
		ctx.restore();
	};

	DisplayObjectContainer.prototype.setAll = function(props)
	{
		var children = this.children;
		Utils.merge(this, props);
		for(var i = children.length - 1;i >= 0; i--)
		{
			var obj = children[i];
			Utils.merge(obj, props);
			if(obj instanceof DisplayObjectContainer)
			{
				obj.setAll(props);
			}
			else
			{
				Utils.merge(this, props);
			}
		}
	};

	DisplayObjectContainer.prototype.callAll = function(func)
	{
		if(this[func]) this[func]();
		var children = this.children;
		for(var i = children.length - 1;i >= 0; i--)
		{
			var obj = children[i];
			if(obj instanceof DisplayObjectContainer)
			{
				obj.callAll(func);
			}
			else if(obj[func])
			{
				obj[func]();
			}
		}
	};

})(FL);