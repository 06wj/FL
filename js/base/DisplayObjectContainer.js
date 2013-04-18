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
		var l = arguments.length;
		while(l-- > 0)
		{
			this._addChild(arguments[l]);
		}
		
	};

	DisplayObjectContainer.prototype._addChild = function(obj)
	{
		if(this.children.indexOf(obj) == -1)
		{
			this.children.push(obj);
			obj.parent = this;
		}
	};

	DisplayObjectContainer.prototype.removeChild = function(obj)
	{
		var index = typeof(obj) === "number"?obj:this.children.indexOf(obj);
		if(index < 0) {
			return;
		}
		this.children.splice(index, 1);
		obj.parent = null;
	};

	DisplayObjectContainer.prototype._draw = function(ctx){
		var l = this.children.length-1;
		ctx.save();
		ctx.translate(this.x, this.y);
		while(l >= 0)
		{
			this.children[l].render(ctx);
			l --;
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
		}
	};

	DisplayObjectContainer.prototype.callAll = function(func)
	{
		var children = this.children;
		for(var i = children.length - 1;i >= 0; i--)
		{
			children[i][func] && children[i][func]();
		}
	};

})(FL);