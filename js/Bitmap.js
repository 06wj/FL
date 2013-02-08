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