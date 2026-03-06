# IceCream Hub — Service Health Check Script
# Health checks for all services

$ErrorActionPreference = "Continue"

$services = @(
    @{ Name="auth-service";             Url="http://localhost:8081/actuator/health" },
    @{ Name="product-service";          Url="http://localhost:8082/actuator/health" },
    @{ Name="order-service";            Url="http://localhost:8083/actuator/health" },
    @{ Name="cart-service (FastAPI)";   Url="http://localhost:8084/docs" },
    @{ Name="recommendation-service";   Url="http://localhost:8085/docs" },
    @{ Name="frontend (Next.js)";       Url="http://localhost:3000" }
)

Write-Host ""
Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host "  ICECREAM HUB - SERVICE HEALTH CHECK" -ForegroundColor Cyan
Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host ""

$allHealthy = $true

foreach ($svc in $services) {
    try {
        $response = Invoke-WebRequest -Uri $svc.Url -UseBasicParsing -TimeoutSec 8
        if ($response.StatusCode -ge 200 -and $response.StatusCode -lt 400) {
            if ($svc.Url -match "actuator/health") {
                $health = $response.Content | ConvertFrom-Json
                if ($health.status -eq "UP") {
                    Write-Host "  [UP]   $($svc.Name)  ($($svc.Url))  status=UP" -ForegroundColor Green
                } else {
                    Write-Host "  [WARN] $($svc.Name)  ($($svc.Url))  status=$($health.status)" -ForegroundColor Yellow
                    $allHealthy = $false
                }
            } else {
                Write-Host "  [UP]   $($svc.Name)  ($($svc.Url))  HTTP $($response.StatusCode)" -ForegroundColor Green
            }
        } else {
            Write-Host "  [FAIL] $($svc.Name)  ($($svc.Url))  HTTP $($response.StatusCode)" -ForegroundColor Red
            $allHealthy = $false
        }
    } catch {
        Write-Host "  [DOWN] $($svc.Name)  ($($svc.Url))  - $($_.Exception.Message)" -ForegroundColor Red
        $allHealthy = $false
    }
}

Write-Host ""
Write-Host "=======================================================" -ForegroundColor Cyan
if ($allHealthy) {
    Write-Host "  ALL SERVICES HEALTHY" -ForegroundColor Green
} else {
    Write-Host "  SOME SERVICES ARE DOWN" -ForegroundColor Red
}
Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host ""
