(function(){
	var ns = FL.ns("billd");

	var pool = {};
	var sound = ns.sound = {
		get:function(name){
			if(sound[name]){
				return sound[name];
			}
			else{
				var audio = new FL.Audio({
					src:"./sound/" + name + ".wav"
				});
				sound[name] = audio;
				return audio;
			}
		},
		play:function(name){
			this.get(name).play();
		},
		stop:function(name){
			this.get(name).stop();
		}
	};
})();