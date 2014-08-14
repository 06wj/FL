(function(){
	var ns = FL.ns("miaomiao");
	eval(FL.import("FL", "Stage, LoadProgress, ImageLoader, MovieClip, Bitmap"));

	var	canvas = document.querySelector("canvas");
	var width = 560;
	var height = 360;
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

	stage.update = function(){
		console.log();
	};

	function init(){
		var offset = 150;
		var y = height - 20;
		bg = new Bitmap({
			x:width * .5 - 13, 
			y:10, 
			img:R.images.bg
		});
		bg.originX = bg.width * .5;
		stage.addChild(bg);

		var g = .1;

		cat0 = new MovieClip({
			x:offset, 
			y:y,
			vy:0,
			update:function(){
				this.vy += g;
				this.y += this.vy;
				if(this.y > y){
					this.y = y;
					this.vy = -5;
				}

				if(Math.abs(this.vy) < 4){
					this.play("jump");
				}
				else{
					this.play("move");
				}
			},
			scaleX:-1,
			originX:41,
			originY:85
		});
		cat0.setImg(R.images.cat, 82, 85);
		cat0.addAnimation("move", "0-1", true, 12);
		cat0.addAnimation("jump", "4", true, 12);
		stage.addChild(cat0);
		cat0.play("move");

		cat1 = new MovieClip({
			x:width - offset, 
			y:y,
			originX:41,
			originY:85
		});
		cat1.setImg(R.images.cat, 82, 85);
		cat1.addAnimation("move", "0-1", true, 12);
		stage.addChild(cat1);
		cat1.play("move");

		ball = new Bitmap({
			x:width * .5, 
			y:y - 100, 
			img:R.images.ball,
			v:0,
			jumpV:-7,
			update:function(){
				this.v += .1;
				this.y += this.v;
				if(this.y > y){
					this.y = y;
					this.v = this.jumpV;
					this.jumpV *= .95;
				}
			}
		});
		ball.setCenter();
		stage.addChild(ball);
	}

	log(this)
})();