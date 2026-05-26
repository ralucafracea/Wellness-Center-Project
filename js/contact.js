document.addEventListener('DOMContentLoaded', function() {

    // ==========================================================================
    // A. BARA DE NAVIGARE SCONCRONIZATĂ PENTRU PAGINA DE CONTACT
    // ==========================================================================
    const hamburger = document.getElementById('hamburger-btn');
    const mobileNav = document.getElementById('mobile-nav');
    const closeBtn = document.querySelector('.buton-inchidere'); 

    if (hamburger && mobileNav) {
        hamburger.addEventListener('click', () => {
            mobileNav.classList.add('active');
            if (closeBtn) {
                closeBtn.style.display = 'block';
                closeBtn.style.color = '#631621';
                closeBtn.style.zIndex = '2001';
            }
        });
    }

    if (closeBtn && mobileNav) {
        closeBtn.addEventListener('click', () => {
            mobileNav.classList.remove('active');
            closeBtn.style.display = 'none';
        });
    }

    // ==========================================================================
    // B. LOGICA PENTRU FORMULARUL DE CONTACT ȘI POP-UP-UL DE SUCCES
    // ==========================================================================
    const contactForm = document.querySelector('.contact-form');
    const contactModal = document.getElementById('contact-modal');
    const closeContactModalBtn = document.getElementById('close-contact-modal-btn');
    const btnInchideContact = document.getElementById('btn-inchide-contact');

    if (contactForm && contactModal) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault(); 
            contactModal.style.display = 'flex'; 
        });
    }

    function inchideModalContact() {
        if (contactModal) {
            contactModal.style.display = 'none'; 
            if (contactForm) {
                contactForm.reset(); 
            }
        }
    }

    if (closeContactModalBtn) closeContactModalBtn.addEventListener('click', inchideModalContact);
    if (btnInchideContact) btnInchideContact.addEventListener('click', inchideModalContact);

});