(function(win){
	var ns = FL.ns("billd");
	eval(FL.import("FL", "Utils, Bitmap"));

	var Spring = ns.Spring = function(x, y)
	{
		Bitmap.call(this, x, y);
	};
	Utils.extends(Spring, Bitmap);

	Spring.prototype.update = function(){

	};

	Spring.create = function(x, y){
		var sp = new Spring(x, y);
		sp.setImg(R.images.spring);
		return sp;
	};
})(window);