$apps = @(
    @{ Name="services/auth-service"; ImageName="icecream-auth" },
    @{ Name="services/product-service"; ImageName="icecream-product" },
    @{ Name="services/order-service"; ImageName="icecream-order" },
    @{ Name="services/cart-service"; ImageName="icecream-cart" },
    @{ Name="services/recommendation-service"; ImageName="icecream-recommendation" },
    @{ Name="services/api-gateway"; ImageName="icecream-gateway" },
    @{ Name="frontend"; ImageName="icecream-frontend" },
    @{ Name="infrastructure/docker/nginx"; ImageName="icecream-nginx" },
    @{ Name="infrastructure/docker/kafka"; ImageName="icecream-kafka" }
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
