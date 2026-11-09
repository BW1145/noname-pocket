param([Parameter(Mandatory=$true)][string]$GameDirectory,[Parameter(Mandatory=$true)][string]$Keystore)
$ErrorActionPreference='Stop'
[Console]::OutputEncoding=[Text.UTF8Encoding]::new()
$OutputEncoding=[Text.UTF8Encoding]::new()
if(-not $env:NONAME_KEY_PASSWORD){throw 'Set NONAME_KEY_PASSWORD before building.'}
$projectRoot=Split-Path -Parent $PSScriptRoot
$game=(Resolve-Path -LiteralPath $GameDirectory).Path
$key=(Resolve-Path -LiteralPath $Keystore).Path
$work=Join-Path $projectRoot '.work'
New-Item -ItemType Directory -Force -Path $work | Out-Null
$client=Join-Path $work ([Guid]::NewGuid().ToString('N'))
& git clone --depth 1 --recurse-submodules --shallow-submodules https://github.com/nonameShijian/noname-shijian-android.git $client
if($LASTEXITCODE -ne 0){exit $LASTEXITCODE}
& git -C $client checkout 19a50d10b5791ca9d9b9aeaac6ba40a3ff552fc8
& python (Join-Path $PSScriptRoot 'apply.py') $game
& python (Join-Path $PSScriptRoot 'prepare_android.py') $client $game
if($LASTEXITCODE -ne 0){exit $LASTEXITCODE}
$buildConfig=Join-Path $client 'build.json'
@{android=@{release=@{keystore=$key;storePassword=$env:NONAME_KEY_PASSWORD;password=$env:NONAME_KEY_PASSWORD;alias='noname-pocket';keystoreType='jks';packageType='apk'}}} | ConvertTo-Json -Depth 4 | Set-Content -LiteralPath $buildConfig -Encoding UTF8
Push-Location $client
try {
 & npm.cmd ci
 if($LASTEXITCODE -ne 0){exit $LASTEXITCODE}
 & npx.cmd --yes cordova@12.0.0 platform add android@14.0.0 --nosave
 if($LASTEXITCODE -ne 0){exit $LASTEXITCODE}
 & python (Join-Path $PSScriptRoot 'configure_android.py') $client
 if($LASTEXITCODE -ne 0){exit $LASTEXITCODE}
 & npx.cmd --yes cordova@12.0.0 compile android --release "--buildConfig=$buildConfig" -- --packageType=apk
 if($LASTEXITCODE -ne 0){exit $LASTEXITCODE}
 $dist=Join-Path $projectRoot 'dist'
 New-Item -ItemType Directory -Force -Path $dist | Out-Null
 Copy-Item -LiteralPath (Join-Path $client 'platforms/android/app/build/outputs/apk/release/app-release.apk') -Destination (Join-Path $dist 'Noname-Pocket-0.1.1.apk')
} finally { Pop-Location; Remove-Item -LiteralPath $buildConfig -ErrorAction SilentlyContinue }
