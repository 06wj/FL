(function(win){
	var ns = FL.ns("billd");
	eval(FL.import("ns", "Spring, Spider, YellowBall, Floor, Fish"));
	eval(FL.import("FL", "Bitmap"));
	
	var InstanceFactory = ns.InstanceFactory = {
		create:function(type, data){
			var mc;
			switch(type)
			{
				case "spring":
					mc = Spring.create(data.x, data.y);
					ns.springs.push(mc);
					break;
				case "spider":
					mc = Spider.create(data.x, data.y);
					ns.spiders.push(mc);
					break;
				case "yellow_ball":
					mc = YellowBall.create(data.x, data.y);
					break;
				case "floor":
					mc = new Floor(data);
					ns.floors.push(mc);
					break;
				case "fish":
					mc = Fish.create(data.x, data.y);
					ns.fishs.push(mc);
					break;
				case "star":
					mc = new FL.Bitmap(data.x, data.y, R.images.star)
					mc.pos = new Vector(data.x, data.y);
					mc.originX = mc.originY = 0;
					mc.update = function(){
						this.x = ns.map.x + this.pos.x;
						this.y = ns.map.y + this.pos.y;
						if(ns.player.hitTestObject(this))
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
									ns.score += 10;
									that.parent.removeChild(that);
								}
							})
						}
					}
					break;
				default:
					mc = null;
					break;
			}
			return mc;
		}
	};

	
})(window);