(function(win){
	var FL = win.FL = {};
	try{
		log = function(){
			console.log.apply(console,arguments);
		};
		log(1);
	}
	catch(e){
		log=function(){
			console.dir(arguments);
		}
	}
		
	var DEG_TO_RAD = win.DEG_TO_RAD = Math.PI/180;

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
	 *   将from的模块导入到to里
	 *   modules: "Movieclip, Utils..."
	*/
	FL.import = function(from, to, modules){
		modules.replace(/\s/g,"").split(",").forEach(function(obj){
			to[obj] = from[obj];
		});
	};

	FL.debug = FL.getUrlParams().debug;
})(window);