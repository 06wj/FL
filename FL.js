(function(win){
	var FL = win.FL = {};
	var log = win.log = function(){
		console.log.apply(console, arguments);	
	};
		
	var DEG_TO_RAD = win.DEG_TO_RAD = Math.PI/180;

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
	 *   将from的模块导入到to里
	 *   modules: "Movieclip, Utils..."
	*/
	FL.import = function(from, to, modules){
		modules.replace(/\s/g,"").split(",").forEach(function(obj){
			to[obj] = from[obj];
		});
	};
})(window);
(function(win){
		var Utils = win.Utils = {};

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

		Utils.merge = function(obj, props, strict)
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

})(FL);
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
(function(win){
	var Rect = win.Rect = function(x, y, width, height){
		this.set(x, y, width, height);
	};

	Rect.prototype.set = function(x, y, width, height)
	{
		this.x = x||0;
		this.y = y||0;
		this.width = width||this.width||0;
		this.height = height||this.height||0;
	};

	Rect.prototype.intersects = function(rect){
		return rect.x <= this.x + this.width && this.x <= rect.x + rect.width&&
			rect.y <= this.y + this.height && this.y <= rect.y + rect.height;
	};

	Rect.prototype.hitTestPoint = function(x, y){
		return x>=this.x && x<=this.x+this.width&&
			y>=this.y && y<=this.y+this.height;
	}
})(FL);
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
		this.lx = this.lx||Math.min(this.p0.x, this.p1.x);
		this.rx = this.rx||Math.max(this.p0.x, this.p1.x);
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
		this.lx = this.lx||Math.min(this.p0.x, this.p1.x);
		this.rx = this.rx||Math.max(this.p0.x, this.p1.x);
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

})(FL);
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
(function(win){
	var TOTAL_SIMPSON_STEP = 100;
	var Point = function(x, y){
		this.x = x;
		this.y = y;
	};

	var Bezier = win.Bezier = function(){
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

})(FL);
(function(win){
	var Rect = win.Rect;
	var QuadTree = win.QuadTree = function(rect){
		this.q1 = null;
		this.q2 = null;
		this.q3 = null;
		this.q4 = null;
		
		this.data = [];
		this.parent = null;
		this.rect = rect;
	};

	QuadTree.prototype.createChildren = function(depth){
		if(depth == 0) return;
		
		var rect = this.rect;
		var w = rect.width * .5;
		var h = rect.height * .5;

		this.q1 = new QuadTree(new Rect(rect.x + w, rect.y, w, h));
		this.q2 = new QuadTree(new Rect(rect.x, rect.y, w, h));
		this.q3 = new QuadTree(new Rect(rect.x, rect.y + h, w, h));
		this.q4 = new QuadTree(new Rect(rect.x + w, rect.y + h, w, h));

		this.q1.parent = this.q2.parent = this.q3.parent = this.q4.parent = this;
		
		this.q1.createChildren(depth-1);
		this.q2.createChildren(depth-1);
		this.q3.createChildren(depth-1);
		this.q4.createChildren(depth-1);
	};

	QuadTree.prototype.isIn = function(x, y){
		return x>=this.rect.x && x<this.rect.x+this.rect.width&&
			y>=this.rect.y && y<this.rect.y+this.rect.height;
	};
	
	QuadTree.prototype.add = function(v, x, y){
		if(!this.isIn(x, y)) return null;
		if(this.hasChildren()){
			return this.q1.add(v, x, y)||this.q2.add(v, x, y)||this.q3.add(v, x, y)||this.q4.add(v, x, y)
		}
		else{
			this.data.push(v);
			return this;
		}
	};

	QuadTree.prototype.remove = function(v, x, y){
		if(!this.isIn(x, y)) return null;
		if(this.hasChildren()){
			return this.q1.remove(v, x, y)||this.q2.remove(v, x, y)||this.q3.remove(v, x, y)||this.q4.remove(v, x, y)
		}
		else{
			var i = this.data.indexOf(v);
			if(i < 0) return null;
			else{
				this.data.splice(i, 1);
				return this;
			}
		}
	};

	QuadTree.prototype.hasChildren = function(){
		return this.q1&&this.q2&&this.q3&&this.q4;
	};

	QuadTree.prototype.getRectData =function(rect){
		if(!rect.intersects(this.rect)) return [];
		var result = this.data.slice();
		if(this.hasChildren()){
			result = result.concat(this.q1.getRectData(this.rect));
			result = result.concat(this.q2.getRectData(this.rect));
			result = result.concat(this.q3.getRectData(this.rect));
			result = result.concat(this.q4.getRectData(this.rect));
		};
		return result;
	};
})(FL);
(function(win){
	var EventDispatcher = win.EventDispatcher = function()
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
		this.eventListeners = null;
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
			for(var i = 0,l = arr.length;i < l;i ++)
			{
				arr[i].call(this, e);
			}
		}
	};
})(FL);
;(function(win){
	var Utils = win.Utils;
	var EventDispatcher = win.EventDispatcher;
	
	var ImageLoader = win.ImageLoader = function()
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

})(FL);

