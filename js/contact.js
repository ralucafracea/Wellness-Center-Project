document.addEventListener('DOMContentLoaded', function() {

    const hamburger = document.getElementById('hamburger-btn');
    const mobileNav = document.getElementById('mobile-nav');
    const closeBtn = document.querySelector('.buton-inchidere'); 

    if(hamburger && mobileNav && closeBtn) {
        hamburger.addEventListener('click', function() {
            mobileNav.classList.add('active'); // Deschidem meniul
            hamburger.style.display = 'none';  // Ascundem liniuțele
            closeBtn.style.display = 'block';  // Afișăm X-ul
        });
    }

    // 2. Când apeși pe X
    if(closeBtn && mobileNav && hamburger) {
        closeBtn.addEventListener('click', function() {
            mobileNav.classList.remove('active'); // Ascundem meniul
            closeBtn.style.display = 'none';      // Ascundem X-ul
            hamburger.style.display = 'flex';     // Aducem liniuțele înapoi
        });
    }

    const contactForm = document.querySelector('.contact-form');
    const contactModal = document.getElementById('contact-modal');
    const inputEmail = document.getElementById('contact-email');
    const textEroare = document.querySelector('.eroare-email');
    const closeContactModalBtn = document.getElementById('close-contact-modal-btn');
    const btnInchideContact = document.getElementById('btn-inchide-contact');

    // 2. Logica la trimiterea formularului (Când se apasă butonul)
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            // Oprim comportamentul nativ al browserului (refresh sau pop-up implicit)
            e.preventDefault(); 

            // Expresia regulată (regula care verifică dacă emailul conține @ și un punct după el)
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (inputEmail && textEroare) {
                // VERIFICARE: Dacă textul introdus NU respectă regula de email valid
                if (!emailRegex.test(inputEmail.value.trim())) {
                    
                    textEroare.style.display = 'block';          // Afișăm textul roșu de eroare
                    inputEmail.classList.add('input-eroare');   // Facem linia de sub email roșie
                    
                    return; // OPRIRE: Blocăm trimiterea mai departe și nu deschidem modalul!
                } else {
                    // Dacă emailul este corect: ascundem erorile (în caz că erau afișate dinainte)
                    textEroare.style.display = 'none';
                    inputEmail.classList.remove('input-eroare');
                }
            }

            // 3. Dacă a trecut de verificarea de mai sus, deschidem modalul de succes ca în stânga
            if (contactModal) {
                contactModal.style.display = 'flex';
            }
        });
    }

    // 4. Logica pentru închiderea modalului (Butonul X și butonul "Înapoi la site")
    if (contactModal) {
        if (closeContactModalBtn) {
            closeContactModalBtn.addEventListener('click', () => {
                contactModal.style.display = 'none';
                contactForm.reset(); // Resetează câmpurile după trimitere cu succes
            });
        }
        if (btnInchideContact) {
            btnInchideContact.addEventListener('click', () => {
                contactModal.style.display = 'none';
                contactForm.reset();
            });
        }
    }

});