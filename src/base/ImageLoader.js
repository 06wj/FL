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
