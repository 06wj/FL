(function(win){
	var FL = win.FL = {};
	try{
		win.log = function(){
			console.log.apply(console,arguments);
		};
	}
	catch(e){
		win.log = function(){
			console.dir(arguments);
		}
	}
	
	win.RAD_TO_DEG = 180/Math.PI;	
	win.DEG_TO_RAD = Math.PI/180;
	
	FL.merge = function(s1, s2){
		for(var p in s2){
			s1[p] = s2[p];
		}
		return s1;
	};

	FL.getUrlParams = function()
	{
		var params = {};
		var url = window.location.href;
		var idx = url.indexOf("?");
		if(idx > 0)
		{
			var queryStr = url.substring(idx + 1);
			var args = queryStr.split("&");
			for(var i = 0, a, nv; a = args[i]; i++)
			{
				nv = args[i] = a.split("=");
				params[nv[0]] = nv.length > 1 ? nv[1] : true;
			}
		}
		return params;
	};

	FL.ns = function(str)
	{
		var arr = str.split(".");
		var obj = win;
		for(var i = 0, l = arr.length;i < l;i ++)
		{
			obj[arr[i]] = obj[arr[i]] || {};
			obj = obj[arr[i]];
		}
		return obj;
	};

	/**
	 *   modules: "Movieclip, Utils..."
	*/
	FL.import = function(from, modules){
		var str = "";
		modules.replace(/\s/g,"").split(",").forEach(function(obj){
			str += "var " + obj + "=" + from + "." + obj + ";";
		});
		return str;
	};

	FL.params = FL.getUrlParams();
	FL.debug = FL.params.debug&&FL.params.debug!=0;
})(window);
(function(){
		var Utils = FL.Utils = {};

		Utils.extends = function(childClass, parentClass) 
		{
			childClass.prototype = Object.create(parentClass.prototype);
			childClass.prototype.superClass = parentClass.prototype;
			childClass.prototype.constructor = childClass;
		};

		Utils.getElementOffset = function(elem)
		{   
			var x = elem.offsetLeft, y = elem.offsetTop;
			while((elem = elem.offsetParent) && elem != document.body && elem != document)
			{
				x += elem.offsetLeft;
				y += elem.offsetTop;
			}
			return {x:x, y:y};
		};

		Utils.merge = function(obj, props)
		{
			for(var key in props)
			{
				obj[key] = props[key];
			}
			return obj;
		};

		Utils.getUrlParams = function()
		{
			var params = {};
			var url = window.location.href;
			var idx = url.indexOf("?");
			if(idx > 0)
			{
				var queryStr = url.substring(idx + 1);
				var args = queryStr.split("&");
				for(var i = 0, a, nv; a = args[i]; i++)
				{
					nv = args[i] = a.split("=");
					params[nv[0]] = nv.length > 1 ? nv[1] : true;
				}
			}
			return params;
		};

		Utils.getRandom = function(min, max, isInt){
			if(min > max){
				min = max + min;
				max = min - max;
				min = min - max;
			}
			var num = Math.random()*(max-min) + min
			return isInt?num>>0:num;
		};

})();
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
		return this;	
	}
	
	Vector.prototype.plusNew = function(v)
	{
		return new Vector(this.x+v.x,this.y+v.y);
	}

	Vector.prototype.minus = function(v)
	{
		this.x -= v.x;
		this.y -= v.y;
		return this;
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
(function(){
	var Rect = FL.Rect = function(x, y, width, height){
		this.set(x, y, width, height);
	};

	Rect.prototype.set = function(x, y, width, height)
	{
		this.left = this.x = x||0;
		this.top = this.y = y||0;
		this.width = width||this.width||0;
		this.height = height||this.height||0;

		this.right = this.x + this.width;
		this.bottom = this.y + this.height;
	};

	Rect.prototype.intersects = function(rect){
		return rect.x <= this.right && this.x <= rect.right&&
			rect.y <= this.bottom && this.y <= rect.bottom;
	};

	Rect.prototype.hitTestPoint = function(x, y){
		return x>=this.x && x<=this.right&&
			y>=this.y && y<=this.bottom;
	}
})();
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
(function(){
	var Line = FL.Line;

	var Polygon = FL.Polygon = function(points)
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
})();
(function(){
	var TOTAL_SIMPSON_STEP = 100;
	var Point = FL.Point = function(x, y){
		this.x = x;
		this.y = y;
	};

	var Bezier = FL.Bezier = function(){
		var args = arguments;
		if(args.length == 4){
			this.p0 = args[0];
			this.p1 = args[1];
			this.p2 = args[2];
			this.p3 = args[3];
		}
		else if(args.length == 8){
			this.p0 = new Point(args[0], args[1]);
			this.p1 = new Point(args[2], args[3]);
			this.p2 = new Point(args[4], args[5]);
			this.p3 = new Point(args[6], args[7]);
		}
	};

	Bezier.prototype.getSpeedLength = function(t){
		var it = 1-t, it2 = it*it, t2 = t*t;
		var x = -3*this.p0.x*it2 + 3*this.p1.x*it2 - 6*this.p1.x*it*t + 6*this.p2.x*it*t - 3*this.p2.x*t2 + 3*this.p3.x*t2;
		var y = -3*this.p0.y*it2 + 3*this.p1.y*it2 - 6*this.p1.y*it*t + 6*this.p2.y*it*t - 3*this.p2.y*t2 + 3*this.p3.y*t2;
		return Math.sqrt(x*x + y*y);
	};

	/*
	 *获取线条长度
	*/
	Bezier.prototype.getLength = function(t){
		var stepCounts = parseInt(TOTAL_SIMPSON_STEP*t), i;
		
		if(stepCounts & 1) stepCounts++;
		if(stepCounts==0) return 0.0;

		var halfCounts = stepCounts>>1;
		var sum1=0, sum2=0;
		var dStep = t/stepCounts;

		for(i=0; i<halfCounts; i++){
			sum1 += this.getSpeedLength((2*i+1)*dStep);
		}
		for(i = 1; i<halfCounts; i++){
			sum2 += this.getSpeedLength((2*i)*dStep);
		}

		return (this.getSpeedLength(0)+this.getSpeedLength(1)+2*sum2+4*sum1)*dStep/3;
	};

	Bezier.prototype.getPointByTime = function(t){
		var it = 1-t, it2 = it*it, it3 = it2*it;
		var t2 = t*t, t3 = t2*t;
		return new Vector(it3*this.p0.x + 3*it2*t*this.p1.x + 3*it*t2*this.p2.x + t3*this.p3.x,
			it3*this.p0.y + 3*it2*t*this.p1.y + 3*it*t2*this.p2.y + t3*this.p3.y
		);
	};

	Bezier.prototype.getPointByLen = function(len){
		if(len > this.length){
			return this.p3;
		}

		var t1 = len/this.length, t2;
		do
		{
			t2 = t1 - (this.getLength(t1)-len)/this.getSpeedLength(t1);
			if(Math.abs(t1-t2)<0.01) break;

			t1=t2;

		}while(true);
		return this.getPointByTime(t2);
	};

	/**
	 *获取等距点，距离为step，默认1
	*/
	Bezier.prototype.getPointsByLen = function(step){
		step = step||1;
		var len = this.getLength();
		var i = 0;
		var points = [];
		while(i < len)
		{
			points.push(this.getPointByLen(i));
			i+=step;
		}
		points.push(this.getPointByLen(len))
		return points;
	};

	/**
	 *获取等比例点，比例为step，默认.01
	*/
	Bezier.prototype.getPointsByTime = function(step){
		step = step||.01;
		var t = 0;
		var points = [];
		while(t < 1)
		{
			points.push(this.getPointByTime(t));
			t += step;
		}
		points.push(this.getPointByTime(1));
		return points;
	};

})();
(function(){
	var EventDispatcher = FL.EventDispatcher = function()
	{
		this.eventListeners = {};
	};

	EventDispatcher.prototype.addEventListener = function(type, listener)
	{
		if(!this.eventListeners[type]) this.eventListeners[type] = [];
		if(this.eventListeners[type].indexOf(listener)==-1) this.eventListeners[type].push(listener);
	};

	EventDispatcher.prototype.removeEventListener = function(type, listener)
	{
		if(!this.eventListeners[type]) return;
		var index = this.eventListeners[type].indexOf(listener);
		if(index != -1) this.eventListeners[type].splice(index, 1);
	};
	
	EventDispatcher.prototype.removeAllEventListener = function()
	{
		this.eventListeners = {};
	}

	/**
	*	e:{type:String, data:{}}
	*/
	EventDispatcher.prototype.dispatchEvent = function(e)
	{
		var arr = this.eventListeners[e.type];
		e.target = this;
		if(arr && arr.length > 0)
		{
			arr = arr.slice(0);
			for(var i = 0,l = arr.length;i < l;i ++)
			{
				arr[i].call(this, e);
			}
		}
	};

	EventDispatcher.prototype.on = EventDispatcher.prototype.addEventListener;
	EventDispatcher.prototype.off = EventDispatcher.prototype.removeEventListener;
	EventDispatcher.prototype.fire = function(type, data){
		var e = {type:type};
		FL.merge(e, data||{});
		this.dispatchEvent(e);
	}
})();
;(function(){
	var Utils = FL.Utils;
	var EventDispatcher = FL.EventDispatcher;
	
	var ImageLoader = FL.ImageLoader = function()
	{
		EventDispatcher.call(this);
		this.init();
	}
	Utils.extends(ImageLoader, EventDispatcher);

	ImageLoader.prototype.init = function()
	{
		this.images = {};
		this.totalSize = 0;
		this.loadSize = 0;
	};

	ImageLoader.prototype.load = function(arr)
	{
		var that = this;
		this.init();
		var images = this.images;
		for(var i = 0, l = arr.length;i < l;i++)
		{
			var image = new Image();
			image.onload = function(e)
			{
				that._onCompleteHander(e);
			};
			this.totalSize += arr[i].size;
			images[arr[i].id] = image;
			image.size = arr[i].size;
			image.src = arr[i].src;
			image.id = arr[i].id;
			// Utils.merge(image, arr[i]);	
		}
	};

	ImageLoader.prototype._onCompleteHander = function(e)
	{
		this.loadSize += e.target.size;
		if(this.loadSize - this.totalSize > -.1)
		{
			this.dispatchEvent({type:"complete"});
		}
		else
		{
			this.dispatchEvent({type:"progress"});
		}
		log("load:" + e.target.id + ",  "+Math.floor(this.loadSize)+"/"+Math.floor(this.totalSize));
	}

})();

(function(){
	var Utils = FL.Utils;

	var Mouse = FL.Mouse = {
		stage:null,
		x:0,
		y:0,
		init:function(stage){
			this.stage = stage;
			this.element = document;
			this.x = 0;
			this.y = 0;
			this.isDown = false;
			var offset = Utils.getElementOffset(this.element);
			this.offsetX = offset.x;
			this.offsetY  =offset.y;
			this.addEvent();
		},
		addEvent:function(){
			var elem = this.element;			
			var names = ["mousedown","mousemove","mouseup"];
			var events = "ontouchstart" in window?["touchstart", "touchmove", "touchend"]:names;
			var that = this;
			events.forEach(function(name, i){
				elem.addEventListener(name, function(e)
				{
					e.preventDefault();
					
					if(i == 0) that.isDown = true;
					else if(i == 2) that.isDown = false;
					var x = e.changedTouches?e.changedTouches[0].pageX:e.pageX;
					var y = e.changedTouches?e.changedTouches[0].pageY:e.pageY;
					that.x = x - that.offsetX;
					that.y = y - that.offsetY;
					that.stage.dispatchEvent({type:name,x:that.x,y:that.y});
				});
			});
		}
	};

})();
(function(){
	var Utils = FL.Utils;

	var Keyboard = FL.Keyboard = {
		init:function(){
			this.elem = document;
			this.key = {};
			this.time = {};
			this.delay = {};
			this.addEvent();
		},
		addEvent:function(){
			var elem = this.elem;			
			var key = this.key;
			var time = this.time;
			var delay = this.delay;
			var that = this;
			elem.addEventListener("keydown", function(e){
				e.preventDefault();
				if(key[e.keyCode] !== true)
				{
					key[e.keyCode] = true;
					delay[e.keyCode] = new Date() - time[e.keyCode];
					time[e.keyCode] = new Date();
					that.keyDown();
				}
			});
			elem.addEventListener("keyup", function(e){
				e.preventDefault();
				key[e.keyCode] = false;
				that.keyUp();
			});
		},
		getIsDown:function(key){
			return this.key[KEY[key]];
		},
		getKeyDelay:function(key){
			return this.delay[KEY[key]];
		},
		keyDown:function(){},
		keyUp:function(){}
	};

	var KEY = {
		BACKSPACE : 8,
		TAB : 9,
		NUM_CENTER : 12,
		ENTER : 13,
		RETURN : 13,
		SHIFT : 16,
		CTRL : 17,
		ALT : 18,
		PAUSE : 19,
		CAPS_LOCK : 20,
		ESC : 27,
		ESCAPE : 27,
		SPACE : 32,
		PAGE_UP : 33,
		PAGE_DOWN : 34,
		END : 35,
		HOME : 36,
		LEFT : 37,
		UP : 38,
		RIGHT : 39,
		DOWN : 40,
		PRINT_SCREEN : 44,
		INSERT : 45,
		DELETE : 46,

		ZERO : 48,
		ONE : 49,
		TWO : 50,
		THREE : 51,
		FOUR : 52,
		FIVE : 53,
		SIX : 54,
		SEVEN : 55,
		EIGHT : 56,
		NINE : 57,

		A : 65,
		B : 66,
		C : 67,
		D : 68,
		E : 69,
		F : 70,
		G : 71,
		H : 72,
		I : 73,
		J : 74,
		K : 75,
		L : 76,
		M : 77,
		N : 78,
		O : 79,
		P : 80,
		Q : 81,
		R : 82,
		S : 83,
		T : 84,
		U : 85,
		V : 86,
		W : 87,
		X : 88,
		Y : 89,
		Z : 90,

		CONTEXT_MENU : 93,
		NUM_ZERO : 96,
		NUM_ONE : 97,
		NUM_TWO : 98,
		NUM_THREE : 99,
		NUM_FOUR : 100,
		NUM_FIVE : 101,
		NUM_SIX : 102,
		NUM_SEVEN : 103,
		NUM_EIGHT : 104,
		NUM_NINE : 105,
		NUM_MULTIPLY : 106,
		NUM_PLUS : 107,
		NUM_MINUS : 109,
		NUM_PERIOD : 110,
		NUM_DIVISION : 111,
		F1 : 112,
		F2 : 113,
		F3 : 114,
		F4 : 115,
		F5 : 116,
		F6 : 117,
		F7 : 118,
		F8 : 119,
		F9 : 120,
		F10 : 121,
		F11 : 122,
		F12 : 123
	};

})();
(function(){
	var Utils = FL.Utils;
	var EventDispatcher = FL.EventDispatcher;
	var Rect = FL.Rect;
	var Polygon = FL.Polygon;

	var DisplayObject = FL.DisplayObject = function(prop)
	{
		this.x = 0;
		this.y = 0;
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

		FL.merge(this, prop);
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






(function(){
	var Utils = FL.Utils;
	var DisplayObject = FL.DisplayObject;

	/*
     * parent
	**/
	var DisplayObjectContainer = FL.DisplayObjectContainer = function(prop)
	{
		DisplayObject.call(this, prop);
		if(this.parent)
		{
			this.parent.addChild(this);
		}
		this.children = [];
	};

	Utils.extends(DisplayObjectContainer, DisplayObject);

	DisplayObjectContainer.prototype.addChildAt = function(child, at) {
		at = at=="undefined"?this.children.length:at;
		this.removeChild(child);
		this.children.splice(at, 0, child);
		child.parent = this;
		
		if(this.stage)
		{
			var prop = {stage:this.stage, timeStep:this.timeStep};
			if(child instanceof DisplayObjectContainer) child.setAll(prop);
			else Utils.merge(child, prop);
		}
	};

	DisplayObjectContainer.prototype.addChild = function()
	{
		var at = this.children.length;
		for(var i = 0, l = arguments.length;i < l;i ++)
		{
			this.addChildAt(arguments[i], at++);
		}
	};

	DisplayObjectContainer.prototype.removeChild = function(obj)
	{
		var index = typeof(obj) === "number"?obj:this.children.indexOf(obj);
		if(index < 0) {
			return;
		}
		this.children[index].parent = null;
		this.children.splice(index, 1);
	};

	DisplayObjectContainer.prototype._draw = function(ctx){
		for(var i = 0, l = this.children.length;i < l;i ++){
			this.children[i].render(ctx);
		}
	};

	/**
	 *自己及自己的children设置props	
	*/
	DisplayObjectContainer.prototype.setAll = function(props)
	{
		var children = this.children;
		Utils.merge(this, props);
		for(var i = children.length - 1;i >= 0; i--)
		{
			var obj = children[i];
			Utils.merge(obj, props);
			if(obj instanceof DisplayObjectContainer)
			{
				obj.setAll(props);
			}
			else
			{
				Utils.merge(this, props);
			}
		}
	};

	/**
	 *自己及自己的children执行func	
	*/
	DisplayObjectContainer.prototype.callAll = function(func)
	{
		if(this[func]) this[func]();
		var children = this.children;
		for(var i = children.length - 1;i >= 0; i--)
		{
			var obj = children[i];
			if(obj instanceof DisplayObjectContainer)
			{
				obj.callAll(func);
			}
			else if(obj[func])
			{
				obj[func]();
			}
		}
	};

})();
(function(){
	var Utils = FL.Utils;
	var DisplayObject = FL.DisplayObject;
	var Rect = FL.Rect;

	var Bitmap = FL.Bitmap = function(prop)
	{
		DisplayObject.call(this, prop);
		this.rect = this.rect||new Rect();
		if(this.img){
			this.setImg(this.img, prop.rect);
		}
	};

	Utils.extends(Bitmap, DisplayObject);

	Bitmap.prototype._draw = function(ctx)
	{
		var rect = this.rect;
		this.img && ctx.drawImage(this.img, rect.x, rect.y, rect.width, rect.height, -this.originX, -this.originY, rect.width, rect.height);
	};

	Bitmap.prototype.setRect = function(x, y, w, h)
	{
		this.rect.set(x, y, w, h);
		this.width = w;
		this.height = h;
	};

	Bitmap.prototype.setImg = function(img, rect)
	{
		this.img = img;
		if(rect){
			this.setRect(rect.x, rect.y, rect.width, rect.height);
		}
		else{
			this.setRect(0, 0, img.width, img.height)
		}
	};
})();
(function(){
	var Utils = FL.Utils;
	var Bitmap = FL.Bitmap;

	var cacheCanvas = document.createElement("canvas");
	cacheCanvas.width = 1600;
	cacheCanvas.height = 800;
	var cacheCtx = cacheCanvas.getContext("2d");

	var _canvas = document.createElement("canvas");
	var _ctx = _canvas.getContext("2d");

	var Canvas = FL.Canvas = function(prop)
	{
		Bitmap.call(this, prop);
		this.cacheCtx = cacheCtx;
		this.cacheCanvas = cacheCanvas;
	};

	Utils.extends(Canvas, Bitmap);

	Canvas.prototype.setImage = function(width, height)
	{
		this.rect.width = this.width = _canvas.width = width||200;
		this.rect.height = this.height = _canvas.height = height||200;
		_ctx.drawImage(cacheCanvas, 0, 0);
		
		this.img = this.img||new Image();
		this.img.src = _canvas.toDataURL();
	}
})();
(function(){
	var Utils = FL.Utils;
	var Rect = FL.Rect;
	var DisplayObjectContainer = FL.DisplayObjectContainer;
	
	var Sprite = FL.Sprite = function(prop)
	{
		DisplayObjectContainer.call(this, prop);
		this.rect = this.rect||new Rect();
		if(this.img){
			this.setImg(img, prop.rect);
		}
	};

	Utils.extends(Sprite, DisplayObjectContainer);

	Sprite.prototype._draw = function(ctx)
	{
		var rect = this.rect;
		this.img && ctx.drawImage(this.img, rect.x, rect.y, rect.width, rect.height, -this.originX, -this.originY, rect.width, rect.height);
	};

	Sprite.prototype.setRect = function(x, y, w, h)
	{
		this.rect.set(x, y, w, h);
		this.width = w;
		this.height = h;
	};

	Sprite.prototype.setImg = function(img, rect)
	{
		this.img = img;
		if(rect){
			this.setRect(rect.x, rect.y, rect.width, rect.height);
		}
		else{
			this.setRect(0, 0, img.width, img.height)
		}
	};
})();
(function(){
	var Utils = FL.Utils;
	var Sprite = FL.Sprite;

	var MovieClip = FL.MovieClip = function(prop)
	{
		this._time = 0;
		this.isPlay = false;
		this.isLoop = false;
		this.frameNum = 0;
		this.totalFrame = 0;
		this.data = {};
		this.action = "";
		this.frames = [];
		this.setFrameRate(24);

		Sprite.call(this, prop);
	};
	Utils.extends(MovieClip, Sprite);

	MovieClip.prototype.play = function(name, reset)
	{
		if(name != this.action || reset)
		{
			var data = this.data[name];

			this.action = name;
			this.frames = data.frames;
			this.totalFrame = data.frames.length;
			this.isLoop = data.loop;
			this.delay = data.delay||this.delay;
			this.frameNum = 0;
			this._time = 0;
			this._setFrame();
		}
		if(!this.isPlay)
		{
			this._time = 0;
			this.isPlay = true;
		}
	};

	MovieClip.prototype.stop = function(name)
	{
		if(name)
		{
			this.play(name);
		}
		this.isPlay = false;
	};
	
	MovieClip.prototype.addAnimation = function(name, frames, loop, frameRate)
	{
		if(typeof(frames) === "string")
		{
			var all = frames.split(",");
			frames = [];
			for(var j = 0, jl = all.length;j < jl;j ++)
			{
				var temp = all[j].split("-");
				if(temp.length == 1)
				{
					frames.push(parseInt(temp[0]));
				}
				else
				{
					for(var i = parseInt(temp[0]), l = parseInt(temp[1]);i <= l;i ++)
					{
						frames.push(i);
					}
				}
			}
		}
		var obj = {frames:frames, loop:loop||false};
		frameRate > 0 && (obj.delay = 1000/frameRate);
		this.data[name] = obj;
	};

	MovieClip.prototype.setFrameRate = function(frameRate)
	{
		this.frameRate = frameRate||24;
		this.delay = 1000/this.frameRate;
	};

	MovieClip.prototype._update = function()
	{
		this._time += this.timeStep;
		if(this._time >= this.delay)
		{
			this._time = this._time - this.delay;
			this.frameNum ++;
			if(this.frameNum >= this.totalFrame)
			{
				this.frameNum = 0;
				if(!this.isLoop) this.stop();
			}
			this._setFrame();
		}
	};

	MovieClip.prototype._draw = function(ctx)
	{
		if(this.img)
		{
			ctx.drawImage(this.img, this.sourceX, this.sourceY, this.width, this.height, -this.originX, -this.originY, this.width, this.height);
		}
		if(this.isPlay)
		{
			this._update();
		}
	};

	MovieClip.prototype._setFrame = function()
	{
		var num = this.frames[this.frameNum];
		this.sourceX = (num%this.col) * this.width;
		this.sourceY = (num/this.col>>0) * this.height;
	};
	
	MovieClip.prototype.setImg = function(img, width, height)
	{
		this.img = img;
		this.width = width;
		this.height = height;

		this.col = this.img.width/this.width>>0;
		this.row = this.img.height/this.height>>0;
	};
})();
(function(){
	var DisplayObject = FL.DisplayObject;
	var Utils = FL.Utils;

	/*
     * loader
	**/
	var LoadProgress = FL.LoadProgress = function(prop)
	{
		DisplayObject.call(this, prop);
		this.width = this.width||400;
		this.height = this.height||10;
		this.setCenter();
		this.init(prop.loader);
	};
	Utils.extends(LoadProgress, DisplayObject);

	LoadProgress.prototype.init = function(loader)
	{
		this.loader = loader;
		var that = this;
		loader.addEventListener("complete", function(e){
			that.progress  = 1;
			loader.removeEventListener("complete", arguments.callee);
			loader.removeEventListener("progress", arguments.callee);
			setTimeout(function(){
				that.dispatchEvent({type:"complete"});
			}, 500);
		});
		loader.addEventListener("progress", function(e){
			that.progress = loader.loadSize/loader.totalSize;
		});
	};

	LoadProgress.prototype.load = function(arr)
	{
		var loader = this.loader;
		loader.load(arr);
	};

	LoadProgress.prototype._draw = function(ctx)
	{
		ctx.fillStyle = "#69f";
		ctx.fillRect(-this.originX, -this.originY, this.width, this.height);
		ctx.fillStyle = "#f69";
		ctx.fillRect(-this.originX+2, -this.originY+2, (this.width-4)*this.progress, this.height-4);
	};

})();
(function(){
	var Utils = FL.Utils;
	var DisplayObjectContainer = FL.DisplayObjectContainer;
	var Mouse = FL.Mouse;
	var Keyboard = FL.Keyboard;

	/**
	 * canvas, width, height, fps
	*/
	var Stage = FL.Stage = function(prop)
	{
		DisplayObjectContainer.call(this, prop);
		this.width = this.width||550;
		this.height = this.height||400;
		this.fps = this.fps||60;
		this.init();
	};
	Utils.extends(Stage, DisplayObjectContainer);

	Stage.prototype.init = function()
	{
		this.stage = this;
		this.timeStep = 1000/this.fps;
		this.canvas.width = this.width;
		this.canvas.height = this.height;
		this.ctx = this.canvas.getContext("2d");
	}

	Stage.prototype.addChildAt = function(obj, at)
	{
		this.superClass.addChildAt.call(this, obj, at);
	};

	Stage.prototype.render = function()
	{
		this.ctx.clearRect(0, 0, this.width, this.height);
		this.superClass.render.call(this, this.ctx)
	}

	Stage.prototype.start = function()
	{
		var that = this;
		this.stop();
		this._interval = setInterval(function(){
				that.render();
				that.callAll("update");
		}, 1000/this.fps);
	};

	Stage.prototype.update = function()
	{
	};

	Stage.prototype.initMouseEvent = function(mouseChildren){
		Mouse.init(this);
		if(mouseChildren)
		{
			this.addEventListener("mousedown", fireChildrenEvent);
			this.addEventListener("mousemove", fireChildrenEvent);
			this.addEventListener("mouseup", fireChildrenEvent);
		}
	};

	Stage.prototype.initKeyboardEvent = function(){
		Keyboard.init();
	};

	Stage.prototype.stop = function()
	{
		clearInterval(this._interval);
	};

	function fireChildrenEvent(e)
	{
		var children = this.children;
		for(var i = 0, l = this.children.length;i < l;i ++)
		{
			var child = children[i];
			
			if(child.mouseEnable && child.hitTestPoint(e.x, e.y))
			{
				child.dispatchEvent(e);
				return;
			}
		}
	}

})();
(function(){
    var Utils = FL.Utils;
    var EventDispatcher = FL.EventDispatcher;

    var HTMLAudio = FL.Audio = function(properties){
        this.src = null;
        this.loop = false;
        this.autoPlay = false;
        this.loaded = false;
        this.playing = false;
        this.duration = 0;
        this.volume = 1;
        this.muted = false;
        this._element = null;

        FL.merge(this, properties);

        EventDispatcher.call(this);
        
        this._onAudioEvent = this._onAudioEvent.bind(this);
    };

    Utils.extends(HTMLAudio, EventDispatcher);

    FL.merge(HTMLAudio.prototype, {
        /**
         * 加载音频文件。
         */
        load: function(){
            if(!this._element){
                var elem = this._element = new Audio();
                elem.addEventListener('canplaythrough', this._onAudioEvent, false);
                elem.addEventListener('ended', this._onAudioEvent, false);
                elem.addEventListener('error', this._onAudioEvent, false);
                elem.src = this.src;
                elem.volume = this.volume;
                elem.load();
            }
            return this;
        },

        /**
         * @private
         */
        _onAudioEvent: function(e){
            // console.log('onAudioEvent:', e.type);
            var type = e.type;

            switch(type){
                case 'canplaythrough':
                    e.target.removeEventListener(type, this._onAudioEvent);
                    this.loaded = true;
                    this.duration = this._element.duration;
                    this.fire('load');
                    if(this.autoPlay) this._doPlay();
                    break;
                case 'ended':
                    this.playing = false;
                    this.fire('end');
                    if(this.loop) this._doPlay();
                    break;
                case 'error':
                    this.fire('error');
                    break;
            }
        },

        /**
         * @private
         */
        _doPlay: function(){
            if(!this.playing){
                this._element.volume = this.muted ? 0 : this.volume;
                this._element.play();
                this.playing = true;
            }
        },

        /**
         * 播放音频。如果正在播放，则会重新开始。
         * 注意：为了避免第一次播放不成功，建议在load音频后再播放。
         */
        play: function(){
            if(this.playing) this.stop();

            if(!this._element){
                this.autoPlay = true;
                this.load();
            }else if(this.loaded){
                this._doPlay();
            }

            return this;
        },

        /**
         * 暂停音频。
         */
        pause: function(){
            if(this.playing){
                this._element.pause();
                this.playing = false;
            }
            return this;
        },

        /**
         * 恢复音频播放。
         */
        resume: function(){
            if(!this.playing){
                this._doPlay();
            }
            return this;
        },

        /**
         * 停止音频播放。
         */
        stop: function(){
            if(this.playing){
                this._element.pause();
                this._element.currentTime = 0;
                this.playing = false;
            }
            return this;
        },

        /**
         * 设置音量。注意: iOS设备无法设置音量。
         */
        setVolume: function(volume){
            if(this.volume != volume){
                this.volume = volume;
                this._element.volume = volume;
            }
            return this;
        },

        /**
         * 设置静音模式。注意: iOS设备无法设置静音模式。
         */
        setMute: function(muted){
            if(this.muted != muted){
                this.muted = muted;
                this._element.volume = muted ? 0 : this.volume;
            }
            return this;
        }
    });
})();
(function(){
	var Rect = FL.Rect;

	var Camera = FL.Camera = function(x, y, width, height, zoom){
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.zoom = zoom||1;

		this.scroll = new Vector;
		this.bounds = null;
		this.target = null;
		this.deadzone = null;
	};

	Camera.prototype.update = function(){
		var bounds = this.bounds;
		var target = this.target;
		var width = this.width;
		var height = this.height;
		var scroll = this.scroll;
		var deadzone = this.deadzone;

		if(target){
			if(deadzone){
				var targetX = target.pos.x + ((target.pos.x > 0)?0.0000001:-0.0000001);
				var targetY = target.pos.y + ((target.pos.y > 0)?0.0000001:-0.0000001);
				
				var edge = targetX - deadzone.x;
				if(scroll.x > edge){
					scroll.x = edge;
				}

				edge = targetX + target.width - deadzone.x - deadzone.width;
				if(scroll.x < edge){
					scroll.x = edge;
				}
				
				edge = targetY - deadzone.y;
				if(scroll.y > edge){
					scroll.y = edge;
				}

				edge = targetY + target.height - deadzone.y - deadzone.height;
				if(scroll.y < edge){
					scroll.y = edge;
				}
			}
			else{
				this.focusOn({x:target.pos.x + target.width*.5, y:target.pos.y + target.height*.5});
			}
		}
		
		if(bounds){
			if(scroll.x < bounds.left){
				scroll.x = bounds.left;
			}
			if(scroll.x > bounds.right - width){
				scroll.x = bounds.right - width;
			}
			if(scroll.y < bounds.top){
				scroll.y = bounds.top;
			}
			if(scroll.y > bounds.bottom - height){
				scroll.y = bounds.bottom - height;
			}
		}
	};

	/**
	 *
	 *style:platFormer  topDown  topDownTight direct
	 *
	*/
	Camera.prototype.follow = function(target, style){
		this.target = target;
		var helper;
		var width = this.width;
		var height = this.height;
		switch(style){
			case "platFormer":
				var w = width/5;
				var h = height/3;
				this.deadzone = new Rect((width-w)/2,(height-h)/2 - h*0.25,w,h);
				break;
			case "topDown":
				helper = Math.max(width,height)/4;
				this.deadzone = new Rect((width-helper)/2,(height-helper)/2,helper,helper);
				break;
			case "topDownTight":
				helper = Math.max(width,height)/8;
				this.deadzone = new Rect((width-helper)/2,(height-helper)/2,helper,helper);
				break;
			case "direct":
			default:
				this.deadzone = null;
				break;
		}
	}

	Camera.prototype.focusOn = function(point){
		this.scroll.set(point.x - this.width*0.5, point.y - this.height*0.5);
	};

	Camera.prototype.setBounds = function(x, y, width, height){
		this.bounds = this.bounds||new Rect();
		this.bounds.set(x, y, width, height);
		this.update();
	}
})();
(function(){
	var _dataList = [];
	var _targetList = [];
	var _interval = -1;
	var _step = 17;

	_interval = setInterval(update, _step);

	var Shake = FL.Shake = {
		/**
	     *direction:"x", "y", "xy"
		*/
		shake:function(target, duration, intensity, direction){
			var index = _targetList.indexOf(target);
			index = index == -1?_targetList.length:index;
			_dataList[index] = {
				duration:duration*1000||400,
				intensity:intensity||.01,
				direction:direction||"xy",
				x:target.x,
				y:target.y
			}
			_targetList[index] = target;
		},
		stop:function(target){
			var index = _targetList.indexOf(target);
			if(index!=-1){
				target.x = _dataList[index].x;
				target.y = _dataList[index].y;
				_dataList.splice(index, 1);
				_targetList.splice(index, 1);
			}
		}
	};

	function update(){
		for(var i = _dataList.length-1;i>=0;i--){
			var data = _dataList[i];
			var target = _targetList[i];
			if(data.duration > 0){
				data.duration -= _step;
				if(data.direction == "xy"||data.direction == "x")
					target.x = data.x + (Math.random()-.5)*data.intensity*target.width;
				if(data.direction == "xy"||data.direction == "y")
					target.y = data.y + (Math.random()-.5)*data.intensity*target.height;
			}
			else{
				Shake.stop(target);
			}
		}
	}
})();