(function(win){
	var ns = FL.ns("billd");
	eval(FL.import("FL", "Bitmap, Utils, Bezier, Line"));

	var Map = ns.Map = function(x, y){
		Bitmap.call(this, x, y);
		this.mapData = {};
		this.lines = [];
	};
	Utils.extends(Map, Bitmap);

	Map.prototype.init = function(w, h){
		this.img = document.createElement("canvas");
		this.ctx = this.img.getContext("2d");
		this.img.width = w;
		this.img.height = h;
		this.setImg(this.img);

		this.lines = [];

		var shape = mapData.hit;
		for(var i = 0, l = shape.beziers.length;i < l;i ++)
		{
			var points = shape.beziers[i];
			this.lines = this.lines.concat(getLinesByBezier(new Bezier(points[0], points[1], points[2], points[3]))); 
		}

		for(var i = 0, l = shape.lines.length;i < l;i ++)
		{
			var points = shape.lines[i];
			this.lines.push(new Line(new Vector(points[0].x, points[0].y), new Vector(points[1].x, points[1].y)));
		}
		
		draw(this.ctx, mapData.shape);
		FL.getUrlParams().hit && drawDebug(this.ctx, this.lines);
		var data = createMapData(this.lines);
		this.mapData = data.ground;
		this.wallData = data.wall;

	};

	function draw(ctx, shape){
		for(var type in shape){
			arr = shape[type];
			ctx.save();
			if(type == "bezier")
			{
				ctx.fillStyle = "#000000";
				ctx.strokeStyle = "#9966ff";
				arr.forEach(function(data){
					ctx.beginPath();
					var p = data.shift();
					ctx.moveTo(p[0].x, p[0].y);
					ctx.bezierCurveTo(p[1].x, p[1].y, p[2].x, p[2].y, p[3].x, p[3].y);
					data.forEach(function(p){
						ctx.bezierCurveTo(p[1].x, p[1].y, p[2].x, p[2].y, p[3].x, p[3].y);
					});
					ctx.fill();		
				});	

			}
			else if(type == "rect")
			{
				arr.forEach(function(data){
					ctx.fillStyle = data.color;
					ctx.fillRect(data.x, data.y, data.width, data.height);
				});		
			}
			ctx.restore();
		}
	}
		
	function drawDebug(ctx, lines){
		ctx.beginPath();
		ctx.strokeStyle = "#ff0000";
		ctx.lineWidth = 2;
		lines.forEach(function(line){
			ctx.moveTo(line.p0.x, line.p0.y);
			ctx.lineTo(line.p1.x, line.p1.y);
		});
		ctx.stroke();
		ctx.fill();
	}

	function getLinesByBezier(bezier)
	{
		var points = bezier.getPointsByTime(.01);
		var lines = []
		for(var i = 1, l = points.length;i < l;i ++)
		{
			lines.push(new Line(points[i-1], points[i]));
		}
		return lines;
	}	

	function createMapData(lines)
	{
		var ground = {}, wall = {};
		for(var i = 0, l = lines.length;i < l;i ++)
		{
			var line = lines[i];
			if((line.p0.x>>0) == (line.p1.x>>0))
			{
				var a = Math.min(line.p0.y, line.p1.y)>>0;
				var b = Math.max(line.p0.y, line.p1.y)>>0;
				for(var j = a;j <= b;j ++)
				{
					wall[j] = wall[j]||[];
					wall[j].push(line.p0.x);
				}
			}
			else
			{
				var points = line.createPoints();
				for(var j = 0, pl = points.length;j < pl;j ++)
				{
					point = points[j];
					ground[point.x] = ground[point.x] || [];
					if(Math.abs(point.ang)>Math.PI*.5) point.ang += Math.PI;
					ground[point.x].push({y:point.y, ang:point.ang});
				}
			}
		}
		log(wall)
		return {wall:wall, ground:ground};
	}

})(window);