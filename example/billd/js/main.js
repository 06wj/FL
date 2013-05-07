(function(){
	var ns = FL.ns("billd");
	eval(FL.import("ns", "Player, Map, YellowBall, Spider, Fish, Floor, Bat, Spring"));
	eval(FL.import("FL", "Stage, LoadProgress, ImageLoader, Camera"));

	var	canvas = document.querySelector("canvas");
	var width = 600;
	var height = 300;
	var fps = 60;
	var mc;
	var life = 99;
	var score = 0;

	var stage = new Stage(canvas, width, height, fps);
	stage.start();
	var isShake = false;

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

	// stage.initMouseEvent();
	stage.initKeyboardEvent();

	var map, player;
	var spiders = [];
	var fishs = [];
	var camera;

	var floors = ns.floors = [];
	var springs = ns.springs = [];

	setInterval(function(){
		stage.render();
	}, 1000/fps);

	function init(){
		map = ns.map = new Map();
		map.init(mapData.map.width, mapData.map.height);

		camera = new Camera(0, 0, width, height);

		player = Player.create();
		player.map = map;
		stage.addChild(player);

		map.y = -474.95000000000005;
		player.pos.x = mapData.mc.player[0].x;
		player.pos.y = mapData.mc.player[0].y;
		player.y = player.pos.y + map.y;

		for(var i = 0; i < mapData.mc.spring.length;i ++)
		{
			var pos = mapData.mc.spring[i];
			var spring = Spring.create(pos.x, pos.y);
			stage.addChild(spring);
			springs.push(spring);
		}


		for(var i = 0; i < mapData.mc.yellow_ball.length;i ++)
		{
			var pos = mapData.mc.yellow_ball[i];
			var ball = YellowBall.create(pos.x, pos.y);
			stage.addChild(ball);
		}

		for(var i = 0; i < mapData.mc.spider.length;i ++)
		{
			var pos = mapData.mc.spider[i];
			var spider = Spider.create(pos.x, pos.y);
			stage.addChild(spider);
			spiders.push(spider);
		}

		for(var i = 0; i < mapData.mc.fish.length;i ++)
		{
			var pos = mapData.mc.fish[i];
			var fish = Fish.create(pos.x, pos.y);
			stage.addChild(fish);
			fishs.push(fish);
		}
		
		for(var i = 0;i < mapData.floor.length;i ++)
		{
			var floor = new ns.Floor(mapData.floor[i]);
			stage.addChild(floor);
			floors.push(floor);
		}

		mapData.mc.star = mapData.mc.star||[];
		for(var i = 0; i < mapData.mc.star.length;i ++)
		{
			var pos = mapData.mc.star[i];
			var star = new FL.Bitmap(pos.x, pos.y, R.images.star)
			stage.addChild(star);
			star.xx=star.x;
			star.yy=star.y;
			star.originX = star.originY = 0;
			star.update = function(){
				this.x = map.x+this.xx;
				this.y=map.y+this.yy
				if(player.hitTestObject(this))
				{
					this.update = null;
					var that = this;
					TweenLite.to(this, 1, {
						angle:11,
						scaleX:0,
						scaleY:0,
						x:578,
						y:12,
						onComplete:function() {
							score += 10;
							stage.removeChild(that);
						}
					})
				}
			}
		}

		var bat = Bat.create(100, 40);
		stage.addChild(bat);
		bat.target = player;

		stage.update = update;
		stage.addChild(map);

		bg = new FL.Bitmap();
		bg.setImg(R.images.bg);
		stage.addChild(bg);
		bgSX = (bg.width-width)/(map.width-width);
		bgSY = (bg.height-height)/(map.height-height);

		bg.update = function(){
			bg.x = map.x * bgSX;
			bg.y = map.y * bgSY ;
		}
	}

	function update(){
		if(player.x >= Math.floor(width * .6) && map.x > width - map.width)
		{
			map.x = width * .6 - player.pos.x;
		}

		else if(player.x <= width * .4 && map.x < 0)
		{
			map.x = width * .4 - player.pos.x;
		}

		if(player.y <= Math.ceil(height * .3))
		{
			map.y = height * .3 - player.pos.y;
		}
		
		else if(player.y >= Math.floor(height * .7) && map.y > height - map.height)
		{
			map.y = height * .7 - player.pos.y;

		}

		if(player.pos.y > map.height && !isShake)
		{
			FL.Shake.shake(stage, .5, .03, "xy");
			isShake = true;
			setTimeout(function(){
				isShake = false;
				map.y = 200;
				map.x = 0;
				player.die();
				player.pos.x = player.x = mapData.mc.player[0].x;
				player.pos.y = player.y = mapData.mc.player[0].y;
			}, 1000);
		}

		if(player.pos.x < player.width*.5){
			player.pos.x = player.width*.5;
		}

		if(player.pos.x > map.width-player.width*.5){
			player.pos.x = map.width-player.width*.5;
		}



		for(var i = 0, l = spiders.length;i < l;i ++)
		{
			var spider = spiders[i];
			if(	spider.alive && spider.isInStage && player.hitTestObject(spider))
			{
				if(player.v.y > 0){
					player.v.y = -5;
					spider.v.y = -4;
					spider.v.x = 0;
					spider.scaleX = 1;
					spider.setCenter();
					spiders.splice(spiders.indexOf(spider), 1);
					TweenLite.to(spider, 2, {scaleX:.8, scaleY:.8, angle:10, onComplete:function(){
						stage.removeChild(spider);
					}})
					spider.alive = false;
					score += 5;
				}	
				else if(player.alive){
					player.die();
					spider.attack();
					player.v.set(0, 0);
					player.a.x = spider.pos.x > player.pos.x ? -3:3;
					spider.v.x *= (spider.pos.x - player.pos.x) * spider.v.x < 0? 1:-1;
					life --;
					FL.Shake.shake(stage, .5, .02, "xy")
				}
				break;
			}
		}

		for(var i = 0, l = fishs.length;i < l;i ++)
		{
			var fish = fishs[i];
			if(player.hitTestObject(fish) && player.alive)
			{
				player.die();
				player.v.y = -4;
				player.a.x = player.v.x>0 ? -3:3;
				FL.Shake.shake(stage, .5, .02, "xy")
				break;
			}
		}

		document.getElementById("life").innerHTML = "life:" + life;
		document.getElementById("score").innerHTML = "score:" + score;
	}


})();