(function(win){
	var _dataList = [];
	var _targetList = [];
	var _interval = -1;
	var _step = 17;

	_interval = setInterval(update, _step);

	var Shake = FL.Shake = {
		/**
	     *direction:"x", "y", "xy"
		*/
		shake:function(target, duration, intensity, direction){
			var index = _targetList.indexOf(target);
			index = index == -1?_targetList.length:index;
			_dataList[index] = {
				duration:duration*1000||400,
				intensity:intensity||.01,
				direction:direction||"xy",
				x:target.x,
				y:target.y
			}
			_targetList[index] = target;
		},
		stop:function(target){
			var index = _targetList.indexOf(target);
			if(index!=-1){
				target.x = _dataList[index].x;
				target.y = _dataList[index].y;
				_dataList.splice(index, 1);
				_targetList.splice(index, 1);
			}
		}
	};

	function update(){
		for(var i = _dataList.length-1;i>=0;i--){
			var data = _dataList[i];
			var target = _targetList[i];
			if(data.duration > 0){
				data.duration -= _step;
				if(data.direction == "xy"||data.direction == "x")
					target.x = data.x + (Math.random()-.5)*data.intensity*target.width;
				if(data.direction == "xy"||data.direction == "y")
					target.y = data.y + (Math.random()-.5)*data.intensity*target.height;
			}
			else{
				Shake.stop(target);
			}
		}
	}
})(FL);