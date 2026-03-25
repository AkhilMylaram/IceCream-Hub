$DOCKER_USERNAME = "akhilmylaram"
$TAG = "latest"

$services = @(
    @{ Name="auth-service"; ImageName="icecream-auth"; Port=8081 },
    @{ Name="product-service"; ImageName="icecream-product"; Port=8082 },
    @{ Name="order-service"; ImageName="icecream-order"; Port=8083 },
    @{ Name="cart-service"; ImageName="icecream-cart"; Port=8084 },
    @{ Name="recommendation-service"; ImageName="icecream-recommendation"; Port=8085 },
    @{ Name="api-gateway"; ImageName="icecream-gateway"; Port=8080 }
)

Write-Host "=============================================" -ForegroundColor Cyan
Write-Host " MNC-Grade Local Helm Deployment " -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "Target Registry: $DOCKER_USERNAME" -ForegroundColor Cyan
Write-Host "Target Tag: $TAG" -ForegroundColor Cyan
Write-Host ""

foreach ($svc in $services) {
    $releaseName = $svc.Name
    $imageRepo = "$DOCKER_USERNAME/$($svc.ImageName)"
    $port = $svc.Port

    Write-Host "-------------------------------------------"
    Write-Host "Deploying $releaseName via Helm..." -ForegroundColor Yellow
    Write-Host "Image: $($imageRepo):$TAG" -ForegroundColor Yellow
    Write-Host "-------------------------------------------"

    # Using the universal Helm Chart we created earlier
    helm upgrade --install $releaseName ./helm/microservice `
        --namespace default `
        --set image.repository=$imageRepo `
        --set image.tag=$TAG `
        --set service.port=$port
        
    if ($LASTEXITCODE -eq 0) {
        Write-Host "SUCCESS: $releaseName deployed and updated." -ForegroundColor Green
    } else {
        Write-Host "ERROR: $releaseName failed to deploy via Helm." -ForegroundColor Red
    }
    Write-Host ""
}

Write-Host "=============================================" -ForegroundColor Cyan
Write-Host " All Microservices Helm Charts Updated Locally! " -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Cyan
