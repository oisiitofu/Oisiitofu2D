$ErrorActionPreference = 'Stop'
Set-Location -LiteralPath $PSScriptRoot
$tofuExe = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '.tools/cloudflared.exe'))
if (-not (Test-Path -LiteralPath $tofuExe)) { throw 'cloudflared.exe がありません。ONLINE.md の起動手順を確認してください。' }
try { Invoke-WebRequest 'http://127.0.0.1:4173/health' -UseBasicParsing -TimeoutSec 2 | Out-Null } catch {
    Start-Process -FilePath 'node' -ArgumentList 'server.cjs' -WorkingDirectory $PSScriptRoot -WindowStyle Hidden
    Start-Sleep -Seconds 2
}
$tofuRunning = $null
if (Test-Path -LiteralPath '.tools/tunnel.pid') {
    $tofuSavedId = [int](Get-Content -LiteralPath '.tools/tunnel.pid')
    $tofuRunning = Get-Process -Id $tofuSavedId -ErrorAction SilentlyContinue
    if ($tofuRunning -and $tofuRunning.Path -ne $tofuExe) { $tofuRunning = $null }
}
if (-not $tofuRunning) {
    $tofuRunning = Start-Process -FilePath $tofuExe -ArgumentList @('tunnel','--no-autoupdate','--url','http://127.0.0.1:4173','--protocol','http2') -WindowStyle Hidden -RedirectStandardOutput '.tools/tunnel-out.log' -RedirectStandardError '.tools/tunnel.log' -PassThru
    $tofuRunning.Id | Set-Content -LiteralPath '.tools/tunnel.pid'
}
for ($tofuAttempt = 0; $tofuAttempt -lt 30; $tofuAttempt++) {
    if ($tofuRunning.HasExited) { throw '公開プロセスが終了しました。.tools/tunnel.log を確認してください。' }
    $tofuLog = Get-Content -LiteralPath '.tools/tunnel.log' -Raw -ErrorAction SilentlyContinue
    $tofuUrl = [regex]::Match("$tofuLog", 'https://[a-z0-9-]+\.trycloudflare\.com').Value
    if ($tofuUrl) {
        $tofuUrl | Set-Content -LiteralPath '.tools/public-url.txt'
        Write-Output "オンライン試用URL: $tofuUrl"
        Write-Output '両者がこのURLを開き、オンライン対戦からルームを作成・参加してください。'
        Write-Output 'PCとサーバーを動かしている間だけ有効です。終了: ./stop-online.ps1'
        exit 0
    }
    Start-Sleep -Seconds 1
}
throw 'URLを取得できませんでした。.tools/tunnel.log を確認してください。'
