$ErrorActionPreference = 'Stop'
$tofuPidFile = Join-Path $PSScriptRoot '.tools/tunnel.pid'
$tofuExe = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '.tools/cloudflared.exe'))
if (Test-Path -LiteralPath $tofuPidFile) {
    $tofuSavedId = [int](Get-Content -LiteralPath $tofuPidFile)
    $tofuProcess = Get-Process -Id $tofuSavedId -ErrorAction SilentlyContinue
    if ($tofuProcess -and $tofuProcess.Path -eq $tofuExe) { Stop-Process -Id $tofuSavedId }
}
Write-Output 'オンライン試用URLの公開を停止しました。ローカルゲームは引き続き使用できます。'
