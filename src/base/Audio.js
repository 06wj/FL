(function(){
    var Utils = FL.Utils;
    var EventDispatcher = FL.EventDispatcher;

    var HTMLAudio = FL.Audio = function(properties){
        this.src = null;
        this.loop = false;
        this.autoPlay = false;
        this.loaded = false;
        this.playing = false;
        this.duration = 0;
        this.volume = 1;
        this.muted = false;
        this._element = null;

        FL.merge(this, properties);

        EventDispatcher.call(this);
        
        this._onAudioEvent = this._onAudioEvent.bind(this);
    };

    Utils.extends(HTMLAudio, EventDispatcher);

    FL.merge(HTMLAudio.prototype, {
        /**
         * 加载音频文件。
         */
        load: function(){
            if(!this._element){
                var elem = this._element = new Audio();
                elem.addEventListener('canplaythrough', this._onAudioEvent, false);
                elem.addEventListener('ended', this._onAudioEvent, false);
                elem.addEventListener('error', this._onAudioEvent, false);
                elem.src = this.src;
                elem.volume = this.volume;
                elem.load();
            }
            return this;
        },

        /**
         * @private
         */
        _onAudioEvent: function(e){
            // console.log('onAudioEvent:', e.type);
            var type = e.type;

            switch(type){
                case 'canplaythrough':
                    e.target.removeEventListener(type, this._onAudioEvent);
                    this.loaded = true;
                    this.duration = this._element.duration;
                    this.fire('load');
                    if(this.autoPlay) this._doPlay();
                    break;
                case 'ended':
                    this.playing = false;
                    this.fire('end');
                    if(this.loop) this._doPlay();
                    break;
                case 'error':
                    this.fire('error');
                    break;
            }
        },

        /**
         * @private
         */
        _doPlay: function(){
            if(!this.playing){
                this._element.volume = this.muted ? 0 : this.volume;
                this._element.play();
                this.playing = true;
            }
        },

        /**
         * 播放音频。如果正在播放，则会重新开始。
         * 注意：为了避免第一次播放不成功，建议在load音频后再播放。
         */
        play: function(){
            if(this.playing) this.stop();

            if(!this._element){
                this.autoPlay = true;
                this.load();
            }else if(this.loaded){
                this._doPlay();
            }

            return this;
        },

        /**
         * 暂停音频。
         */
        pause: function(){
            if(this.playing){
                this._element.pause();
                this.playing = false;
            }
            return this;
        },

        /**
         * 恢复音频播放。
         */
        resume: function(){
            if(!this.playing){
                this._doPlay();
            }
            return this;
        },

        /**
         * 停止音频播放。
         */
        stop: function(){
            if(this.playing){
                this._element.pause();
                this._element.currentTime = 0;
                this.playing = false;
            }
            return this;
        },

        /**
         * 设置音量。注意: iOS设备无法设置音量。
         */
        setVolume: function(volume){
            if(this.volume != volume){
                this.volume = volume;
                this._element.volume = volume;
            }
            return this;
        },

        /**
         * 设置静音模式。注意: iOS设备无法设置静音模式。
         */
        setMute: function(muted){
            if(this.muted != muted){
                this.muted = muted;
                this._element.volume = muted ? 0 : this.volume;
            }
            return this;
        }
    });
})();