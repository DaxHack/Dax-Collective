param(
  [string]$InputPackage = "artifacts/anidax/sprint-1-sample/generated/content-package.json",
  [string]$OutputFile = "artifacts/anidax/sprint-1-sample/audio/draft-review-narration.wav",
  [string]$Voice = "Microsoft David Desktop",
  [int]$Rate = 0,
  [switch]$SegmentTimings
)

$ErrorActionPreference = "Stop"

if (-not (Test-Path -LiteralPath $InputPackage -PathType Leaf)) {
  throw "Input package not found: $InputPackage"
}

$package = Get-Content -LiteralPath $InputPackage -Raw | ConvertFrom-Json
if (-not $package.scriptSegments) {
  throw "Input package does not contain scriptSegments: $InputPackage"
}

$scriptText = ($package.scriptSegments | ForEach-Object { $_.text }) -join " "
$outputDir = Split-Path -Parent $OutputFile
if ($outputDir) {
  New-Item -ItemType Directory -Force -Path $outputDir | Out-Null
}

$fullOutputFile = [System.IO.Path]::GetFullPath((Join-Path (Get-Location) $OutputFile))

$speaker = New-Object -ComObject SAPI.SpVoice
$voices = @($speaker.GetVoices())
$selectedVoice = $voices | Where-Object { $_.GetDescription() -like "*$Voice*" } | Select-Object -First 1
if (-not $selectedVoice -and $voices.Count -gt 0) {
  $selectedVoice = $voices[0]
}
if (-not $selectedVoice) {
  throw "No local Windows SAPI voices are installed."
}

$Voice = $selectedVoice.GetDescription()
$speaker.Voice = $selectedVoice
$speaker.Rate = $Rate

$timedSegments = @()
if ($SegmentTimings) {
  $segmentDir = Join-Path (Split-Path -Parent $fullOutputFile) 'segments'
  New-Item -ItemType Directory -Force -Path $segmentDir | Out-Null
  $concatLines = @()
  $offset = 0.0
  $index = 0
  foreach ($segment in $package.scriptSegments) {
    $name = "segment-$index.wav"
    $segmentFile = Join-Path $segmentDir $name
    $stream = New-Object -ComObject SAPI.SpFileStream
    $stream.Open($segmentFile, 3, $false)
    try {
      $speaker.AudioOutputStream = $stream
      $speaker.Speak([string]$segment.text) | Out-Null
    } finally { $stream.Close() }
    $durationText = & ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 $segmentFile
    if ($LASTEXITCODE -ne 0) { throw 'Segment duration probe failed' }
    $duration = [double]::Parse($durationText, [System.Globalization.CultureInfo]::InvariantCulture)
    if ($duration -le 0) { throw 'Empty narration segment' }
    $timedSegments += [ordered]@{ text = $segment.text; start = [math]::Round($offset, 3); end = [math]::Round(($offset + $duration), 3) }
    $offset += $duration
    $concatLines += "file '$name'"
    $index++
  }
  $concatPath = Join-Path $segmentDir 'concat.txt'
  [System.IO.File]::WriteAllLines($concatPath, $concatLines, (New-Object System.Text.UTF8Encoding($false)))
  & ffmpeg -v error -y -f concat -safe 1 -i $concatPath -c:a pcm_s16le $fullOutputFile
  if ($LASTEXITCODE -ne 0) { throw 'Narration concatenation failed' }
} else {
  $stream = New-Object -ComObject SAPI.SpFileStream
  $stream.Open($fullOutputFile, 3, $false)
  try {
    $speaker.AudioOutputStream = $stream
    $speaker.Speak($scriptText) | Out-Null
  } finally { $stream.Close() }
}

$reportPath = Join-Path (Split-Path -Parent $OutputFile) "draft-narration-report.json"
$report = [ordered]@{
  generatedAt = (Get-Date).ToUniversalTime().ToString("o")
  sourcePackage = $InputPackage
  outputFile = $OutputFile
  voice = $Voice
  rate = $Rate
  approvedForPublishing = $false
  status = "DRAFT_REVIEW_AUDIO_NEEDS_DANIEL_APPROVAL"
  costUsd = 0
  segmentTimings = $timedSegments
  audioSha256 = (Get-FileHash -LiteralPath $fullOutputFile -Algorithm SHA256).Hash.ToLowerInvariant()
}

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText((Join-Path (Get-Location) $reportPath), ($report | ConvertTo-Json -Depth 5), $utf8NoBom)

[pscustomobject]@{
  ok = $true
  outputFile = $OutputFile
  report = $reportPath
  voice = $Voice
  approvedForPublishing = $false
} | ConvertTo-Json
