(function(){
	var ns = FL.ns("star");
	// eval(FL.import("ns", ""));
	eval(FL.import("FL", "Stage, LoadProgress, ImageLoader"));

	var	canvas = document.querySelector("canvas");
	var width = 550;
	var height = 400;
	var fps = 60;
	
	var stage = new Stage(canvas, width, height, fps);
	stage.start();

	var loadProgress = new LoadProgress(new ImageLoader());
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

	}
})();