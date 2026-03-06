$uniqueEmail = "auto_reg_" + (Get-Random) + "@icecream.test"
$password = "AutoReg123!"

Write-Host "Testing auto-registration with new email: $uniqueEmail" -ForegroundColor Yellow

$loginBody = @{
    email = $uniqueEmail
    password = $password
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
    
    if ($response.token -ne $null -and $response.userId -gt 0) {
        Write-Host "[PASS] Successfully logged in and auto-registered new user" -ForegroundColor Green
        Write-Host "       userId: $($response.userId)" -ForegroundColor DarkGray
        Write-Host "       username: $($response.username)" -ForegroundColor DarkGray
    } else {
        Write-Host "[FAIL] Response missing token or userId" -ForegroundColor Red
    }
} catch {
    Write-Host "[FAIL] Login/Auto-Registration failed: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.ErrorDetails) {
        Write-Host "       Details: $($_.ErrorDetails.Message)" -ForegroundColor DarkGray
    }
}
