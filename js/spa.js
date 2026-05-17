const hamburger = document.getElementById('hamburger-btn');
const mobileNav = document.getElementById('mobile-nav');
const closeBtn = document.getElementById('close-btn'); 

// Apăsarea pe hamburger deschide/închide meniul (comutator)
hamburger.addEventListener('click', function() {
    mobileNav.classList.toggle('active');
});

// Apăsarea pe X (doar pe telefon) închide meniul
closeBtn.addEventListener('click', function() {
    mobileNav.classList.remove('active');
});

const navLinks = document.querySelectorAll('.mobile-nav ul li a');

navLinks.forEach(function(link) {
    link.addEventListener('click', function() {
        mobileNav.classList.remove('active');
    });
});