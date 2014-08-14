(function(){
	var ns = FL.ns("star");
	// eval(FL.import("ns", ""));
	eval(FL.import("FL", "Stage, LoadProgress, ImageLoader, Bitmap, MovieClip"));

	var	canvas = document.querySelector("canvas");
	var width = 550;
	var height = 400;
	var fps = 60;
	
	var stage = new Stage({
		canvas:canvas, 
		width:width, 
		height:height, 
		fps:fps
	});
	stage.start();

	var loadProgress = new LoadProgress({
		loader:new ImageLoader()
	});
	loadProgress.x = width>>1;loadProgress.y=height>>1;
	loadProgress.addEventListener("complete", function(){
		stage.removeChild(this);
		this.removeAllEventListener("complete", arguments.callee);
		loadProgress = null;
		R.images = this.loader.images; 
		init();
	});
	loadProgress.load(R.images);
	stage.addChild(loadProgress);

	stage.initMouseEvent();
	stage.initKeyboardEvent();

	function init(){
		var star = new MovieClip();
		star.setImg(R.images.star, 144, 143);
		star.setCenter();
		star.addAnimation("ha", "0", true, 16);
		star.play("ha")
		stage.addChild(star);
		star.x = star.y = 200;

		var vx, vy;
		vx = vy = .1;
		vy*=.1;

		var max = 1.3;
		var min = .7;

		star.update = function(){
			this.scaleX += vx;
		}
	}
})();