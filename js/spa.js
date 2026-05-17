document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('hamburger-btn');
    const mobileNav = document.getElementById('mobile-nav');
    const closeBtn = document.getElementById('close-btn'); 

    // Apăsarea pe hamburger deschide/închide meniul (comutator)
    if (hamburger && mobileNav) {
        hamburger.addEventListener('click', function() {
            mobileNav.classList.toggle('active');
        });
    }

    // Apăsarea pe X (doar pe telefon) închide meniul
    if (closeBtn && mobileNav) {
        closeBtn.addEventListener('click', function() {
            mobileNav.classList.remove('active');
        });
    }

    // Închidem meniul când dăm click pe un link (util pentru ecrane mici)
    const navLinks = document.querySelectorAll('.mobile-nav ul li a');
    navLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            mobileNav.classList.remove('active');
        });
    });

    // Gestionarea formularului de contact
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Previne reîncărcarea paginii
            
            // Afișăm un mesaj frumos pentru utilizator
            alert('Îți mulțumim! Mesajul tău a fost trimis cu succes către Tirra Wellness.');
            
            // Golim formularul după trimitere
            contactForm.reset();
        });
    }
});