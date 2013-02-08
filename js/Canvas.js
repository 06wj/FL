(function(win){
	var Utils = win.Utils;
	var Bitmap = win.Bitmap;

	var cacheCanvas = document.createElement("canvas");
	cacheCanvas.width = 1600;
	cacheCanvas.height = 800;
	var cacheCtx = cacheCanvas.getContext("2d");

	var _canvas = document.createElement("canvas");
	var _ctx = _canvas.getContext("2d");

	var Canvas = win.Canvas = function(x, y)
	{
		Bitmap.call(this, x, y);
		this.cacheCtx = cacheCtx;
		this.cacheCanvas = cacheCanvas;
	};

	Utils.extends(Canvas, Bitmap);

	Canvas.prototype.setImage = function(width, height)
	{
		this.rect.width = this.width = _canvas.width = width||200;
		this.rect.height = this.height = _canvas.height = height||200;
		_ctx.drawImage(cacheCanvas, 0, 0);
		
		this.img = this.img||new Image();
		this.img.src = _canvas.toDataURL();
	}
})(FL);