;(function(win){
	var Timer = win.Timer = function(fps)
	{
		this.init(fps);
	};

	Timer.prototype.init = function(fps)
	{
		clearTimeout(this.timeout);
		this.startTime = 0;
		this.funcArr = [];
		this.funcObjArr = [];
		this.fps = fps||60;
		this.delay = 1000/this.fps;
	};

	Timer.prototype.start = function()
	{
		this.startTime = +new Date();
		var that = this;
		var run = function(){
			that.timeout = setTimeout(run, that.delay);
			that.update();
		};
		run();
	};

	Timer.prototype.stop = function()
	{
		clearTimeout(this.timeout);
	};

	Timer.prototype.update = function()
	{
		var that = this;
		var delay = this.delay;
		this.timeout = setTimeout(function(){
			that.update();
		}, delay);
		
		for(var funcObjArr = this.funcObjArr, i = 0, l = funcObjArr.length;i < l;i ++)
		{
			var funcObj = funcObjArr[i];
			if(funcObj.time >= funcObj.delay)
			{
				funcObj.time = 0;
				funcObj.func.call(funcObj.scope, funcObj.delay);
			}
			else
			{
				funcObj.time += delay;
			}
		}
	};

	Timer.prototype.addFunc = function(func, delay, scope)
	{
		var index = this.funcArr.indexOf(func);
		var scope = scope||window;
		var delay = delay||this.delay;
		var funcObj = 
		{
			func:func, 
			scope:scope, 
			delay:delay,
			time:0
		};

		if(index == -1)
		{
			this.funcObjArr.push(funcObj);
			this.funcArr.push(func);
		}
		else
		{
			this.funcObjArr[index] = funcObj;
		}

		func.call(scope);
	};

	Timer.prototype.removeFunc = function(func)
	{
		var index = this.funcArr.indexOf(func);
		if(index != -1)
		{
			this.funcArr.splice(index, 1);
			this.funcObjArr.splice(index, 1);
		}
	};

})(FL);
(function(win){
	var Utils = win.Utils;

	var Mouse = win.Mouse = {
		stage:null,
		x:0,
		y:0,
		init:function(stage){
			this.stage = stage;
			this.element = this.stage.canvas;
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
			names.forEach(function(name, i){
				elem["on" + name] = function(e)
				{
					e.preventDefault();
					
					if(i == 0) that.isDown = true;
					else if(i == 2) that.isDown = false;
					var x = e.changedTouches?e.changedTouches[0].pageX:e.pageX;
					var y = e.changedTouches?e.changedTouches[0].pageY:e.pageY;
					that.x = x - that.offsetX;
					that.y = y - that.offsetY;
					that.stage.dispatchEvent({type:name,x:that.x,y:that.y});
				};
			});
		}
	};

})(FL);
(function(win){
	var Utils = win.Utils;

	var Keyboard = win.Keyboard = {
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
			elem.onkeydown = function(e){
				e.preventDefault();
				if(key[e.keyCode] !== true)
				{
					key[e.keyCode] = true;
					delay[e.keyCode] = new Date() - time[e.keyCode];
					time[e.keyCode] = new Date();
					that.keyDown();
				}
			};
			elem.onkeyup = function(e){
				e.preventDefault();
				key[e.keyCode] = false;
				that.keyUp();
			}
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

})(FL);
(function(win){
	var Utils = win.Utils;
	var EventDispatcher = win.EventDispatcher;
	var Rect = win.Rect;
	var Polygon = win.Polygon;

	var DisplayObject = win.DisplayObject = function(x, y)
	{
		this.x = x||0;
		this.y = y||0;
		this.originX = 0;
		this.originY = 0;
		this.scaleX = 1;
		this.scaleY = 1;
		this.width = 0;
		this.height = 0;
		this.angle = 0;
		this.timeStep = 0;
		this.mouseEnable = false;
		this.rect = new Rect();
		EventDispatcher.call(this);
	};
	
	Utils.extends(DisplayObject, EventDispatcher);
	
	DisplayObject.prototype.render = function(ctx)
	{
		if(!ctx) return;
		ctx.save();
		ctx.translate(this.x, this.y);
		ctx.rotate(this.angle);
		ctx.scale(this.scaleX, this.scaleY);
		this._draw(ctx);
		ctx.restore();
	};

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

	DisplayObject.prototype.getBounds = function()
	{
		var cos = Math.cos(this.angle);
		var sin = Math.sin(this.angle);
		var originX = this.originX;
		var originY = this.originY;
		var minx, miny, maxx, maxy;
		var points = [[0, 0], [0, this.height], [this.width, this.height], [this.width, 0]];
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
		this.points = points;
		return new Rect(minx, miny, maxx - minx, maxy - miny);
	};

	DisplayObject.prototype.hitTestPoint = function(x, y)
	{
		if(this.angle == 0)
		{
			return new Rect(this.x - this.originX, this.y - this.originY, this.width, this.height).hitTestPoint(x, y);
		}

		if(this.getBounds().hitTestPoint(x, y))
		{
			return new Polygon(this.points).hitTestPoint(x, y);
		}
		return false;
	};



})(FL);






(function(win){
	var Utils = win.Utils;
	var DisplayObject = win.DisplayObject;

	var DisplayObjectContainer = win.DisplayObjectContainer = function(x, y, parent)
	{
		if(parent)
		{
			this.parent = parent;
			parent.addChild(this);
		}
		DisplayObject.call(this, x, y);
		this.children = [];
	};

	Utils.extends(DisplayObjectContainer, DisplayObject);

	DisplayObjectContainer.prototype.addChild = function()
	{
		var l = arguments.length;
		while(l-- > 0)
		{
			this._addChild(arguments[l]);
		}
		
	};

	DisplayObjectContainer.prototype._addChild = function(obj)
	{
		if(this.children.indexOf(obj) == -1)
		{
			this.children.push(obj);
			obj.parent = this;
		}
	};

	DisplayObjectContainer.prototype.removeChild = function(obj)
	{
		var index = typeof(obj) === "number"?obj:this.children.indexOf(obj);
		if(index < 0) {
			return;
		}
		this.children.splice(index, 1);
		obj.parent = null;
	};

	DisplayObjectContainer.prototype._draw = function(ctx){
		var l = this.children.length-1;
		while(l >= 0)
		{
			this.children[l].render(ctx);
			l --;
		}
	};

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
		}
	};

	DisplayObjectContainer.prototype.callAll = function(func)
	{
		var children = this.children;
		for(var i = children.length - 1;i >= 0; i--)
		{
			children[i][func] && children[i][func]();
		}
	};

})(FL);
(function(win){
	var Utils = win.Utils;
	var DisplayObject = win.DisplayObject;
	var Rect = win.Rect;

	var Bitmap = win.Bitmap = function(x, y, img)
	{
		DisplayObject.call(this, x, y);
		this.rect = new Rect();
		img && this.setImg(img);
	};

	Utils.extends(Bitmap, DisplayObject);

	Bitmap.prototype._draw = function(ctx)
	{
		var rect = this.rect;
		this.img && ctx.drawImage(this.img, rect.x, rect.y, rect.width, rect.height, -this.originX, -this.originY, this.width, this.height);
	};

	Bitmap.prototype.setRect = function(x, y, w, h)
	{
		this.rect.set(x, y, w, h);
	};

	Bitmap.prototype.setImg = function(img)
	{
		this.img = img;
		this.width = img.width;
		this.height = img.height;
		this.rect.set(0, 0, this.width, this.height);
	};
})(FL);
(function(win){
	var Utils = win.Utils;
	var Bitmap = win.Bitmap;

	var cacheCanvas = document.createElement("canvas");
	cacheCanvas.width = 1600;
	cacheCanvas.height = 800;
	var cacheCtx = cacheCanvas.getContext("2d");

	var _canvas = document.createElement("canvas");
	var _ctx = _canvas.getContext("2d");

	var Canvas = win.Canvas = function(x, y)
	{
		Bitmap.call(this, x, y);
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
})(FL);
(function(win){
	var Utils = win.Utils;
	var Rect = win.Rect;
	var DisplayObjectContainer = win.DisplayObjectContainer;
	
	var Sprite = win.Sprite = function(x, y, img)
	{
		DisplayObjectContainer.call(this, x, y);
		this.rect = new Rect();
		img && this.setImg(img);
	};

	Utils.extends(Sprite, DisplayObjectContainer);

	Sprite.prototype._draw = function(ctx)
	{
		this.superClass._draw.call(this, ctx);
		var rect = this.rect;
		this.img && ctx.drawImage(this.img, rect.x, rect.y, rect.width, rect.height, -this.originX, -this.originY, this.width, this.height);
	};

	Sprite.prototype.setRect = function(x, y, w, h)
	{
		this.rect.set(x, y, w, h);
	};

	Sprite.prototype.setImg = function(img)
	{
		this.img = img;
		this.width = img.width;
		this.height = img.height;
		this.rect.set(0, 0, this.width, this.height);
	};
})(FL);
(function(win){
	var Utils = win.Utils;
	var Sprite = win.Sprite;

	var MovieClip = win.MovieClip = function(x, y)
	{
		Sprite.call(this, x, y);

		this.time = 0;
		this.isPlay = false;
		this.isLoop = false;
		this.frameNum = 0;
		this.totalFrame = 0;
		this.data = {};
		this.action = "";
		this.frames = [];
		this.setFrameRate(24);
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
			this.time = 0;
			this._setFrame();
		}
		if(!this.isPlay)
		{
			this.time = 0;
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
			var temp = frames.split("-");
			frames = [];
			for(var i = parseInt(temp[0]), l = parseInt(temp[1]);i <= l;i ++)
			{
				frames.push(i);
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
		this.time += this.timeStep;
		if(this.time >= this.delay)
		{
			this.time = this.time - this.delay;
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
})(FL);
(function(win){
	var DisplayObject = win.DisplayObject;
	var Utils = win.Utils;

	var LoadProgress = win.LoadProgress = function(loader, x, y)
	{
		DisplayObject.call(this, x , y);
		this.width = 400;
		this.height = 10;
		this.setCenter();
		this.init(loader);
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

})(FL);
(function(win){
	var Utils = win.Utils;
	var DisplayObjectContainer = win.DisplayObjectContainer;
	var Mouse = win.Mouse;
	var Keyboard = win.Keyboard;

	var Stage = win.Stage = function(canvas, width, height, fps)
	{
		DisplayObjectContainer.call(this);
		this.init(canvas, width, height, fps);
	};
	Utils.extends(Stage, DisplayObjectContainer);

	Stage.prototype.init = function(canvas, width, height, fps)
	{
		this.canvas = canvas;
		this.width = canvas.width = width||550;
		this.height = canvas.height = height||400;
		this.fps = fps||60;
		this.timeStep = 1000/this.fps;
		this.ctx = canvas.getContext("2d");
	}

	Stage.prototype._addChild = function(obj)
	{
		this.superClass._addChild.call(this, obj);
		var prop = {stage:this, timeStep:this.timeStep};
		if(obj instanceof DisplayObjectContainer) obj.setAll(prop);
		else Utils.merge(obj, prop);
	};

	Stage.prototype.render = function()
	{
		this.ctx.clearRect(0, 0, this.width, this.height);
		this.superClass._draw.call(this, this.ctx);
	}

	Stage.prototype.start = function()
	{
		this.stop();
		var that = this;
		this._interval = setInterval(function(){
				that.render();
				that.update();
				that.callAll("update");
		}, 1000/this.fps);
	};

	Stage.prototype.update = function()
	{
	};

	Stage.prototype.initMouseEvent = function(){
		Mouse.init(this);
		this.addEventListener("mousedown", fireChildrenEvent);
		this.addEventListener("mousemove", fireChildrenEvent);
		this.addEventListener("mouseup", fireChildrenEvent);
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

})(FL);
