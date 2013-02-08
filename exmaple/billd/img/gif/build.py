import os
from os.path import getsize, splitext

for f in os.listdir():
    names = splitext(f)
    if names[1] ==".gif":
        os.system("Gif2Png.exe " + f + " " + names[0] + ".gif")

