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

Write-Host "Building and pushing all microservices to Docker Hub (namespace: akhilmylaram)..."

foreach ($app in $apps) {
    $dir = $app.Name
    $tag = "akhilmylaram/$($app.ImageName):latest"

    Write-Host ">>> Building $tag from $dir..." -ForegroundColor Cyan
    docker build -t $tag ./$dir

    Write-Host ">>> Pushing $tag..." -ForegroundColor Yellow
    docker push $tag
}

Write-Host "All done!" -ForegroundColor Green
