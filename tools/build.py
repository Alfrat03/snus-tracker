import os,re,sys,shutil
SRC=os.path.dirname(os.path.abspath(__file__)); OUT=sys.argv[1] if len(sys.argv)>1 else os.path.dirname(SRC)
A=SRC+"/app"
rd=lambda f:open(f"{A}/{f}").read()
css=rd("style.css").replace("@media (max-width:480px){","@media (max-width:480px), (pointer:coarse){")+rd("app.css")
markup=rd("markup.html")
app="/* Snus Tracker - file generato da tools/build.py: modifica i sorgenti in tools/app */\n(function(){\n\"use strict\";\nvar $=function(s){return document.querySelector(s)};\n"+rd("helpers.js")+rd("logic.js")+rd("art.js")+rd("views.js")+rd("events.js")+"\n})();\n"
os.makedirs(OUT,exist_ok=True)
VER=open(f"{A}/VERSION").read().strip()
head=f"""<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>Snus Tracker</title>
<meta name="description" content="Tieni il conto di bustine, nicotina e spesa.">
<meta name="theme-color" content="#f2f2f7">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="Snus Tracker">
<meta name="format-detection" content="telephone=no">
<link rel="manifest" href="manifest.webmanifest">
<link rel="icon" href="icons/icon-192.png" type="image/png">
<link rel="apple-touch-icon" href="icons/icon-180.png">
<style>
{css}
</style>
</head>
<body>
{markup}
<script src="config.js?v={VER}"></script>
<script src="app.js?v={VER}"></script>
</body>
</html>
"""
open(f"{OUT}/index.html","w").write(head)
open(f"{OUT}/app.js","w").write(app)
for f in ["manifest.webmanifest"]:
    shutil.copy(f"{A}/static/{f}",f"{OUT}/{f}")
sw=open(f"{A}/static/sw.js").read().replace("__VER__",VER)
open(f"{OUT}/sw.js","w").write(sw)
if not os.path.exists(f"{OUT}/config.js"):
    shutil.copy(f"{A}/static/config.js",f"{OUT}/config.js")
cfg=open(f"{OUT}/config.js").read()
cfg=re.sub(r'version:"[^"]*"',f'version:"{VER}"',cfg); open(f"{OUT}/config.js","w").write(cfg)
os.makedirs(f"{OUT}/icons",exist_ok=True)
for f in os.listdir(f"{A}/static/icons"): shutil.copy(f"{A}/static/icons/{f}",f"{OUT}/icons/{f}")
print("ok",len(app),len(head))
