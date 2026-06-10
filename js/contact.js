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
        contactForm.addEventListener('submit', async (e) => {
            
            // MAGIA CARE OPREȘTE REFRESH-UL PAGINII:
            e.preventDefault(); 

            // Validarea de email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (inputEmail && textEroare) {
                if (!emailRegex.test(inputEmail.value.trim())) {
                    textEroare.style.display = 'block';
                    inputEmail.classList.add('input-eroare');
                    return; // Ne oprim aici dacă emailul nu e valid
                } else {
                    textEroare.style.display = 'none';
                    inputEmail.classList.remove('input-eroare');
                }
            }

            // Extragem datele cu ID-urile corecte din HTML-ul tău
            const dateTrimise = {
                nume: document.getElementById('contact-name').value,
                email: document.getElementById('contact-email').value,
                subiect: document.getElementById('contact-subject').value,
                mesaj: document.getElementById('contact-message').value,
                data_trimitere: new Date().toISOString()
            };

            // Trimitem datele către server
            try {
                const response = await fetch('http://localhost:3000/api/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(dateTrimise)
                });

                if (response.ok) {
                    console.log("Mesaj salvat în mock-contact.json!");
                    
                    // Afișăm pop-up-ul și GATA (nu se va mai închide singur)
                    if (contactModal) {
                        contactModal.style.display = 'flex';
                    }
                    
                    // Opțional: golim câmpurile formularului
                    contactForm.reset(); 
                } else {
                    alert("Serverul a răspuns cu eroare.");
                }
            } catch (error) {
                console.error("Eroare:", error);
                alert("Nu am putut conecta la server. Verifică dacă Node.js rulează.");
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