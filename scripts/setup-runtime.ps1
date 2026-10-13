$ErrorActionPreference = 'Stop'
$projectDirectory = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$toolsDirectory = Join-Path $projectDirectory '.tools'
$version = '26.11.1'
$architecture = if ([Runtime.InteropServices.RuntimeInformation]::OSArchitecture -eq 'Arm64') { 'arm64' } else { 'x64' }
$distribution = "node-v$version-win-$architecture"
$archiveName = "$distribution.zip"
$archivePath = Join-Path $toolsDirectory $archiveName
$executable = Join-Path $toolsDirectory "$distribution/node.exe"
if (Test-Path -LiteralPath $executable) {
  & $executable --version
  exit $LASTEXITCODE
}
New-Item -ItemType Directory -Path $toolsDirectory -Force | Out-Null
$baseUrl = "https://nodejs.org/dist/v$version"
$checksums = (Invoke-WebRequest -Uri "$baseUrl/SHASUMS256.txt" -UseBasicParsing).Content
$checksumLine = ($checksums -split "`n" | Where-Object { $_.Trim().EndsWith("  $archiveName") })
if (-not $checksumLine) { throw 'Official Node.js checksum not found.' }
$expectedHash = ($checksumLine.Trim() -split '\s+')[0]
Invoke-WebRequest -Uri "$baseUrl/$archiveName" -OutFile $archivePath -UseBasicParsing
$actualHash = (Get-FileHash -LiteralPath $archivePath -Algorithm SHA256).Hash
if ($actualHash -ne $expectedHash) { throw 'Node.js archive checksum mismatch.' }
Expand-Archive -LiteralPath $archivePath -DestinationPath $toolsDirectory -Force
Remove-Item -LiteralPath $archivePath
& $executable --version
if ($LASTEXITCODE -ne 0) { throw 'Node.js runtime validation failed.' }
Write-Output 'Project runtime ready. npm run dev uses this version automatically.'
