$ErrorActionPreference = 'Stop'
Set-Location -LiteralPath $PSScriptRoot
$tofuNode = (Get-Command node -ErrorAction Stop).Source
& $tofuNode (Join-Path $PSScriptRoot 'online-launcher.cjs') stop
exit $LASTEXITCODE
