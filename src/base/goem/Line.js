(function(){
	var Rect = FL.Rect;
	var min = Math.min;
	var max = Math.max; 
	var abs = Math.abs;

	var Line = FL.Line = function(v0, v1)
	{
		this.p0 = v0||new Vector();
		this.p1 = v1||new Vector();
	};

	/**
	 *获取t百分比的点
	*/
	Line.prototype.getPoint = function(t){
		var x = (this.p1.x - this.p0.x) * t + this.p0.x;
		var y = (this.p1.y - this.p0.y) * t + this.p0.y;
		return new Vector(x, y);
	};

	Line.prototype.getAngle = function(){
		var x = this.p1.x - this.p0.x;
		var y = this.p1.y - this.p0.y;
		return Math.atan2(y, x);
	};

	Line.prototype.getY = function(x){
		this.lx = this.lx||min(this.p0.x, this.p1.x);
		this.rx = this.rx||max(this.p0.x, this.p1.x);
		if(x < this.lx || x > this.rx) return null;
		this._getY = this._getY || function(x){
			var x1 = this.p0.x;
			var y1 = this.p0.y;
			var x2 = this.p1.x;
			var y2 = this.p1.y;
			if(x1 == x2) return Math.min(y1, y2); 
			if(y1 == y2) return y1;
			return (x-x1)/(x2-x1)*(y2-y1) + y1
		}
		return this._getY(x);
	};

	Line.prototype.createPoints = function()
	{
		var points = [];
		this.lx = this.lx||min(this.p0.x, this.p1.x);
		this.rx = this.rx||max(this.p0.x, this.p1.x);
		var ang = this.getAngle();
		for(var i = this.lx>>0;i <= this.rx; i ++)
		{
			if(this.getY(i) != null) points.push({x:i, y:this.getY(i), ang:ang});
		}
		return points;
	}

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

})();