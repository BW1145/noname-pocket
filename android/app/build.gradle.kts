plugins { id("com.android.application") }
android {
 namespace="app.noname.pocket"; compileSdk=35
 defaultConfig { applicationId="app.noname.pocket"; minSdk=26; targetSdk=35; versionCode=1; versionName="0.1.0" }
 val gameDir=providers.gradleProperty("nonameDir").orElse(providers.environmentVariable("NONAME_DIR"))
 sourceSets["main"].assets.srcDir(gameDir)
 sourceSets["main"].assets.exclude(".git/**",".github/**","node_modules/**","docs/**","DEMO-*.jpg","*.apk","*.zip")
 signingConfigs { create("releaseLocal") { storeFile=file(providers.environmentVariable("NONAME_KEYSTORE").get()); storePassword=providers.environmentVariable("NONAME_KEY_PASSWORD").get(); keyAlias="noname-pocket"; keyPassword=storePassword } }
 buildTypes { getByName("release") { signingConfig=signingConfigs.getByName("releaseLocal"); isMinifyEnabled=false } }
 compileOptions { sourceCompatibility=JavaVersion.VERSION_17; targetCompatibility=JavaVersion.VERSION_17 }
}
dependencies { implementation("androidx.webkit:webkit:1.12.1") }
