# start_n8n.ps1
Write-Host "🔁 Starting your Royal n8n Instance..." -ForegroundColor Cyan

docker start n8n_royal_instance

Start-Sleep -Seconds 2

docker ps --filter "name=n8n_royal_instance"

Start-Process "http://localhost:5678"

Write-Host "🎯 Your n8n empire is now live at http://localhost:5678" -ForegroundColor Green

#run this to start: .\start_n8n.ps1
#run this if theres trouble starting: Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
