(function(){
	var Utils = FL.Utils;
	var EventDispatcher = FL.EventDispatcher;
	var Rect = FL.Rect;
	var Polygon = FL.Polygon;

	var DisplayObject = FL.DisplayObject = function(x, y)
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
		this.visible = true;
		this.rect = new Rect();
		EventDispatcher.call(this);

		// var height = 0;
		// var that = this;

		// Object.defineProperty(this, "height", {
		// 	get:function(){
		// 		return that.scaleY*height;
		// 	},
		// 	set:function(value){
		// 		height = value
		// 	}
		// })
	};
	
	Utils.extends(DisplayObject, EventDispatcher);
	
	DisplayObject.prototype.render = function(ctx)
	{
		this.isInStage = this._inStage();
		if(!this.visible||!ctx || !this.isInStage) return;
		ctx.save();
		ctx.globalAlpha = this.alpha;
		ctx.translate(this.x, this.y);
		ctx.rotate(this.angle);
		ctx.scale(this.scaleX, this.scaleY);
		this._draw(ctx);
		ctx.restore();

		if(FL.debug)
		{
			this._debugDraw(ctx);
		}
	};

	DisplayObject.prototype._debugDraw = function(ctx)
	{
		ctx.save();
		var rect = this.getBounds();
		ctx.strokeStyle = "#f00";
		ctx.lineWidth = .5;
		ctx.beginPath();
		ctx.moveTo(this.hitPoints[0].x, this.hitPoints[0].y)
		for(var i = 1, l = this.hitPoints.length;i < l;i ++)
		{
			ctx.lineTo(this.hitPoints[i].x, this.hitPoints[i].y);
		}
		ctx.closePath();
		ctx.stroke();

		ctx.strokeStyle = "#00f";
		ctx.beginPath();
		ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
		ctx.stroke();
		ctx.restore();
	}

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

	DisplayObject.prototype._inStage =function()
	{
		return this.stage && this.x + this.width*2 > 0 && this.y + this.height*2 > 0 && this.x - 2*this.width< this.stage.width && this.y - 2*this.height< this.stage.height;
	}

	DisplayObject.prototype.getBounds = function()
	{
		var scaleX = Math.abs(this.scaleX);
		var scaleY = Math.abs(this.scaleY);
		var cos = Math.cos(this.angle);
		var sin = Math.sin(this.angle);
		var originX = this.originX*scaleX;
		var originY = this.originY*scaleY;
		var minx, miny, maxx, maxy;

		var points = [[0, 0], [0, this.height*scaleY], [this.width*scaleX, this.height*scaleY], [this.width*scaleX, 0]];
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
		this.hitPoints = points;
		return new Rect(minx, miny, maxx - minx, maxy - miny);
	};

	/**
	 * copy from https://github.com/quark-dev-team/quarkjs/blob/master/src/base/display/DisplayObject.js
	 * 获得一个对象相对于其某个祖先（默认即舞台）的连接矩阵。
	 * @private
	 */
	DisplayObject.prototype.getConcatenatedMatrix = function(ancestor) 
	{	
		var mtx = new FL.Matrix(1, 0, 0, 1, 0, 0);
		if(ancestor == this) return mtx;
		for(var o = this; o.parent != null && o.parent != ancestor; o = o.parent)
		{		
			var cos = 1, sin = 0;
			if(o.rotation%360 != 0)
			{
				var r = o.rotation * DEG_TO_RAD;
				cos = Math.cos(r);
				sin = Math.sin(r);
			}
			
			if(o.regX != 0) mtx.tx -= o.regX;
			if(o.regY != 0) mtx.ty -= o.regY;
			
			mtx.concat(new FL.Matrix(cos*o.scaleX, sin*o.scaleX, -sin*o.scaleY, cos*o.scaleY, o.x, o.y));
		}
		return mtx;
	};

	DisplayObject.prototype.hitTestPoint = function(x, y)
	{
		if(this.angle == 0)
		{
			var scaleX = Math.abs(this.scaleX);
			var scaleY = Math.abs(this.scaleY);
			return new Rect(this.x - this.originX*scaleX, this.y - this.originY*scaleY, this.width*scaleX, this.height*scaleY).hitTestPoint(x, y);
		}

		if(this.getBounds().hitTestPoint(x, y))
		{
			return new Polygon(this.hitPoints).hitTestPoint(x, y);
		}
		return false;
	};

	DisplayObject.prototype.hitTestObject = function(obj)
	{
		var bounds = this.bounds || this.getBounds();
		if(bounds.intersects(obj.bounds||obj.getBounds()))
		{
			return true;
			// return new Polygon(this.hitPoints).hit(new Polygon(obj.points));
		}
		return false;
	};

})();





