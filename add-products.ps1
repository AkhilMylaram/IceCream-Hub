$gatewayUrl = "http://localhost:8080/api/products"

# 1. Ensure Category exists
Write-Host "Checking categories..." -ForegroundColor Cyan
$categories = Invoke-RestMethod -Uri "$gatewayUrl/categories" -Method GET
$premiumCat = $categories | Where-Object { $_.name -eq "Premium" }

if (!$premiumCat) {
    Write-Host "Creating 'Premium' category..." -ForegroundColor Yellow
    $catJson = @{ name = "Premium"; description = "Our most luxurious and stunning ice cream flavors." } | ConvertTo-Json
    $premiumCat = Invoke-RestMethod -Uri "$gatewayUrl/categories" -Method POST -Body $catJson -ContentType "application/json"
}

$catId = $premiumCat.id
Write-Host "Using Category ID: $catId" -ForegroundColor DarkGray

# 2. Add Products
$products = @(
    @{ name = "Salted Caramel Glow"; description = "Rich caramel with sea salt crystals."; price = 5.99; categoryId = $catId; imageUrl = "/images/salted_caramel.png" },
    @{ name = "Midnight Brownie"; description = "Dark chocolate with chewy brownie pieces."; price = 6.49; categoryId = $catId; imageUrl = "/images/midnight_chocolate.png" },
    @{ name = "Pistachio Dream"; description = "Premium roasted pistachios in creamy base."; price = 6.99; categoryId = $catId; imageUrl = "/images/pistachio.png" },
    @{ name = "Strawberry Velvet"; description = "Fresh strawberries with velvet cake chunks."; price = 5.49; categoryId = $catId; imageUrl = "/images/strawberry_shortcake.png" },
    @{ name = "Espresso Gold"; description = "Double-shot espresso infused cream."; price = 5.99; categoryId = $catId; imageUrl = "/images/espresso.png" },
    @{ name = "Coconut Bliss"; description = "Tropical coconut milk and shredded coconut."; price = 5.49; categoryId = $catId; imageUrl = "/images/coconut.png" },
    @{ name = "Oreo Chunk"; description = "Classic cookies and cream with extra chunks."; price = 5.99; categoryId = $catId; imageUrl = "/images/cookies_cream.png" },
    @{ name = "Mango Tango"; description = "Zesty alfonso mango sorbet."; price = 4.99; categoryId = $catId; imageUrl = "/images/mango.png" },
    @{ name = "Cool Mint Flake"; description = "Refreshing mint with dark chocolate curls."; price = 5.49; categoryId = $catId; imageUrl = "/images/mint.png" },
    @{ name = "Honey Lavender"; description = "Artisanal honey with organic lavender notes."; price = 6.49; categoryId = $catId; imageUrl = "/images/honey_lavender.png" }
)

Write-Host "Registering 10 new premium products..." -ForegroundColor Cyan

foreach ($p in $products) {
    $json = $p | ConvertTo-Json
    try {
        $resp = Invoke-RestMethod -Uri $gatewayUrl -Method POST -Body $json -ContentType "application/json"
        Write-Host "Success: Added $($p.name)" -ForegroundColor Green
    } catch {
        Write-Host "Failed: $($p.name) - $($_.Exception.Message)" -ForegroundColor Red
    }
}
