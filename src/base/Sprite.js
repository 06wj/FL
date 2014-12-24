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