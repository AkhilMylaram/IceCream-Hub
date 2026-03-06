$dest = "c:\IceCream-Hub\frontend\public\images"
if (!(Test-Path $dest)) { New-Item -ItemType Directory -Path $dest }

$files = @(
    @{ src = "icecream_hero_hd_*.png"; dst = "hero.png" },
    @{ src = "salted_caramel_image_*.png"; dst = "salted_caramel.png" },
    @{ src = "midnight_chocolate_image_*.png"; dst = "midnight_chocolate.png" },
    @{ src = "pistachio_perfection_image_*.png"; dst = "pistachio.png" },
    @{ src = "strawberry_shortcake_image_*.png"; dst = "strawberry_shortcake.png" },
    @{ src = "espresso_buzz_image_*.png"; dst = "espresso.png" },
    @{ src = "coconut_bliss_image_*.png"; dst = "coconut.png" },
    @{ src = "cookies_cream_image_retry_*.png"; dst = "cookies_cream.png" },
    @{ src = "mango_tango_image_retry_*.png"; dst = "mango.png" },
    @{ src = "mint_choc_chip_image_retry_*.png"; dst = "mint.png" },
    @{ src = "honey_lavender_image_retry_*.png"; dst = "honey_lavender.png" }
)

$artifactDir = "C:\Users\LENOVO\.gemini\antigravity\brain\3bf3a839-d5dd-45db-bd1a-f2b3298f4de8"

foreach ($f in $files) {
    $srcPath = Get-ChildItem -Path "$artifactDir\$($f.src)" | Select-Object -First 1
    if ($srcPath) {
        Copy-Item -Path $srcPath.FullName -Destination "$dest\$($f.dst)" -Force
        Write-Host "Copied $($f.dst)" -ForegroundColor Green
    } else {
        Write-Host "Warning: Could not find $($f.src)" -ForegroundColor Yellow
    }
}
