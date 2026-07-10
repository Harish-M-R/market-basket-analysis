# Auto-upload monitor for HDFS
$uploadsFolder = "C:\Users\Harish\OneDrive\Desktop\Big Boys\hadoop-mba-webapp\uploads"

Write-Host "Monitoring uploads folder for new files..." -ForegroundColor Yellow
Write-Host "Press Ctrl+C to stop" -ForegroundColor Gray

$lastCheck = Get-Date

while ($true) {
    $newFiles = Get-ChildItem "$uploadsFolder\*transactions.*" | Where-Object { $_.LastWriteTime -gt $lastCheck }
    
    foreach ($file in $newFiles) {
        Write-Host "`nNew file detected: $($file.Name)" -ForegroundColor Cyan
        Write-Host "Uploading to HDFS..." -ForegroundColor Yellow
        
        hdfs dfs -put -f $file.FullName "/mba/input/$($file.Name)"
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✓ Uploaded successfully!" -ForegroundColor Green
        } else {
            Write-Host "✗ Upload failed!" -ForegroundColor Red
        }
    }
    
    $lastCheck = Get-Date
    Start-Sleep -Seconds 2
}
