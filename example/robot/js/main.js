(function(){
	var ns = FL.ns("robot");
	eval(FL.import("FL", "Stage, LoadProgress, ImageLoader, MovieClip"));

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

	setInterval(function(){
		stage.render();
	}, 1000/fps);

	function init(){
		bat = new MovieClip();
		bat.setImg(R.images.batAnim, 53, 30);
		bat.addAnimation("move", "0-16", true, 12);
		stage.addChild(bat);
		bat.play("move");

		enemyExplosion = new MovieClip
		enemyExplosion.setImg(R.images.enemyExplosion, 111, 111);
		enemyExplosion.addAnimation("bomb", "0-17",true, 12);
		enemyExplosion.play("bomb");
		enemyExplosion.y = 100;
		stage.addChild(enemyExplosion);

		enemy_dog_left = new MovieClip
		enemy_dog_left.setImg(R.images.enemy_dog_left, 65, 51);
		enemy_dog_left.addAnimation("move", "0-10", true, 10);
		enemy_dog_left.play("move");
		stage.addChild(enemy_dog_left);
		enemy_dog_left.x = 100;

		enemy_hang_turn_left = new MovieClip;
		enemy_hang_turn_left.setImg(R.images.enemy_hang_turn_left, 58, 45);
		enemy_hang_turn_left.addAnimation("move", "0-9", true, 4);
		stage.addChild(enemy_hang_turn_left);
		enemy_hang_turn_left.x = 200;
		enemy_hang_turn_left.play("move");

		enemy_fly_right = new MovieClip;
		enemy_fly_right.setImg(R.images.enemy_fly_right, 46, 54);
		enemy_fly_right.addAnimation("move", "0-8", true, 12);
		stage.addChild(enemy_fly_right);
		enemy_fly_right.x = 300;
		enemy_fly_right.play("move");

		explosion = new MovieClip;
		explosion.setImg(R.images.explosion, 140, 180);
		explosion.addAnimation("bomb", "0-14", true, 10);
		stage.addChild(explosion);
		explosion.x = 300;
		explosion.play("bomb");

	}

	log(this)
})();