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

		var shape = mapData.shape;
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
		
		draw(this.ctx, this.lines);
		this.mapData = createMapData(this.lines);
	};

	function draw(ctx, lines){
		ctx.beginPath();
		ctx.lineWidth = 1;
		ctx.strokeStyle = "#222";
		for(var i = 0, l = lines.length;i<l;i ++)
		{
			ctx.moveTo(lines[i].p0.x, lines[i].p0.y)
			ctx.lineTo(lines[i].p1.x, lines[i].p1.y)
		}
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
				hash[point.x].push({y:point.y, ang:point.ang});
			}
		}
		return hash;
	}

})(window);