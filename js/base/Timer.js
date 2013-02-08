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