// Uniwersalny skrypt do dodawania logo na wszystkich stronach
document.addEventListener('DOMContentLoaded', function() {
    // Sprawdź czy logo już istnieje
    if (document.querySelector('.logo')) {
        console.log('Logo już istnieje na stronie');
        return;
    }
    
    // Utwórz element logo
    const logo = document.createElement('div');
    logo.className = 'logo';
    logo.innerHTML = '<img src="images/logo.png" alt="Logo" onerror="this.src=\'../images/logo.png\'">';
    
    // Dodaj logo do body jako pierwsze dziecko
    document.body.insertBefore(logo, document.body.firstChild);
    
    console.log('Logo zostało dodane do strony');
});

// Funkcja do ładowania CSS logo
function loadLogoCSS() {
    // Sprawdź czy CSS logo już został załadowany
    if (document.querySelector('link[href*="logo.css"]')) {
        return;
    }
    
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    
    // Próbuj różne ścieżki do CSS
    const possiblePaths = [
        'css/logo.css',
        '../css/logo.css',
        '../../css/logo.css'
    ];
    
    link.href = possiblePaths[0];
    document.head.appendChild(link);
    
    console.log('CSS logo został załadowany');
}

// Załaduj CSS na początku
loadLogoCSS();
