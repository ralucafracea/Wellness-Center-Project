document.addEventListener('DOMContentLoaded', function() {

// ==========================================================================
// AUTO-COMPLETARE FORMULAR DACA UTILIZATORUL ESTE LOGAT 
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
    const numeClient = localStorage.getItem('nume_utilizator');
    const emailClient = localStorage.getItem('email_utilizator');
    const telefonClient = localStorage.getItem('telefon_utilizator');

    if (numeClient && emailClient) {
        document.getElementById('nume').value = numeClient;
        document.getElementById('email').value = emailClient;
        
        if (telefonClient) {
            document.getElementById('telefon').value = telefonClient;
        }
    }
})
    // ==========================================================================
    // BARA DE NAVIGARE
    // ==========================================================================
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

    // ==========================================================================
    // LISTE DERULANTE DINAMICE
    // ==========================================================================
    const categorieSelect = document.getElementById('categorie-select');
    const pachetSelect = document.getElementById('pachet-select');

    // Aici vom stoca dinamic ce primim de la server
    let pacheteDinamice = {
        spa: [],
        sala: [], 
        combinat: []
    };

    async function incarcaCatalogulDeServicii() {
        try {
            const response = await fetch('http://localhost:3000/api/servicii');
            if (!response.ok) throw new Error("Nu am putut aduce catalogul.");
            
            const catalog = await response.json();
            
            catalog.forEach(serviciu => {
                const categorieFrontend = serviciu.categorie === 'fitness' ? 'sala' : serviciu.categorie;
                
                if (pacheteDinamice[categorieFrontend]) {
                    pacheteDinamice[categorieFrontend].push({
                        value: serviciu.nume, 
                        text: serviciu.nume 
                    });
                }
            });
            console.log(" Catalog servicii încărcat dinamic:", pacheteDinamice);
        } catch (error) {
            console.error(" Eroare la încărcarea serviciilor:", error);
        }
    }

    incarcaCatalogulDeServicii();

    if (categorieSelect && pachetSelect) {
        categorieSelect.addEventListener('change', function() {
            const categorieAleasa = this.value;
            pachetSelect.innerHTML = '<option value="" disabled selected>Alege pachetul dorit...</option>';
            
            if (categorieAleasa && pacheteDinamice[categorieAleasa].length > 0) {
                pachetSelect.disabled = false; 
                pacheteDinamice[categorieAleasa].forEach(function(pachet) {
                    const optiuneNoua = document.createElement('option');
                    optiuneNoua.value = pachet.value;
                    optiuneNoua.textContent = pachet.text;
                    pachetSelect.appendChild(optiuneNoua);
                });
            } else {
                pachetSelect.disabled = true;
            }
        });
    }

    // ==========================================================================
    // FORMULAR, VALIDARE SI TRIMITERE CATRE BACKEND
    // ==========================================================================
    const rezervariForm = document.querySelector('.rezervari-form'); 
    
    const inputEmail = document.getElementById('contact-email');
    const textEroare = document.querySelector('.eroare-email');
    const inputTelefon = document.getElementById('contact-telefon');
    const textEroareTelefon = document.querySelector('.eroare-telefon');
    
    const modalOverlay = document.getElementById('payment-modal');
    const modalCardForm = document.getElementById('modal-card-form');
    const modalSucces = document.getElementById('modal-succes');
    const mesajTextSucces = document.getElementById('mesaj-text-succes');
    
    const btnPlateste = document.getElementById('btn-plateste'); 
    const btnCloseModal = document.getElementById('close-modal-btn'); 
    const btnInchideFinal = document.getElementById('btn-inchide-final'); 
    
    const btnRezerva = document.getElementById('btn-rezerva');
    const btnCumpara = document.getElementById('btn-cumpara');

    let actiuneAleasa = '';

    if (btnRezerva) btnRezerva.addEventListener('click', () => actiuneAleasa = 'rezerva');
    if (btnCumpara) btnCumpara.addEventListener('click', () => actiuneAleasa = 'cumpara');

    // Funcția care adună datele și le trimite (DILEMA 2: Includem statusPlata)
    async function trimiteRezervareaLaServer(metodaPlata, statusPlata) {
        
        const selectCat = document.getElementById('categorie-select');
        const selectPachet = document.getElementById('pachet-select');

        const categorieNume = selectCat.options[selectCat.selectedIndex]?.text || '';
        const pachetNume = selectPachet.options[selectPachet.selectedIndex]?.text || '';

        // Construim pachetul exact pentru baza de date
        const dateRezervare = {
            nume: document.getElementById('contact-name').value,
            telefon: inputTelefon.value,
            email: inputEmail.value,
            categorie_serviciu: categorieNume,
            pachet_abonament: pachetNume,
            data_rezervare: document.getElementById('contact-data').value, 
            ora_rezervare: document.getElementById('contact-ora').value,
            metoda_plata: metodaPlata,
            status_plata: statusPlata,
            data_creare_rezervare: new Date().toISOString()
        };

        try {
            const response = await fetch('http://localhost:3000/api/programari', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dateRezervare)
            });
            return response.ok; 
        } catch (error) {
            console.error("Eroare la backend:", error);
            return false;
        }
    }

    if (rezervariForm) {
        rezervariForm.addEventListener('submit', async (e) => {
            e.preventDefault(); 
            
            // PAZNICUL DE LOGARE
            if (!localStorage.getItem('userLogat')) {
                const loginModal = document.getElementById('login-modal');
                if (loginModal) loginModal.style.display = 'flex';
                return; 
            }
            
            let formularValid = true; 
            
            // Validare Email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (inputEmail && textEroare) {
                if (!emailRegex.test(inputEmail.value.trim())) {
                    textEroare.style.display = 'block';          
                    inputEmail.classList.add('input-eroare');    
                    formularValid = false; 
                } else {
                    textEroare.style.display = 'none';
                    inputEmail.classList.remove('input-eroare');
                }
            }

            // Validare Telefon
            const telefonRegex = /^[0-9]{10}$/;
            if (inputTelefon && textEroareTelefon) {
                const telefonCuratat = inputTelefon.value.replace(/\s+/g, '');
                if (!telefonRegex.test(telefonCuratat)) {
                    textEroareTelefon.style.display = 'block';          
                    inputTelefon.classList.add('input-eroare');    
                    formularValid = false; 
                } else {
                    textEroareTelefon.style.display = 'none';
                    inputTelefon.classList.remove('input-eroare');
                }
            }

            if (!formularValid) return; 

            if (modalOverlay) modalOverlay.style.display = 'flex'; 

            if (actiuneAleasa === 'rezerva') {
                const salvatCuSucces = await trimiteRezervareaLaServer('La recepție', 'neplatita');
                
                if (salvatCuSucces) {
                    if (modalCardForm) modalCardForm.style.display = 'none';
                    if (mesajTextSucces) mesajTextSucces.innerText = "Rezervarea a fost înregistrată! Plata se va face la recepție.";
                    if (modalSucces) modalSucces.style.display = 'block';
                } else {
                    alert("A apărut o eroare la server. Încearcă din nou.");
                    modalOverlay.style.display = 'none';
                }

            } else if (actiuneAleasa === 'cumpara') {
                if (modalSucces) modalSucces.style.display = 'none';
                if (modalCardForm) modalCardForm.style.display = 'block'; 
            }
        });
    }

    // LOGICA PENTRU PLATA CU CARDUL
    const inputCard = document.getElementById('card-numar');
    const textEroareCard = document.querySelector('.eroare-card');
    const inputExp = document.getElementById('card-expirare');
    const textEroareExp = document.querySelector('.eroare-exp');
    const inputCvv = document.getElementById('card-cvv');
    const textEroareCvv = document.querySelector('.eroare-cvv');

    if (btnPlateste) {
        btnPlateste.addEventListener('click', async () => {
            let cardValid = true; 

            if (inputCard && textEroareCard) {
                const numarCuratat = inputCard.value.replace(/\s+/g, '');
                const cardRegex = /^[0-9]{16}$/;
                if (!cardRegex.test(numarCuratat)) {
                    textEroareCard.style.display = 'block';
                    inputCard.style.borderColor = 'red'; 
                    cardValid = false;
                } else {
                    textEroareCard.style.display = 'none';
                    inputCard.style.borderColor = '';
                }
            }

            if (inputExp && textEroareExp) {
                const expRegex = /^(0[1-9]|1[0-2])\/?([0-9]{2})$/;
                if (!expRegex.test(inputExp.value.trim())) {
                    textEroareExp.style.display = 'block';
                    inputExp.style.borderColor = 'red';
                    cardValid = false;
                } else {
                    textEroareExp.style.display = 'none';
                    inputExp.style.borderColor = '';
                }
            }

            if (inputCvv && textEroareCvv) {
                const cvvRegex = /^[0-9]{3}$/;
                if (!cvvRegex.test(inputCvv.value.trim())) {
                    textEroareCvv.style.display = 'block';
                    inputCvv.style.borderColor = 'red';
                    cardValid = false;
                } else {
                    textEroareCvv.style.display = 'none';
                    inputCvv.style.borderColor = '';
                }
            }

            if (!cardValid) return;

            const salvatCuSucces = await trimiteRezervareaLaServer('Online cu cardul', 'platita');

            if (salvatCuSucces) {
                if (modalCardForm) modalCardForm.style.display = 'none';
                if (mesajTextSucces) mesajTextSucces.innerText = "Plata a fost procesată cu succes! Rezervarea este confirmată.";
                if (modalSucces) modalSucces.style.display = 'block';
            } else {
                alert("Plata a fost procesată, dar a apărut o problemă la salvarea rezervării.");
            }
        });
    }

    // ==========================================================================
    // REDIRECTIONAREA CĂTRE "CONTUL MEU"
    // ==========================================================================
    function finalizeazaSiRedirectioneaza() {
        window.location.href = 'conectare.html'; 
    }

    if (btnCloseModal) btnCloseModal.addEventListener('click', finalizeazaSiRedirectioneaza);
    if (btnInchideFinal) btnInchideFinal.addEventListener('click', finalizeazaSiRedirectioneaza);


    // ==========================================================================
    // LOGICA PENTRU MODALUL DE "LOGIN NECESAR"
    // ==========================================================================
    const loginModal = document.getElementById('login-modal');
    const btnMergiLogin = document.getElementById('btn-mergi-login');
    const closeLoginModalBtn = document.getElementById('close-login-modal-btn');

    if (btnMergiLogin) {
        btnMergiLogin.addEventListener('click', () => {
            window.location.href = 'conectare.html'; 
        });
    }

    if (closeLoginModalBtn) {
        closeLoginModalBtn.addEventListener('click', () => {
            loginModal.style.display = 'none'; 
        });
    }
});