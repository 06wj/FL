import os
from os.path import getsize, splitext
import codecs
import json

base_url = "img/"
# base_url = "https://raw.github.com/lasoy/FL/master/img/"
R = "../R.js"

obj = []
   
for f in os.listdir(os.getcwd()):
    names = splitext(f)
    if names[1] !=".py" and names[1] !="":
        print(names[0])
        obj.append({"id":names[0], "src":base_url+f+"?121", "size":round(getsize(f)*.001, 2)})
   
fp = codecs.open(R, "w", "utf-8")
fp.write("R={};R.images=" + json.dumps(obj, ensure_ascii=False))
fp.close()

if os.name=="nt":
	os.system("pause")

