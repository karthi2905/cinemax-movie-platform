# Find good action/horror movies to replace "Mr. Singh/Mrs. Mehta"
$content = Get-Content 'src/data/movies.js' -Raw

# Parse the JSON-like structure to find movies
$moviePattern = '"id":\s*"([^"]+)"[^}]+?"title":\s*"([^"]+)"[^}]+?"releaseYear":\s*(\d+)[^}]+?"genres":\s*\[([^\]]+)\][^}]+?"averageRating":\s*([\d.]+)[^}]+?"totalRatings":\s*(\d+)[^}]+?"popularity":\s*(\d+)[^}]+?"posterImage":\s*"([^"]+)"[^}]+?"backdropImage":\s*"([^"]+)"'

$matches = [regex]::Matches($content, $moviePattern)
$actionHorrorMovies = @()

foreach ($match in $matches) {
    $id = $match.Groups[1].Value
    $title = $match.Groups[2].Value
    $year = $match.Groups[3].Value
    $genres = $match.Groups[4].Value
    $rating = [double]$match.Groups[5].Value
    $totalRatings = [int]$match.Groups[6].Value
    $popularity = [int]$match.Groups[7].Value
    $poster = $match.Groups[8].Value
    $backdrop = $match.Groups[9].Value
    
    # Check if it's Action or Horror genre with good ratings and real TMDB images
    if (($genres -match '"Action"' -or $genres -match '"Horror"') -and 
        $rating -ge 7.5 -and 
        $totalRatings -ge 10000 -and
        $poster -match 'image.tmdb.org' -and
        $backdrop -match 'image.tmdb.org') {
        
        $actionHorrorMovies += [PSCustomObject]@{
            ID = $id
            Title = $title
            Year = $year
            Genres = $genres
            Rating = $rating
            TotalRatings = $totalRatings
            Popularity = $popularity
            Poster = $poster
            Backdrop = $backdrop
        }
    }
}

Write-Host "=== TOP ACTION/HORROR MOVIES WITH REAL TMDB IMAGES ==="
$actionHorrorMovies | Sort-Object Rating -Descending | Select-Object -First 10 | ForEach-Object {
    Write-Host "• $($_.Title) ($($_.Year)) - Rating: $($_.Rating) - ID: $($_.ID)"
    Write-Host "  Genres: $($_.Genres)"
    Write-Host "  Poster: $($_.Poster)"
    Write-Host ""
}
