(function(){
	var ns = FL.ns("billd");

	ns.moveable = {
		setPos:function(){
			this.x = this.pos.x + ns.map.x;
			this.y = this.pos.y + ns.map.y;
		},
		checkMap:function(){
			var map = ns.map;
			if(this.v.y > 0)
			{
				var dataArr = map.mapData[(this.x - map.x)>>0];
				if(dataArr){
					for(var i = 0, l = dataArr.length;i < l;i ++)
					{
						var data = dataArr[i];
						if(data.y <= this.pos.y + 2 && data.y >= this.pos.y - 5)
						{
							this.pos.y = data.y;
							this.v.y = 0;
							this.angle = data.ang;
							this.a.x = Math.sin(this.angle) * (Math.cos(this.angle)>0?1:-1) * .07;
							this.onGround = true;
							break;
						}
					}
				}
			}
			
			if(this.v.y > 0 && this.onGround)
			{
				this.onGround = false;
				this.pos.minus(this.v);
				this.v.x *= -1;
				this.v.y = 0;
			}
		},
		checkBounds:function(){
			if(this.pos.x < this.width) {
				this.pos.x = this.width;
				this.v.x = this.speed;
			}

			if(this.pos.x > ns.map.width-this.width) {
				this.pos.x = ns.map.width-this.width;
				this.v.x = this.speed * -1;
			}
		},
		onMove:function(){

		}
	};
})();