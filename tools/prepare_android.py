"""Adapt the pinned upstream Android client and embed the complete customized game."""
from pathlib import Path
import argparse,json,re,shutil,zipfile
p=argparse.ArgumentParser();p.add_argument('client',type=Path);p.add_argument('game',type=Path);a=p.parse_args();client=a.client
old='com.noname.shijian';new='app.noname.pocket'
# Keep native classes, permissions, file-system plugins, and initialization supplied by the client.
for f in (client/'java').rglob('*.java'):
 s=f.read_text(encoding='utf-8');f.write_text(s.replace(old,new),encoding='utf-8')
source=client/'java/com/noname/shijian';dest=client/'java/app/noname/pocket';dest.parent.mkdir(parents=True,exist_ok=True);shutil.move(str(source),str(dest))
config=client/'config.xml';s=config.read_text(encoding='utf-8').replace(old,new).replace('version="1.6.8"','version="0.1.1"').replace('<widget id=', '<widget android-versionCode="16009" id=',1).replace('<name>无名杀</name>','<name>无名杀·随身版</name>').replace('value="16008"','value="16009"').replace('name="hostname" value="localhost"','name="hostname" value="appassets.androidplatform.net"')
s=s.replace('<preference name="Fullscreen" value="true" />','<preference name="Fullscreen" value="true" />\n    <preference name="android-minSdkVersion" value="26" />',1)
config.write_text(s,encoding='utf-8')
# The original Windows hook uses case-insensitive CordovaLib paths.
f=client/'hooks/after_platform_add/copy_files.js';s=f.read_text(encoding='utf-8').replace("'./cordovaLib'", "'./CordovaLib'").replace("'cordovaLib'", "'CordovaLib'");f.write_text(s,encoding='utf-8')
pkg=client/'package.json';data=json.loads(pkg.read_text());data['name']=new;data['displayName']='无名杀·随身版';data['version']='0.1.1';pkg.write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
# Platform generation copies native source into the new namespace.
f=dest/'FinishImport.java';s=f.read_text(encoding='utf-8');start=s.index('            String[] v = info.versionName.split');end=s.index('            return version;',start)+len('            return version;');s=s[:start]+'''            NonameImportActivity.VERSION = info.versionCode;
            return info.versionCode;'''+s[end:];f.write_text(s,encoding='utf-8')
f=dest/'MainActivity.java';s=f.read_text(encoding='utf-8');needle='        super.initWebViewSettings(webview, settings);';assert needle in s
s=s.replace(needle,needle+'''
        settings.setTextZoom(100);
        settings.setUseWideViewPort(true);
        settings.setLoadWithOverviewMode(true);
        webview.post(() -> {
            View frame = (View) webview.getParent();
            androidx.core.view.ViewCompat.setOnApplyWindowInsetsListener(frame, (v, insets) -> {
                androidx.core.graphics.Insets safe = insets.getInsets(androidx.core.view.WindowInsetsCompat.Type.systemBars() | androidx.core.view.WindowInsetsCompat.Type.displayCutout());
                v.setPadding(safe.left, safe.top, safe.right, safe.bottom);
                return insets;
            });
            androidx.core.view.ViewCompat.requestApplyInsets(frame);
        });''');f.write_text(s,encoding='utf-8')
# Reuse the client's resource importer, with a versioned complete game zip.
f=client/'www/app/index.js';s=f.read_text(encoding='utf-8');s=s.replace('"use strict";','"use strict";\nif (localStorage.getItem("noname_inited") === "nodejs") localStorage.removeItem("noname_inited");',1);f.write_text(s,encoding='utf-8')
f=client/'www/index.html';s=f.read_text(encoding='utf-8').replace('content="user-scalable=no"','content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover"');s=s.replace('<head>', '<head>\n<script>if(localStorage.getItem("noname_inited")==="nodejs")localStorage.removeItem("noname_inited");</script>',1);f.write_text(s,encoding='utf-8')
archive=client/'www/app/noname.zip'
archive.parent.mkdir(parents=True,exist_ok=True)
with zipfile.ZipFile(archive,'w',compression=zipfile.ZIP_DEFLATED,compresslevel=3) as z:
 for f in a.game.rglob('*'):
  if f.is_file():z.write(f,f.relative_to(a.game).as_posix())
print('Upstream Android client prepared; complete game bytes:',archive.stat().st_size)
