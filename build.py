import codecs
import os
outPut = "FL.js"
outMinPut = "FL.min.js"
files = [
	"js/base/base.js",
	"js/base/utils.js",
	"js/game/Vector.js",

	"js/base/goem/Rect.js",
	"js/base/goem/Line.js",
	"js/base/goem/Polygon.js",
	"js/base/goem/Bezier.js",

	# "js/base/data/Heap.js",
	#"js/base/data/QuadTree.js",

	"js/base/EventDispatcher.js",
	"js/base/ImageLoader.js",
	#"js/base/Timer.js",
	"js/base/Mouse.js",
	"js/base/Keyboard.js",

	"js/base/DisplayObject.js",
	"js/base/DisplayObjectContainer.js",
	"js/base/Bitmap.js",
	"js/base/Canvas.js",
	"js/base/Sprite.js",
	"js/base/MovieClip.js",
	"js/base/LoadProgress.js",

	"js/base/Stage.js",

	"js/game/Camera.js",
	"js/game/Shake.js"
]

def cat(files, toFile):
	print("build " + toFile)
	ff = codecs.open(toFile, "w", "utf-8")
	ff.write("")
	ff.close()
	ff = codecs.open(toFile, "a", "utf-8")
	for file in files:
		file = file.replace("/", os.sep)
		f = codecs.open(file, "r", "utf-8")
		ff.write(f.read())
		ff.write("\n")
		f.close()
		print(file)
	ff.close()
	print("\n")
#cat(files, outPut)

filesStr = ""
for file in files:
	file = file.replace("/", os.sep)
	filesStr = filesStr + file + " "

os.system("uglifyjs " +  filesStr +
	" -o " + outMinPut + 
	" --source-map FL.min.js.map" +
	" --source-map-root http://littlebilld.duapp.com/FL"
	" -p 5 -c -m"
)
if os.name == "nt":
	os.system("pause")


