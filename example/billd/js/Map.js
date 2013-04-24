(function(win){
	var ns = FL.ns("billd");
	FL.import(FL, this, "Bitmap, Utils, Bezier, Line");

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
			log(points)
			this.lines.push(new Line(new Vector(points[0].x, points[0].y), new Vector(points[1].x, points[1].y)));
		}
		
		draw(this.ctx, mapData.shape);
		this.mapData = createMapData(this.lines);
	};

	function draw(ctx, lines){
		ctx.beginPath();
		ctx.fillStyle = "#222";
		ctx.lineStyle = "#222";
		ctx.lineWidth = .1;
		ctx.beginPath();
		
		lines.forEach(function(line){
			var p = line.shift();
			ctx.moveTo(p[0].x, p[0].y);
			ctx.bezierCurveTo(p[1].x, p[1].y, p[2].x, p[2].y, p[3].x, p[3].y);
			line.forEach(function(p){
				ctx.bezierCurveTo(p[1].x, p[1].y, p[2].x, p[2].y, p[3].x, p[3].y);
			});
		});
		ctx.fill();
		ctx.stroke();
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
		var hash = {}, point;
		for(var i = 0, l = lines.length;i < l;i ++)
		{
			var points = lines[i].createPoints();
			for(var j = 0, pl = points.length;j < pl;j ++)
			{
				point = points[j];
				hash[point.x] = hash[point.x] || [];
				log(point.ang)
				if(Math.abs(point.ang)>Math.PI*.5) point.ang += Math.PI;
				hash[point.x].push({y:point.y, ang:point.ang});
			}
		}
		return hash;
	}

})(window);