$ErrorActionPreference = "Stop"

Write-Host "THEFT // P10 repository migration" -ForegroundColor Cyan

function Ensure-Dir([string]$Path) {
    if (-not (Test-Path $Path)) { New-Item -ItemType Directory -Path $Path -Force | Out-Null }
}

function Move-Safe([string]$Source, [string]$Destination) {
    if (-not (Test-Path $Source)) { return }
    Ensure-Dir (Split-Path $Destination -Parent)
    if (Test-Path $Destination) {
        $srcHash = (Get-FileHash $Source -Algorithm SHA256).Hash
        $dstHash = (Get-FileHash $Destination -Algorithm SHA256).Hash
        if ($srcHash -ne $dstHash) {
            throw "Conflict: both '$Source' and '$Destination' exist and differ. Resolve manually."
        }
        Remove-Item $Source -Force
        Write-Host "DEDUP  $Source" -ForegroundColor DarkGray
        return
    }
    Move-Item $Source $Destination
    Write-Host "MOVE   $Source -> $Destination" -ForegroundColor Green
}

Ensure-Dir "assets/images/archive"
Ensure-Dir "assets/images/signal"
Ensure-Dir "assets/video/signal"
Ensure-Dir "js"
Ensure-Dir "docs/supabase"
Ensure-Dir "docs/migration"
Ensure-Dir "tools"

1..11 | ForEach-Object {
    $n = $_.ToString("00")
    Move-Safe "material-$n.jpg" "assets/images/archive/archive-$n.jpg"
}

Move-Safe "trailer-16x9-web.mp4" "assets/video/signal/signal-trailer-ru.mp4"
Move-Safe "trailer-preview.jpg" "assets/images/signal/signal-preview.jpg"

# public-response.js comes from the migration package; remove the obsolete root copy.
if (Test-Path "reviews.js") {
    Remove-Item "reviews.js" -Force
    Write-Host "DELETE reviews.js (replaced by js/public-response.js)" -ForegroundColor Yellow
}

# Preserve the first SQL draft as historical documentation if it exists.
Move-Safe "supabase-schema.sql" "docs/supabase/legacy-initial-schema.sql"

# Files no longer referenced by the current site.
$obsolete = @(
    "hero-bg.jpg",
    "poster.jpg",
    "trailer.mp4",
    "trailer-web.mp4",
    "trailer-cover.jpg",
    "README-P7.txt",
    "README-UPDATE.txt"
)
foreach ($file in $obsolete) {
    if (Test-Path $file) {
        Remove-Item $file -Force
        Write-Host "DELETE $file" -ForegroundColor Yellow
    }
}

Get-ChildItem -File -Filter "gallery-*.jpg" -ErrorAction SilentlyContinue | ForEach-Object {
    Remove-Item $_.FullName -Force
    Write-Host "DELETE $($_.Name)" -ForegroundColor Yellow
}
Get-ChildItem -File -Filter "UPDATE-P*.txt" -ErrorAction SilentlyContinue | ForEach-Object {
    Remove-Item $_.FullName -Force
    Write-Host "DELETE $($_.Name)" -ForegroundColor Yellow
}
Get-ChildItem -File -Filter "HISHCHENIE*.zip" -ErrorAction SilentlyContinue | ForEach-Object {
    Remove-Item $_.FullName -Force
    Write-Host "DELETE $($_.Name)" -ForegroundColor Yellow
}

$required = @(
    "index.html",
    "js/public-response.js",
    "assets/images/archive/archive-01.jpg",
    "assets/images/archive/archive-11.jpg",
    "assets/images/signal/signal-preview.jpg",
    "assets/video/signal/signal-trailer-ru.mp4"
)
$missing = $required | Where-Object { -not (Test-Path $_) }
if ($missing.Count -gt 0) {
    Write-Host "";
    Write-Warning ("Migration completed, but these required files are missing:`n - " + ($missing -join "`n - "))
    exit 2
}

Write-Host "";
Write-Host "MIGRATION OK // run 'git status' and review the renames before commit." -ForegroundColor Cyan
