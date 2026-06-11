document.addEventListener('DOMContentLoaded', function() {

    const hamburger = document.getElementById('hamburger-btn');
    const mobileNav = document.getElementById('mobile-nav');
    const closeBtn = document.querySelector('.buton-inchidere'); 

    if(hamburger && mobileNav && closeBtn) {
        hamburger.addEventListener('click', function() {
            mobileNav.classList.add('active'); 
            hamburger.style.display = 'none'; 
            closeBtn.style.display = 'block';  
        });
    }

    if(closeBtn && mobileNav && hamburger) {
        closeBtn.addEventListener('click', function() {
            mobileNav.classList.remove('active'); 
            closeBtn.style.display = 'none';     
            hamburger.style.display = 'flex';     
        });
    }

    const contactForm = document.querySelector('.contact-form');
    const contactModal = document.getElementById('contact-modal');
    const inputEmail = document.getElementById('contact-email');
    const textEroare = document.querySelector('.eroare-email');
    const closeContactModalBtn = document.getElementById('close-contact-modal-btn');
    const btnInchideContact = document.getElementById('btn-inchide-contact');

    //Logica la trimiterea formularului
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            
            e.preventDefault(); 

            // Validarea de email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (inputEmail && textEroare) {
                if (!emailRegex.test(inputEmail.value.trim())) {
                    textEroare.style.display = 'block';
                    inputEmail.classList.add('input-eroare');
                    return;
                } else {
                    textEroare.style.display = 'none';
                    inputEmail.classList.remove('input-eroare');
                }
            }

            // Extragem datele cu ID-urile corecte din HTML-ul tau
            const dateTrimise = {
                nume: document.getElementById('contact-name').value,
                email: document.getElementById('contact-email').value,
                subiect: document.getElementById('contact-subject').value,
                mesaj: document.getElementById('contact-message').value,
                data_trimitere: new Date().toISOString()
            };

            // Trimitem datele catre server
            try {
                const response = await fetch('http://localhost:3000/api/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(dateTrimise)
                });

                if (response.ok) {
                    console.log("Mesaj salvat în mock-contact.json!");
                    
                    if (contactModal) {
                        contactModal.style.display = 'flex';
                    }
                    
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

    // Logica pentru inchiderea modalului 
    if (contactModal) {
        if (closeContactModalBtn) {
            closeContactModalBtn.addEventListener('click', () => {
                contactModal.style.display = 'none';
                contactForm.reset(); 
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