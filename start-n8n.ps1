$env:PATH = "C:\Program Files\nodejs;$env:PATH"
$env:NODE_OPTIONS = "--max-old-space-size=4096"

Write-Host "Starting n8n with npm in PATH..." -ForegroundColor Green
Write-Host "npm location: $(where.exe npm)" -ForegroundColor Cyan

n8n start
