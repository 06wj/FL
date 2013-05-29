(function(win){
	var Utils = win.Utils;
	var DisplayObject = win.DisplayObject;

	var DisplayObjectContainer = win.DisplayObjectContainer = function(x, y, parent)
	{
		if(parent)
		{
			this.parent = parent;
			parent.addChild(this);
		}
		DisplayObject.call(this, x, y);
		this.children = [];
	};

	Utils.extends(DisplayObjectContainer, DisplayObject);

	DisplayObjectContainer.prototype.addChild = function()
	{
		for(var i = 0, l = arguments.length;i < l;i ++)
		{
			this._addChild(arguments[i]);
		}
	};

	DisplayObjectContainer.prototype._addChild = function(obj)
	{
		var index = this.children.indexOf(obj)
		if(index != -1){
			this.children.splice(index, 1);
		}
		this.children.push(obj);
		obj.parent = this;

		if(this.stage)
		{
			var prop = {stage:this.stage, timeStep:this.timeStep};
			if(obj instanceof DisplayObjectContainer) obj.setAll(prop);
			else utils.merge(obj, prop);
		}
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