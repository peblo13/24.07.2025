@echo off
setlocal enabledelayedexpansion
echo Dodawanie logo CSS i JS do wszystkich plików HTML...

REM Lista plików do pominięcia (już zrobione)
set "skip_files=index.html baza_cv.html"

for %%f in (*.html) do (
    echo Sprawdzanie pliku: %%f
    
    REM Sprawdź czy plik nie jest na liście pominiętych
    set "skip=0"
    for %%s in (%skip_files%) do (
        if "%%f"=="%%s" set "skip=1"
    )
    
    if "!skip!"=="0" (
        echo Przetwarzanie pliku: %%f
        
        REM Sprawdź czy już ma link do logo.css
        findstr /c:"css/logo.css" "%%f" >nul 2>&1
        if errorlevel 1 (
            echo Dodawanie CSS logo do %%f
            REM Znajdź ostatni link css i dodaj nasz po nim
            powershell -Command "$content = Get-Content '%%f' -Raw; $content = $content -replace '(\</title\>)', '$1`n    <link rel=\"stylesheet\" href=\"css/logo.css\">'; Set-Content '%%f' $content -Encoding UTF8"
        ) else (
            echo CSS logo już istnieje w %%f
        )
        
        REM Sprawdź czy już ma skrypt logo.js
        findstr /c:"js/logo.js" "%%f" >nul 2>&1
        if errorlevel 1 (
            echo Dodawanie JS logo do %%f
            powershell -Command "$content = Get-Content '%%f' -Raw; $content = $content -replace '(\</body\>)', '    <script src=\"js/logo.js\"></script>`n$1'; Set-Content '%%f' $content -Encoding UTF8"
        ) else (
            echo JS logo już istnieje w %%f
        )
    ) else (
        echo Pomijanie pliku: %%f - już przetworzony
    )
)

echo Zakończono dodawanie logo do wszystkich plików HTML.
pause
