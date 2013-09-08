(function(){
	document.body.style.webkitTouchCallout = "none";
	document.body.style.webkitUserSelect = "none";
	document.body.style.webkitTextSizeAdjust = "none";
	document.body.style.webkitTapHighlightColor = "rgba(0,0,0,0)";

	var ns = FL.ns("billd");
	eval(FL.import("ns", "Player, Map, YellowBall, Spider, Fish, Floor, Bat, Spring, InstanceFactory"));
	eval(FL.import("FL", "Stage, LoadProgress, ImageLoader, Camera, Utils"));

	var getMapData = function(i){
		return JSON.parse(JSON.stringify(ns.allData[i||0]));
	}

	var lifeDom = document.querySelector("#life");
	var scoreDom = document.querySelector("#score");
	var	canvas = document.querySelector("canvas");
	var width = 600;
	var height = 300;
	var fps = 60;
	var mc;
	var life = 99;
	ns.score = 0;
	ns.allData = mapData;
	mapData = getMapData(FL.params.stage);

	var stage = ns.stage = new Stage(canvas, width, height, fps);
	stage.start();
	var isShake = false;

	var loadProgress = new LoadProgress(new ImageLoader());
	loadProgress.x = width>>1;loadProgress.y=height>>1;
	loadProgress.addEventListener("complete", function(){
		stage.removeChild(this);
		this.removeAllEventListener();
		loadProgress = null;
		R.images = this.loader.images;
		init();
	});
	loadProgress.load(R.images);
	stage.addChild(loadProgress);

	stage.initMouseEvent();
	stage.initKeyboardEvent();

	var map, player, camera;

	var snails = ns.snails = [];
	var spiders = ns.spiders = [];
	var fishs = ns.fishs = [];
	var floors = ns.floors = [];
	var springs = ns.springs = [];
	var yellowBalls = ns.yellowBalls = [];

	ns.setStage = function(i){
		snails.length = 0;
		spiders.length = 0;
		fishs.length = 0;
		springs.length = 0;
		floors.length = 0;
		stage.children.length = 0;
		mapData = getMapData(i);
		init();
	}

	setInterval(function(){
		stage.render();
	}, 1000/fps);

	function init(){
		map = ns.map = new Map();

		player = ns.player = Player.create();

		map.init(mapData.map.width, mapData.map.height);
		camera = new Camera(0, 0, width, height);
		
		player.pos.x = mapData.mc.player[0].x;
		player.pos.y = mapData.mc.player[0].y;
		player.y = player.pos.y + map.y;

		var bg = ns.bg = new FL.Bitmap();
		bg.setImg(R.images.bg);
		bg.visible = FL.params.bg!=0;

		bgSX = bg.width < map.width?(bg.width-width)/(map.width-width):1;
		bgSY = bg.height < map.height?(bg.height-height)/(map.height-height+420):1;
		bg.update = function(){
			bg.x = map.x * bgSX;
			bg.y = Math.min(map.y * bgSY, 0) ;
		}

		stage.addChild(bg);
		stage.addChild(map);
		stage.addChild(player);

		mapData.mc.floor = mapData.floor;
		for(var type in mapData.mc)
		{
			if(type == "yellow_ball") continue;
			var arr = mapData.mc[type]||[];
			for(var i = 0,l = arr.length;i < l;i ++)
			{
				var mc = InstanceFactory.create(type, arr[i]);
				mc && stage.addChild(mc);
			}
		}

		if(ns.door)stage.addChildAt(ns.door, 1);

		stage.update = update;
	}

	function update(){
		ns.fps ++;

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
			for(var j = 0, jl = yellowBalls.length;j < jl;j ++){
				var ball = yellowBalls[j];
				if(spider.alive && spider.isInStage && !ball.isDie && ball.isInStage && ball.hitTestObject(spider)){
					spider.v.y = -4;
					spider.v.x = 0;
					spider.scaleX = 1;
					spider.setCenter();
					spiders.splice(spiders.indexOf(spider), 1);
					TweenLite.to(spider, 2, {scaleX:.8, scaleY:.8, angle:10, onComplete:function(){
						stage.removeChild(spider);
					}})
					spider.alive = false;
					ns.score += 5;
					i--;
					l--;
					ball.destroy();
					break;
				}
			}

			if(	spider.alive && spider.isInStage && player.alive && player.hitTestObject(spider))
			{
				if(player.v.y > 0){
					player.v.y = -5;
					spider.v.y = -4;
					spider.v.x = 0;
					spider.scaleX = 1;
					spider.setCenter();
					spiders.splice(spiders.indexOf(spider), 1);
					i--;
					l--;
					TweenLite.to(spider, 2, {scaleX:.8, scaleY:.8, angle:10, onComplete:function(){
						stage.removeChild(spider);
					}})
					spider.alive = false;
					ns.score += 5;
				}	
				else{
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

		lifeDom.innerHTML = "life:" + life;
		scoreDom.innerHTML = "score:" + ns.score;
	}


})();