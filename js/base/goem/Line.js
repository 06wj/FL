(function(win){
	var Rect = win.Rect;

	var min = Math.min;
	var max = Math.max; 
	var abs = Math.abs;

	var Line = win.Line = function(v0, v1)
	{
		this.p0 = v0||new Vector();
		this.p1 = v1||new Vector();
	};

	Line.prototype.hitTestPoint = function(x, y)
	{
		var p = new Vector(x, y);
		p.minus(this.p0);
		return p.cross(this.p1.minusNew(this.p0))==0&&
		getBounds(this).hitTestPoint(p.x, p.y);
	};
	
	Line.prototype.intersects = function(line)
	{
		if(getBounds(line).intersects(getBounds(this)))
		{
			var p0 = this.p0;
			var p1 = this.p1;
			var q0 = line.p0;
			var q1 = line.p1;
			var p10 = p1.minusNew(p0);
			var q10 = q1.minusNew(q0);
			return q0.minusNew(p0).cross(p10)*p10.cross(q1.minusNew(p0))>=0&&
			p0.minusNew(q0).cross(q10)*q10.cross(p1.minusNew(q0))>= 0
		}
		return false;
	};
	
	function getBounds(line)
	{
		var x = min(line.p0.x, line.p1.x);
		var y = min(line.p0.y, line.p1.y);
		var w = line.p0.x - line.p1.x;
		var h = line.p0.y - line.p1.y;
		return new Rect(x, y, abs(w), abs(h));
	}

})(FL);