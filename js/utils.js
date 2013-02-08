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