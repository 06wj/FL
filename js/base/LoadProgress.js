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