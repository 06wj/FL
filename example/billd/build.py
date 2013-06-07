import os
filesStr = "\
	R.js \
	mapData.js \
	js/Floor.js \
	js/Player.js \
	js/YellowBall.js \
	js/Snail.js \
	js/Spider.js \
	js/Fish.js \
	js/Bat.js \
	js/Spring.js \
	js/Map.js \
	js/InstanceFactory.js \
	js/main.js"

os.system("uglifyjs " +  filesStr +
	" -o game.min.js" + 
	" --source-map game.min.js.map" +
	" --source-map-root http://littlebilld.duapp.com/FL/example/billd"
	" -p 5 -c -m"
)
if os.name == "nt":
	os.system("pause")