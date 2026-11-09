"""Apply the upstream client's documented Android project setup."""
from pathlib import Path
import argparse,re
p=argparse.ArgumentParser();p.add_argument('client',type=Path);a=p.parse_args();project=a.client/'platforms/android'
f=project/'settings.gradle';s=f.read_text();s+='\ninclude ":NonameCore"\ninclude ":MTDataFiles"\n';f.write_text(s)
repos='''ext.repos = {
 google()
 mavenCentral()
 maven { url 'https://jitpack.io' }
 maven { url 'https://maven.aliyun.com/repository/public/' }
}
'''
for rel in ['repositories.gradle','app/repositories.gradle']:(project/rel).write_text(repos)
f=project/'app/build-extras.gradle';f.write_text('''android {
    aaptOptions { noCompress 'apk', 'zip' }
}
dependencies {
    implementation 'androidx.constraintlayout:constraintlayout:1.1.3'
    implementation fileTree(dir: 'src/main/libs', include: '*.jar')
    implementation 'com.alibaba:fastjson:1.1.55.android'
    implementation 'androidx.palette:palette:1.0.0'
    implementation 'org.java-websocket:Java-WebSocket:1.5.6'
    implementation project(':NonameCore')
    implementation project(':MTDataFiles')
}
''')
for f in project.glob('cordova-plugin-local-notification/**/*.gradle'):
 s=f.read_text();f.write_text(re.sub(r'\bcompile\s+', 'implementation ',s))
# Keep the client's splash resources compatible with Android 15's edge-to-edge default.
f=project/'app/src/main/res/values/themes.xml';s=f.read_text()
if 'android:windowOptOutEdgeToEdgeEnforcement' not in s:
 s=s.replace('</style>','<item name="android:windowOptOutEdgeToEdgeEnforcement">true</item></style>',1)
f.write_text(s)
# Keep the native importer registered even if platform generation changes its ordering.
f=project/'app/src/main/res/xml/config.xml';s=f.read_text()
if 'app.noname.pocket.FinishImport' not in s:s=s.replace('</widget>','<feature name="FinishImport"><param name="android-package" value="app.noname.pocket.FinishImport" /></feature></widget>')
f.write_text(s)
# Check the concrete runtime wiring that failed in 0.1.0.
assert 'cordova-plugin-file' in (a.client/'package.json').read_text()
assert 'cordova-plugin-file-transfer' in (a.client/'package.json').read_text()
assert 'org.apache.cordova.file.FileUtils' in s
assert 'org.apache.cordova.filetransfer.FileTransfer' in s
assert (project/'NonameCore/src/main/java/com/noname/core/activities/WebViewUpgradeCordovaActivity.java').is_file()
print('Original native file plugins, importer and Cordova activity wired.')
