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
		draw(this.ctx, this.bezier);
	};

	Map.prototype.update = function(){

	};

	function draw(ctx, bezier){
		ctx.beginPath();
		ctx.lineWidth = 1;
		ctx.strokeStyle = "#222";
		ctx.moveTo(bezier.p0.x, bezier.p0.y);
		ctx.bezierCurveTo(bezier.p1.x, bezier.p1.y, bezier.p2.x, bezier.p2.y, bezier.p3.x, bezier.p3.y);
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