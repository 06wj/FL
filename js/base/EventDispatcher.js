(function(){
	var EventDispatcher = FL.EventDispatcher = function()
	{
		this.eventListeners = {};
	};

	EventDispatcher.prototype.addEventListener = function(type, listener)
	{
		if(!this.eventListeners[type]) this.eventListeners[type] = [];
		if(this.eventListeners[type].indexOf(listener)==-1) this.eventListeners[type].push(listener);
	};

	EventDispatcher.prototype.removeEventListener = function(type, listener)
	{
		if(!this.eventListeners[type]) return;
		var index = this.eventListeners[type].indexOf(listener);
		if(index != -1) this.eventListeners[type].splice(index, 1);
	};
	
	EventDispatcher.prototype.removeAllEventListener = function()
	{
		this.eventListeners = {};
	}

	/**
	*	e:{type:String, data:{}}
	*/
	EventDispatcher.prototype.dispatchEvent = function(e)
	{
		var arr = this.eventListeners[e.type];
		e.target = this;
		if(arr && arr.length > 0)
		{
			arr = arr.slice(0);
			for(var i = 0,l = arr.length;i < l;i ++)
			{
				arr[i].call(this, e);
			}
		}
	};
})();