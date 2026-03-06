# IceCream Hub - End-to-End Test Suite
# Usage: powershell -ExecutionPolicy Bypass -File test-e2e.ps1

$ErrorActionPreference = "Continue"
$PASS = 0
$FAIL = 0

function Test-Step {
    param($Name, $Condition, $Details)
    if ($Condition) {
        Write-Host "  [PASS] $Name" -ForegroundColor Green
        $script:PASS++
    } else {
        Write-Host "  [FAIL] $Name  $Details" -ForegroundColor Red
        $script:FAIL++
    }
}

Write-Host ""
Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host "  ICECREAM HUB - END-TO-END TEST SUITE" -ForegroundColor Cyan
Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host ""

# 1. AUTH - Register
Write-Host "[1] AUTH SERVICE - Register" -ForegroundColor Yellow
try {
    $uniqueEmail = "testuser_" + (Get-Random) + "@icecream.test"
    $regBody = '{"name":"Test User","email":"' + $uniqueEmail + '","password":"TestPass123!","address":"123 Scoop St"}'
    $regResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/register" -Method POST -Body $regBody -ContentType "application/json"
    Test-Step "Register new user" ($regResponse.token -ne $null) ""
    Test-Step "Register returns userId" ($regResponse.userId -gt 0) ""
    $TOKEN = $regResponse.token
    $USER_ID = $regResponse.userId
    Write-Host "     userId=$USER_ID" -ForegroundColor DarkGray
} catch {
    Test-Step "Register new user" $false ("Error: " + $_)
    $USER_ID = 1
    $TOKEN = ""
}

# 2. AUTH - Login
Write-Host ""
Write-Host "[2] AUTH SERVICE - Login" -ForegroundColor Yellow
try {
    $loginBody = '{"email":"' + $uniqueEmail + '","password":"TestPass123!"}'
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
    Test-Step "Login returns token" ($loginResponse.token -ne $null) ""
    Test-Step "Login userId matches register" ($loginResponse.userId -eq $USER_ID) ""
} catch {
    Test-Step "Login with registered user" $false ("Error: " + $_)
}

# 3. PRODUCT SERVICE
Write-Host ""
Write-Host "[3] PRODUCT SERVICE - List and Get" -ForegroundColor Yellow
try {
    $products = Invoke-RestMethod -Uri "http://localhost:8080/api/products" -Method GET
    Test-Step "GET /api/products returns data" ($products -ne $null) ""
    Test-Step "At least 1 product exists" ($products.Count -gt 0) ""
    if ($products.Count -gt 0) {
        $PRODUCT_ID = $products[0].id
        $p = Invoke-RestMethod -Uri ("http://localhost:8080/api/products/" + $PRODUCT_ID) -Method GET
        Test-Step "GET /api/products/{id} returns product" ($p.id -eq $PRODUCT_ID) ""
        Test-Step "Product has name and price" ($p.name -ne $null -and $p.price -gt 0) ""
        Write-Host ("     First product: id=" + $PRODUCT_ID + " name=" + $p.name + " price=" + $p.price) -ForegroundColor DarkGray
    } else {
        $PRODUCT_ID = 1
    }
} catch {
    Test-Step "GET /api/products" $false ("Error: " + $_)
    $PRODUCT_ID = 1
}

# 4. CART SERVICE
Write-Host ""
Write-Host "[4] CART SERVICE - Add to Cart and Read" -ForegroundColor Yellow
try {
    $cartItem = '{"product_id":' + $PRODUCT_ID + ',"name":"Test Ice Cream","price":4.99,"quantity":2}'
    $cartResponse = Invoke-RestMethod -Uri ("http://localhost:8080/api/cart/" + $USER_ID + "/items") -Method POST -Body $cartItem -ContentType "application/json"
    Test-Step "POST cart item succeeds" ($cartResponse.items.Count -gt 0) ""
    Test-Step "Cart total_price is calculated" ($cartResponse.total_price -gt 0) ""

    $getCart = Invoke-RestMethod -Uri ("http://localhost:8080/api/cart/" + $USER_ID) -Method GET
    Test-Step "GET /api/cart returns user cart" ($getCart.user_id -eq $USER_ID) ""
    Test-Step "Cart contains the added item" ($getCart.items.Count -gt 0) ""
    Write-Host ("     Cart total: " + $getCart.total_price + "  items: " + $getCart.items.Count) -ForegroundColor DarkGray
} catch {
    Test-Step "Cart operations" $false ("Error: " + $_)
}

# 5. ORDER SERVICE - Create Order (uses Feign to call cart + product)
Write-Host ""
Write-Host "[5] ORDER SERVICE - Create Order via Feign" -ForegroundColor Yellow
try {
    $orderBody = '{"userId":' + $USER_ID + '}'
    $orderResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/orders" -Method POST -Body $orderBody -ContentType "application/json"
    Test-Step "POST /api/orders creates order" ($orderResponse.id -ne $null) ""
    Test-Step "Order status is CREATED" ($orderResponse.status -eq "CREATED") ""
    Test-Step "Order has items" ($orderResponse.items.Count -gt 0) ""
    Test-Step "Order totalAmount greater than 0" ($orderResponse.totalAmount -gt 0) ""
    Write-Host ("     Order id=" + $orderResponse.id + "  total=" + $orderResponse.totalAmount) -ForegroundColor DarkGray

    # Verify cart cleared after order
    $cartAfter = Invoke-RestMethod -Uri ("http://localhost:8080/api/cart/" + $USER_ID) -Method GET
    Test-Step "Cart cleared after order placement" ($cartAfter.items.Count -eq 0) ""
} catch {
    Test-Step "Create order" $false ("Error: " + $_)
}

# 6. RECOMMENDATION SERVICE
Write-Host ""
Write-Host "[6] RECOMMENDATION SERVICE - Popular Items" -ForegroundColor Yellow
try {
    $recs = Invoke-RestMethod -Uri "http://localhost:8080/api/recommendations/popular" -Method GET
    Test-Step "GET /api/recommendations/popular returns data" ($recs -ne $null) ""
    $recCount = if ($recs -is [Array]) { $recs.Count } else { 1 }
    Test-Step "Recommendations list returned" ($recCount -ge 0) ""
    Write-Host ("     Got " + $recCount + " recommendations") -ForegroundColor DarkGray
} catch {
    Test-Step "GET /api/recommendations/popular" $false ("Error: " + $_)
}

# 7. FRONTEND - HTTP check
Write-Host ""
Write-Host "[7] FRONTEND - HTTP Availability" -ForegroundColor Yellow
try {
    $frontendResponse = Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing -TimeoutSec 10
    Test-Step "Frontend returns HTTP 200" ($frontendResponse.StatusCode -eq 200) ""
} catch {
    Test-Step "Frontend available at port 3000" $false ("Error: " + $_)
}

# SUMMARY
$TOTAL = $PASS + $FAIL
Write-Host ""
Write-Host "=======================================================" -ForegroundColor Cyan
if ($FAIL -eq 0) {
    Write-Host ("  RESULTS: " + $PASS + "/" + $TOTAL + " tests PASSED - ALL GREEN") -ForegroundColor Green
} else {
    Write-Host ("  RESULTS: " + $PASS + "/" + $TOTAL + " tests passed  (" + $FAIL + " failed)") -ForegroundColor Yellow
}
Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host ""
