(function(win){
	var ns = FL.ns("billd");
	var pool = {};
	
	var InstanceFactory = {
		create:function(type, x, y){
			return ns[type].create(x, y);
		}
	};

	
})(window);