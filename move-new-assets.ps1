$dest = "c:\IceCream-Hub\frontend\public\images"
$artifactDir = "C:\Users\LENOVO\.gemini\antigravity\brain\3bf3a839-d5dd-45db-bd1a-f2b3298f4de8"

$files = @(
    @{ src = "vanilla_delight_horizontal_*.png"; dst = "lifestyle_1.png" },
    @{ src = "berry_blast_horizontal_*.png"; dst = "lifestyle_2.png" }
)

foreach ($f in $files) {
    $srcPath = Get-ChildItem -Path "$artifactDir\$($f.src)" | Select-Object -First 1
    if ($srcPath) {
        Copy-Item -Path $srcPath.FullName -Destination "$dest\$($f.dst)" -Force
        Write-Host "Copied $($f.dst)" -ForegroundColor Green
    }
}
