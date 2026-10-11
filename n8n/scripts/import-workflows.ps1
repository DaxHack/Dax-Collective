# import-workflows.ps1
param(
  [string]$n8nUrl = "http://localhost:5678",
  [string]$apiKey = "YOUR_N8N_API_KEY"  # if you have one
)

# Loop through each JSON template
Get-ChildItem -Path "../templates" -Filter *.json | ForEach-Object {
  $json = Get-Content $_.FullName -Raw
  Write-Host "Importing workflow $($_.Name)..."
  Invoke-RestMethod `
    -Method Post `
    -Uri "$n8nUrl/rest/workflows/import" `
    -Header @{ "Authorization" = "Bearer $apiKey" } `
    -Body @{ "source" = "json"; "workflow" = $json } `
    -ContentType "application/json"
}
Write-Host "All workflows imported."