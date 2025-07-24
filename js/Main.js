document.addEventListener('DOMContentLoaded', function() {
    const jobListings = document.getElementById('job-listings');
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    const pagination = document.getElementById('pagination');
    const jobCount = document.getElementById('job-count');
    const menuToggle = document.querySelector('.menu-toggle');
    const navbarMenu = document.querySelector('.navbar ul');

    let jobs = [];
    let currentFilteredJobs = []; // Aktualne przefiltrowane oferty
    const jobsPerPage = 20; // Liczba ofert pracy na stronę
    let currentPage = 1;

    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navbarMenu.classList.toggle('showing');
        });
    }

    function displayJobs(jobsToDisplay, page = 1) {
        if (!Array.isArray(jobsToDisplay)) {
            console.error('jobsToDisplay is not an array');
            return;
        }

        // Zapisz aktualne przefiltrowane oferty
        currentFilteredJobs = jobsToDisplay;
        currentPage = page;

        jobListings.innerHTML = '';
        const start = (page - 1) * jobsPerPage;
        const end = start + jobsPerPage;
        const paginatedJobs = jobsToDisplay.slice(start, end);

        paginatedJobs.forEach(job => {
            const jobSquare = document.createElement('div');
            jobSquare.classList.add('job-square');

            const jobTitle = document.createElement('h3');
            jobTitle.textContent = job.title;
            jobTitle.style.color = '#ffffff'; // Biały tekst dla stanowiska
            jobSquare.appendChild(jobTitle);

            const jobLocation = document.createElement('p');
            jobLocation.innerHTML = `<span class="location-marker">📍</span>${job.location}`;
            jobSquare.appendChild(jobLocation);

            const jobDescription = document.createElement('div');
            jobDescription.classList.add('job-description');
            jobDescription.textContent = `Firma: ${job.company}\nUmowa: ${job.contract}\nDostępne od: ${job.available_from}`;
            jobSquare.appendChild(jobDescription);

            const applyButton = document.createElement('button');
            applyButton.classList.add('apply-button');
            applyButton.textContent = 'Aplikuj';
            applyButton.addEventListener('click', () => {
                openApplicationForm(job.title);
            });
            jobSquare.appendChild(applyButton);

            jobListings.appendChild(jobSquare);
        });

        displayPagination(jobsToDisplay.length, page);
        updateJobCount(jobsToDisplay.length);
    }

    function displayPagination(totalJobs, page) {
        pagination.innerHTML = '';
        const totalPages = Math.ceil(totalJobs / jobsPerPage);

        const prevButton = document.createElement('button');
        prevButton.textContent = '<-';
        prevButton.classList.add('page-button');
        prevButton.disabled = page === 1;
        prevButton.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                displayJobs(currentFilteredJobs, currentPage);
            }
        });
        pagination.appendChild(prevButton);

        const pageInfo = document.createElement('span');
        pageInfo.classList.add('page-info');
        pageInfo.textContent = ` ${page} -> ${totalPages} `;
        pagination.appendChild(pageInfo);

        const nextButton = document.createElement('button');
        nextButton.textContent = '->';
        nextButton.classList.add('page-button');
        nextButton.disabled = page === totalPages;
        nextButton.addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                displayJobs(currentFilteredJobs, currentPage);
            }
        });
        pagination.appendChild(nextButton);
    }

    function updateJobCount(count) {
        jobCount.textContent = `Liczba ofert pracy: ${count}`;
    }

    searchForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const searchTerm = searchInput.value.toLowerCase().trim();
        
        // Jeśli pole wyszukiwania jest puste, pokaż wszystkie oferty
        if (searchTerm === '') {
            currentPage = 1;
            displayJobs(jobs, 1);
            return;
        }
        
        const filteredJobs = jobs.filter(job => 
            job.location.toLowerCase().includes(searchTerm) || 
            job.title.toLowerCase().includes(searchTerm)
        );
        currentPage = 1; // Reset do pierwszej strony przy nowym wyszukiwaniu
        displayJobs(filteredJobs, 1);
    });

    // Dodaj obsługę czyszczenia wyszukiwania przy zmianie tekstu
    searchInput.addEventListener('input', function() {
        if (searchInput.value.trim() === '') {
            currentPage = 1;
            displayJobs(jobs, 1);
        }
    });

    // Fetch jobs from ue.json
    fetch('ue.json')
        .then(response => response.json())
        .then(data => {
            if (data.jobs && Array.isArray(data.jobs)) {
                jobs = data.jobs;
                displayJobs(jobs, currentPage);
                updateJobCount(jobs.length); // Aktualizacja licznika po załadowaniu danych
            } else {
                console.error('Data from ue.json is not an array');
            }
        })
        .catch(error => console.error('Error loading job data:', error));

    // Karuzela CV
    const carousel = document.querySelector('.kreator-cv-list');
    if (carousel) {
        const templates = carousel.querySelectorAll('.kreator-cv-item');
        let currentIndex = 0;

        function showTemplate(index) {
            templates.forEach((template, i) => {
                template.classList.toggle('active', i === index);
            });
        }

        showTemplate(currentIndex);

        // Automatyczne przełączanie szablonów co 2 sekundy
        setInterval(() => {
            currentIndex = (currentIndex < templates.length - 1) ? currentIndex + 1 : 0;
            showTemplate(currentIndex);
        }, 2000);
    }

    // Sekcja Usługi - ogłoszenia o korepetycjach
    const services = [
        { 
            title: 'Korepetycje z matematyki - podstawa', 
            location: 'Warszawa', 
            description: 'Pomoc w nauce matematyki na poziomie podstawowym i średnim. Przygotowanie do sprawdzianów i klasówek.',
            experience: '5 lat nauczania',
            price: '50 zł/h'
        },
        { 
            title: 'Korepetycje z języka angielskiego', 
            location: 'Kraków', 
            description: 'Nauka języka angielskiego dla dzieci i dorosłych. Przygotowanie do egzaminów Cambridge i IELTS.',
            experience: 'Certyfikat CAE, 8 lat nauczania',
            price: '65 zł/h'
        },
        { 
            title: 'Korepetycje z fizyki', 
            location: 'Gdańsk', 
            description: 'Fizyka dla uczniów liceum i studentów. Mechanika, termodynamika, elektryczność.',
            experience: 'Magister fizyki, 6 lat doświadczenia',
            price: '70 zł/h'
        },
        { 
            title: 'Korepetycje z chemii', 
            location: 'Wrocław', 
            description: 'Chemia organiczna i nieorganiczna. Przygotowanie do matury i egzaminów na studia medyczne.',
            experience: 'Doktor chemii, 10 lat nauczania',
            price: '80 zł/h'
        },
        { 
            title: 'Korepetycje z języka niemieckiego', 
            location: 'Poznań', 
            description: 'Niemiecki od podstaw do poziomu zaawansowanego. Przygotowanie do certyfikatów Goethe.',
            experience: 'Studia germanistyczne, native speaker',
            price: '60 zł/h'
        },
        { 
            title: 'Korepetycje z historii', 
            location: 'Łódź', 
            description: 'Historia Polski i powszechna. Przygotowanie do matury rozszerzonej z historii.',
            experience: 'Magister historii, nauczyciel w liceum',
            price: '55 zł/h'
        },
        { 
            title: 'Korepetycje z biologii', 
            location: 'Katowice', 
            description: 'Biologia molekularna, genetyka, anatomia. Przygotowanie na studia medyczne i biologiczne.',
            experience: 'Doktor biologii, 7 lat w szkolnictwie',
            price: '75 zł/h'
        },
        { 
            title: 'Korepetycje z języka polskiego', 
            location: 'Bydgoszcz', 
            description: 'Literatura, gramatyka, stylistyka. Przygotowanie do matury i konkursów literackich.',
            experience: 'Polonista, 15 lat doświadczenia',
            price: '58 zł/h'
        },
        { 
            title: 'Korepetycje z informatyki', 
            location: 'Toruń', 
            description: 'Programowanie (Python, Java, C++), algorytmy, bazy danych. Przygotowanie do olimpiad informatycznych.',
            experience: 'Informatyk, programista 12 lat',
            price: '90 zł/h'
        },
        { 
            title: 'Korepetycje z języka francuskiego', 
            location: 'Lublin', 
            description: 'Francuski dla początkujących i zaawansowanych. Konwersacje, gramatyka, przygotowanie do DELF.',
            experience: 'Romanistka, 6 lat we Francji',
            price: '68 zł/h'
        },
        { 
            title: 'Korepetycje z matematyki - matura', 
            location: 'Rzeszów', 
            description: 'Specjalistyczne przygotowanie do matury rozszerzonej z matematyki. 100% zdawalność.',
            experience: 'Magister matematyki, 12 lat doświadczenia',
            price: '85 zł/h'
        },
        { 
            title: 'Korepetycje z geografii', 
            location: 'Olsztyn', 
            description: 'Geografia fizyczna i ekonomiczna. Kartografia i klimatologia. Przygotowanie do matury.',
            experience: 'Geograf, nauczyciel w szkole średniej',
            price: '52 zł/h'
        }
    ];

    const servicesPerPage = 4;
    let currentServicePage = 1;

    function displayServices(servicesToDisplay, page = 1) {
        const servicesList = document.querySelector('.uslugi-list');
        servicesList.innerHTML = '';
        const start = (page - 1) * servicesPerPage;
        const end = start + servicesPerPage;
        const paginatedServices = servicesToDisplay.slice(start, end);

        paginatedServices.forEach(service => {
            const serviceSquare = document.createElement('div');
            serviceSquare.classList.add('service-square');

            const serviceTitle = document.createElement('h3');
            serviceTitle.textContent = service.title;
            serviceSquare.appendChild(serviceTitle);

            const serviceLocation = document.createElement('p');
            serviceLocation.innerHTML = `<span class="location-marker">📍</span>${service.location}`;
            serviceSquare.appendChild(serviceLocation);

            const serviceDescription = document.createElement('p');
            serviceDescription.innerHTML = `<strong>Opis:</strong> ${service.description}`;
            serviceSquare.appendChild(serviceDescription);

            const serviceExperience = document.createElement('p');
            serviceExperience.innerHTML = `<strong>Doświadczenie:</strong> ${service.experience}`;
            serviceSquare.appendChild(serviceExperience);

            const servicePrice = document.createElement('p');
            servicePrice.innerHTML = `<strong>Cena:</strong> ${service.price}`;
            serviceSquare.appendChild(servicePrice);

            const applyButton = document.createElement('a');
            applyButton.href = '#';
            applyButton.classList.add('apply-button');
            applyButton.textContent = 'Zamów usługę';
            serviceSquare.appendChild(applyButton);

            servicesList.appendChild(serviceSquare);
        });

        displayServicePagination(servicesToDisplay.length, page);
    }

    function displayServicePagination(totalServices, page) {
        const pagination = document.getElementById('service-pagination');
        pagination.innerHTML = '';
        const totalPages = Math.ceil(totalServices / servicesPerPage);

        const prevButton = document.createElement('button');
        prevButton.textContent = '<-';
        prevButton.classList.add('service-page-button');
        prevButton.disabled = page === 1;
        prevButton.addEventListener('click', () => {
            if (currentServicePage > 1) {
                currentServicePage--;
                displayServices(services, currentServicePage);
            }
        });
        pagination.appendChild(prevButton);

        const pageInfo = document.createElement('span');
        pageInfo.classList.add('page-info');
        pageInfo.textContent = ` ${page} -> ${totalPages} `;
        pagination.appendChild(pageInfo);

        const nextButton = document.createElement('button');
        nextButton.textContent = '->';
        nextButton.classList.add('service-page-button');
        nextButton.disabled = page === totalPages;
        nextButton.addEventListener('click', () => {
            if (currentServicePage < totalPages) {
                currentServicePage++;
                displayServices(services, currentServicePage);
            }
        });
        pagination.appendChild(nextButton);
    }

    displayServices(services, currentServicePage);
});

// Dodanie kodu do obsługi zapisu CV
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('stworz-cv-form');

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = new FormData(form);

        // Pobierz parametr szablonu z URL
        const urlParams = new URLSearchParams(window.location.search);
        const template = urlParams.get('template');
        formData.append('template', template);

        // Zapisz CV w pliku JSON
        fetch('src/save_cv.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Przekierowanie do strony płatności
                window.location.href = `payment.html?cv_id=${data.cv_id}`;
            } else {
                alert('Wystąpił błąd podczas zapisywania CV.');
            }
        })
        .catch(error => {
            console.error('Błąd:', error);
            alert('Wystąpił błąd podczas zapisywania CV.');
        });
    });
});