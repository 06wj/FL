(function(win){
	var Line = win.Line;

	var Polygon = win.Polygon = function(points)
	{
		this.points = points;
	}

	Polygon.prototype.hitTestPoint = function(x, y)
	{
		var line = new Line(new Vector(x, y), new Vector(-1000, y));
		var n = 0;
		var points = this.points;
		for(var i = 0, l = points.length;i < l;i ++)
		{
			var path = new Line(points[i], points[(i+1)%l]);
			
			if(path.hitTestPoint(x, y)) return true;
			if(path.p0.x != path.p1.x)
			{
				if(line.hitTestPoint(path.p0)) n ++;
				else if(!line.hitTestPoint(path.p1) && line.intersects(path)) n++;
			}
		}
		return n%2 == 1;
	}
})(FL);