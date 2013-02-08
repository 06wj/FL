(function(win){
	var Vector = win.Vector = function(x, y)
	{
		this.x = x||0;
		this.y = y||0;
	}

	Vector.prototype.set = function(x, y)
	{
		this.x = x;
		this.y = y;
	}

	Vector.prototype.getClone = function()
	{
		return new Vector(this.x,this.y);
	}
	
	Vector.prototype.cut = function(max)
	{
		var r = Math.min(max, this.getLength());
		this.setLength(r);	
	}
	
	Vector.prototype.cutNew = function(max)
	{
		var r= Math.min(max, this.getLength());
		var v = this.getClone();
		v.setLength(r);
		return v;	
	}

	Vector.prototype.equals = function(v)
	{
		return (this.x==v.x && this.y==v.y);
	}
	
	Vector.prototype.plus = function(v)
	{
		this.x += v.x;
		this.y += v.y;	
	}
	
	Vector.prototype.plusNew = function(v)
	{
		return new Vector(this.x+v.x,this.y+v.y);
	}

	Vector.prototype.minus = function(v)
	{
		this.x -= v.x;
		this.y -= v.y;
	}
	
	Vector.prototype.minusNew = function(v)
	{
		return new Vector(this.x-v.x,this.y-v.y);
	}
	
	Vector.prototype.negate = function()
	{
		this.x = - this.x;
		this.y = - this.y;
	}
	
	Vector.prototype.negateNew = function()
	{
		return new Vector(-this.x,-this.y);
	}
	
	Vector.prototype.scale = function(s)
	{
		this.x *= s;
		this.y *= s;
	}
	
	Vector.prototype.scaleNew = function(s)
	{
		return new Vector(this.x * s, this.y * s);
	}
	
	Vector.prototype.getLength = function()
	{
		return Math.sqrt(this.x*this.x + this.y*this.y);
	}
	
	Vector.prototype.setLength = function(len)
	{
		var r = this.getLength();
		if (r) this.scale (len / r);
		else this.x = len;
	}
	
	Vector.prototype.getAngle = function()
	{
		return Math.atan2(this.y, this.x);
	}
	
	Vector.prototype.setAngle = function(ang)
	{
		var r = this.getLength();
		this.x = r * Math.cos (ang);
		this.y = r * Math.sin (ang);
	}
	
	/**
	*	angle || cos, sin
	*/
	Vector.prototype.rotate = function()
	{  
		var cos, sin;
		var a = arguments;
		if(a.length == 1)
		{
			cos = Math.cos(a[0]);
			sin = Math.sin(a[0]);
		} 
		else
		{
			cos = a[0]
			sin = a[1]
		}
		var rx = this.x * cos - this.y * sin;
		var ry = this.x * sin + this.y * cos;
		this.x = rx;
		this.y = ry;
	} 
	
	Vector.prototype.rotateNew = function(ang)
	{
		var v=new Vector(this.x,this.y);
		v.rotate(ang);
		return v;
	}

	Vector.prototype.cross = function(v)
	{
		return this.x*v.y - v.x*this.y;
	};

	Vector.prototype.dot = function(v)
	{
		return this.x * v.x + this.y * v.y;
	}
	
	Vector.prototype.getNormal = function()
	{
		return new Vector(-this.y,this.x);
	}

	
	Vector.prototype.isPerpTo = function(v)
	{
		return (this.dot (v) == 0);
	}
	
	Vector.prototype.angleBetween = function(v)
	{
		var dp = this.dot (v); 
		var cosAngle = dp / (this.getLength() * v.getLength());
		return Math.acos (cosAngle); 
	}

	Vector.prototype.getLength2 = function()
	{
		return this.x*this.x + this.y*this.y;
	}

})(window);