$ErrorActionPreference = 'Stop'
Set-Location -LiteralPath $PSScriptRoot
$tofuNode = (Get-Command node -ErrorAction Stop).Source
if (-not (Test-Path -LiteralPath (Join-Path $PSScriptRoot '.tools/cloudflared.exe'))) { throw 'Missing .tools/cloudflared.exe. See ONLINE.md.' }
if (-not (Test-Path -LiteralPath (Join-Path $PSScriptRoot 'node_modules/ws'))) { & npm ci; if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE } }
& $tofuNode (Join-Path $PSScriptRoot 'online-launcher.cjs') start
exit $LASTEXITCODE
