$DOCKER_USERNAME = "akhilmylaram"
$VERSION = "latest"

Write-Host "=============================================" -ForegroundColor Cyan
Write-Host " MNC-Grade Production Docker Image Build & Push" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Checking Docker Login status..."

# Attempt to fetch username. If it fails or is empty, the user might not be logged in.
$dockerInfo = docker info 2>$null | Select-String "Username"
if (-not $dockerInfo) {
    Write-Host ""
    Write-Host "WARNING: You do not appear to be logged in to Docker Hub." -ForegroundColor Yellow
    Write-Host "Please authenticate before proceeding." -ForegroundColor Yellow
    Write-Host "Running: docker login" -ForegroundColor Yellow
    docker login
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Docker login failed. Exiting script." -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "You are logged in: $($dockerInfo.Line.Trim())" -ForegroundColor Green
}

$apps = @(
    @{ Name="auth-service"; ImageName="icecream-auth" },
    @{ Name="product-service"; ImageName="icecream-product" },
    @{ Name="order-service"; ImageName="icecream-order" },
    @{ Name="cart-service"; ImageName="icecream-cart" },
    @{ Name="recommendation-service"; ImageName="icecream-recommendation" },
    @{ Name="api-gateway"; ImageName="icecream-gateway" },
    @{ Name="frontend"; ImageName="icecream-frontend" },
    @{ Name="nginx"; ImageName="icecream-nginx" }
)

Write-Host ""
Write-Host "Starting build and push process for $($apps.Count) microservices..." -ForegroundColor Cyan
Write-Host "Target Registry: $DOCKER_USERNAME" -ForegroundColor Cyan
Write-Host ""

foreach ($app in $apps) {
    $dir = $app.Name
    $imageTag = "$DOCKER_USERNAME/$($app.ImageName):$VERSION"
    
    Write-Host "-------------------------------------------"
    Write-Host "-> Service: $dir" -ForegroundColor Cyan
    Write-Host "-------------------------------------------"
    Write-Host "[1/2] Building image $imageTag..." -ForegroundColor Yellow
    docker build -t $imageTag ./$dir
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: Failed to build $imageTag" -ForegroundColor Red
        exit 1
    }

    Write-Host "[2/2] Pushing image $imageTag to Docker Hub..." -ForegroundColor Yellow
    docker push $imageTag
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: Failed to push $imageTag. Are you sure you have push access to $DOCKER_USERNAME?" -ForegroundColor Red
        exit 1
    }
    
    Write-Host "SUCCESS: $imageTag pushed successfully." -ForegroundColor Green
    Write-Host ""
}

Write-Host "=============================================" -ForegroundColor Cyan
Write-Host " All images have been built and pushed! " -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Cyan
