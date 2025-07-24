# PowerShell script to add logo CSS and JS to all HTML files

Write-Host "Dodawanie logo CSS i JS do wszystkich plików HTML..." -ForegroundColor Green

# Lista plików już przetworzonych
$processedFiles = @("index.html", "baza_cv.html", "FAQ.html", "O_nas.html")

# Pobierz wszystkie pliki HTML
$htmlFiles = Get-ChildItem -Path "." -Filter "*.html"

foreach ($file in $htmlFiles) {
    $fileName = $file.Name
    Write-Host "Sprawdzanie pliku: $fileName" -ForegroundColor Yellow
    
    # Sprawdź czy plik nie jest już przetworzony
    if ($processedFiles -contains $fileName) {
        Write-Host "Pomijanie pliku: $fileName (już przetworzony)" -ForegroundColor Cyan
        continue
    }
    
    try {
        # Czytaj zawartość pliku
        $content = Get-Content $file.FullName -Raw -Encoding UTF8
        $modified = $false
        
        # Sprawdź czy już ma CSS logo
        if ($content -notmatch "css/logo\.css") {
            Write-Host "Dodawanie CSS logo do $fileName" -ForegroundColor Green
            # Znajdź </title> i dodaj CSS po nim
            $content = $content -replace "(\s*</title>)", "`$1`n    <link rel=`"stylesheet`" href=`"css/logo.css`">"
            $modified = $true
        } else {
            Write-Host "CSS logo już istnieje w $fileName" -ForegroundColor Gray
        }
        
        # Sprawdź czy już ma JS logo
        if ($content -notmatch "js/logo\.js") {
            Write-Host "Dodawanie JS logo do $fileName" -ForegroundColor Green
            # Znajdź </body> i dodaj JS przed nim
            $content = $content -replace "(\s*</body>)", "    <script src=`"js/logo.js`"></script>`n`$1"
            $modified = $true
        } else {
            Write-Host "JS logo już istnieje w $fileName" -ForegroundColor Gray
        }
        
        # Zapisz plik jeśli został zmodyfikowany
        if ($modified) {
            Set-Content $file.FullName $content -Encoding UTF8
            Write-Host "Zaktualizowano plik: $fileName" -ForegroundColor Green
        }
        
    } catch {
        Write-Host "Błąd podczas przetwarzania pliku $fileName : $_" -ForegroundColor Red
    }
}

Write-Host "`nZakończono dodawanie logo do wszystkich plików HTML." -ForegroundColor Green
Read-Host "Naciśnij Enter, aby zakończyć"
