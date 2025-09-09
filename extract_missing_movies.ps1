# Extract movies without poster images from the log
$logContent = Get-Content 'image_replacement_log.txt'
$moviesNotFound = @()
$moviesNoImages = @()

foreach ($line in $logContent) {
    if ($line -match 'Movie not found on TMDB: "(.+?)"') {
        $movieTitle = $matches[1]
        if ($movieTitle -ne '""' -and $movieTitle -ne '\') {
            $moviesNotFound += $movieTitle
        }
    }
    elseif ($line -match 'No images found for "(.+?)"') {
        $movieTitle = $matches[1]
        $moviesNoImages += $movieTitle
    }
}

Write-Host "=== MOVIES NOT FOUND ON TMDB ($($moviesNotFound.Count) movies) ==="
$moviesNotFound | Sort-Object | ForEach-Object { Write-Host "• $_" }

Write-Host ""
Write-Host "=== MOVIES FOUND BUT NO IMAGES AVAILABLE ($($moviesNoImages.Count) movies) ==="
$moviesNoImages | Sort-Object | ForEach-Object { Write-Host "• $_" }

Write-Host ""
Write-Host "=== TOTAL MOVIES WITHOUT POSTER IMAGES: $($moviesNotFound.Count + $moviesNoImages.Count) ==="
