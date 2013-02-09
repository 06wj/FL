(function(win){
	var ns = FL.ns("billd");
	FL.import(FL, this, "Bitmap, Utils, Bezier, Line");

	var Map = ns.Map = function(x, y){
		Bitmap.call(this, x, y);
	};
	Utils.extends(Map, Bitmap);

	Map.prototype.init = function(w, h){
		this.img = document.createElement("canvas");
		this.ctx = this.img.getContext("2d");
		this.img.width = w;
		this.img.height = h;
		this.setImg(this.img);

		this.bezier = new Bezier(0, h-40, w/4, h-150, w/4*3, h+40, w, h-40);
		this.lines = getLinesByBezier(this.bezier);  
		this.lines.push(new Line(new Vector(20, 100), new Vector(100, 80)))
		this.lines.push(new Line(new Vector(150, 80), new Vector(240, 80)))
		this.lines.push(new Line(new Vector(260, 40), new Vector(390, 30)))

		draw(this.ctx, this.lines);
	};

	Map.prototype.update = function(){

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
		var points = bezier.getPointsByTime();
		var lines = []
		for(var i = 0, l = points.length;i < l;i ++)
		{
			lines.push(new Line(points[i-1], points[i]));
		}
		return lines;
	}	

})(window);