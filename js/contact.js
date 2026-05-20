
const contactForm = document.querySelector('.contact-form');
const contactModal = document.getElementById('contact-modal');
const closeContactModalBtn = document.getElementById('close-contact-modal-btn');
const btnInchideContact = document.getElementById('btn-inchide-contact');

if (contactForm && contactModal) {
    // Când se trimite formularul
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Oprește refresh-ul paginii
        
        contactModal.style.display = 'flex'; // Afișează pop-up-ul
    });
}

// Funcția care închide pop-up-ul și golește formularul
function inchideModalContact() {
    if (contactModal) {
        contactModal.style.display = 'none'; // Ascunde pop-up-ul
        contactForm.reset(); // Golește căsuțele formularului
    }
}

// Activăm butoanele de închidere ("X" și butonul de jos)
if (closeContactModalBtn) closeContactModalBtn.addEventListener('click', inchideModalContact);
if (btnInchideContact) btnInchideContact.addEventListener('click', inchideModalContact);