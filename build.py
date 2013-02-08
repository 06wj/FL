import codecs
import os
outPut = "FL.js"
files = [
"js/base.js",
"js/Vector.js",
"js/utils.js",

"js/goem/Rect.js",
"js/goem/Line.js",
"js/goem/Polygon.js",

# "js/data/Heap.js",
"js/data/QuadTree.js",

"js/EventDispatcher.js",
"js/ImageLoader.js",
"js/Timer.js",
"js/Mouse.js",
"js/Keyboard.js",

"js/DisplayObject.js",
"js/DisplayObjectContainer.js",
"js/Bitmap.js",
"js/Canvas.js",
"js/Sprite.js",
"js/MovieClip.js",
"js/LoadProgress.js",

"js/Stage.js"]

def cat(files, toFile):
	print("build " + toFile)
	ff = codecs.open(toFile, "w", "utf-8")
	ff.write("")
	ff.close()
	ff = codecs.open(toFile, "a", "utf-8")
	for file in files:
		f = codecs.open(file, "r", "utf-8")
		ff.write(f.read())
		ff.write("\n")
		f.close()
		print(file)
	ff.close()
	print("\n")
cat(files, outPut)


os.system("pause")


