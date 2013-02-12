(function(win){
	var Utils = win.Utils;
	var EventDispatcher = win.EventDispatcher;
	var Rect = win.Rect;
	var Polygon = win.Polygon;

	var DisplayObject = win.DisplayObject = function(x, y)
	{
		this.x = x||0;
		this.y = y||0;
		this.originX = 0;
		this.originY = 0;
		this.scaleX = 1;
		this.scaleY = 1;
		this.width = 0;
		this.height = 0;
		this.angle = 0;
		this.alpha = 1;
		this.timeStep = 0;
		this.mouseEnable = false;
		this.rect = new Rect();
		EventDispatcher.call(this);
	};
	
	Utils.extends(DisplayObject, EventDispatcher);
	
	DisplayObject.prototype.render = function(ctx)
	{
		if(!ctx) return;
		ctx.save();
		ctx.globalAlpha = this.alpha;
		ctx.translate(this.x, this.y);
		ctx.rotate(this.angle);
		ctx.scale(this.scaleX, this.scaleY);
		this._draw(ctx);

		ctx.restore();
		
		if(FL.debug)
		{
			ctx.save();
			var rect = this.getBounds();

			ctx.strokeStyle = "#f00";
			ctx.lineWidth = .5;
			ctx.beginPath();
			ctx.moveTo(this.points[0].x, this.points[0].y)
			for(var i = 1, l = this.points.length;i < l;i ++)
			{
				ctx.lineTo(this.points[i].x, this.points[i].y);
			}
			ctx.closePath();
			ctx.stroke();

			ctx.strokeStyle = "#00f";
			ctx.beginPath();
			ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
			ctx.stroke();
			ctx.restore();
		}
	};

	DisplayObject.prototype.setCenter = function()
	{
		this.originX = this.width >>1;
		this.originY = this.height >>1;
	}

	DisplayObject.prototype._draw = function(ctx)
	{

	};

	DisplayObject.prototype.initStage = function(stage, timeStep)
	{
		this.stage = stage;
		this.timeStep = timeStep;
	}

	DisplayObject.prototype.getBounds = function()
	{
		var cos = Math.cos(this.angle);
		var sin = Math.sin(this.angle);
		var originX = this.originX;
		var originY = this.originY;
		var minx, miny, maxx, maxy;
		var points = [[0, 0], [0, this.height], [this.width, this.height], [this.width, 0]];
		for(var i = 3;i >= 0;i --)
		{
			var tx = points[i][0] - originX;
			var ty = points[i][1] - originY;
			var ex = tx * cos - ty * sin + this.x;
			var ey = tx * sin + ty * cos + this.y;
			points[i] = new Vector(ex, ey);
			if(i == 3) 
			{
				minx = maxx = ex;
				miny = maxy = ey;
			}
			else
			{ 
				minx > ex && (minx = ex);
				miny > ey && (miny = ey);
				maxx < ex && (maxx = ex);
				maxy < ey && (maxy = ey);
			}
		}
		this.points = points;
		return new Rect(minx, miny, maxx - minx, maxy - miny);
	};

	DisplayObject.prototype.hitTestPoint = function(x, y)
	{
		if(this.angle == 0)
		{
			return new Rect(this.x - this.originX, this.y - this.originY, this.width, this.height).hitTestPoint(x, y);
		}

		if(this.getBounds().hitTestPoint(x, y))
		{
			return new Polygon(this.points).hitTestPoint(x, y);
		}
		return false;
	};

	DisplayObject.prototype.hitTestObject = function(obj)
	{
		if(this.getBounds().intersects(obj.getBounds()))
		{
			return true;
			// return new Polygon(this.points).hit(new Polygon(obj.points));
		}
		return false;
	};

})(FL);





