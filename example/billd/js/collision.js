(function(){
	var ns = FL.ns("billd");

	var collision = ns.collision = {
		collide:function(arrA, arrB, callback){
			arrA = arrA.push?arrA:[arrA];
			arrB = arrB.push?arrB:[arrB];

			for(var i = arrA.length - 1;i >= 0;i --){
				var objA = arrA[i];
				if(objA.isInStage && objA.alive){
					for(var j = arrB.length - 1;j >= 0;j --){
						var objB = arrB[j];
						if(objB.isInStage && objB.alive && objA.hitTestObject(objB)){
							if(callback(objA, objB)){
								return true;
							}
						}
					}
				}
			}

			return false;
		}
	};

})();