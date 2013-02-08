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