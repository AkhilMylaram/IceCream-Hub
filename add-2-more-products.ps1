$gatewayUrl = "http://localhost:8080/api/products"

# 1. Get Category ID (Premium)
$categories = Invoke-RestMethod -Uri "$gatewayUrl/categories" -Method GET
$premiumCat = $categories | Where-Object { $_.name -eq "Premium" }
$catId = $premiumCat.id

# 2. Add 2 More Products
$products = @(
    @{ name = "Vanilla Silk"; description = "Pure Madagascar vanilla bean infusion."; price = 6.99; categoryId = $catId; imageUrl = "/images/salted_caramel.png" },
    @{ name = "Berry Bliss"; description = "Wild summer berries in a creamy swirl."; price = 5.99; categoryId = $catId; imageUrl = "/images/strawberry_shortcake.png" }
)

Write-Host "Registering 2 additional luxury products..." -ForegroundColor Cyan

foreach ($p in $products) {
    $json = $p | ConvertTo-Json
    try {
        $resp = Invoke-RestMethod -Uri $gatewayUrl -Method POST -Body $json -ContentType "application/json"
        Write-Host "Success: Added $($p.name)" -ForegroundColor Green
    } catch {
        Write-Host "Failed: $($p.name) - $($_.Exception.Message)" -ForegroundColor Red
    }
}
