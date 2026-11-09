param([Parameter(Mandatory=$true)][string]$GameDirectory,[Parameter(Mandatory=$true)][string]$Keystore)
$ErrorActionPreference='Stop'
[Console]::OutputEncoding=[Text.UTF8Encoding]::new()
$env:NONAME_DIR=(Resolve-Path -LiteralPath $GameDirectory).Path
$env:NONAME_KEYSTORE=(Resolve-Path -LiteralPath $Keystore).Path
if(-not $env:NONAME_KEY_PASSWORD){throw 'Set NONAME_KEY_PASSWORD before building.'}
$projectRoot=Split-Path -Parent $PSScriptRoot
& python (Join-Path $PSScriptRoot 'apply.py') $env:NONAME_DIR
if($LASTEXITCODE -ne 0){exit $LASTEXITCODE}
Push-Location (Join-Path $projectRoot 'android')
try { & .\gradlew.bat assembleRelease --console=plain; if($LASTEXITCODE -ne 0){exit $LASTEXITCODE} } finally { Pop-Location }
