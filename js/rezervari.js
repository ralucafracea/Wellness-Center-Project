document.addEventListener('DOMContentLoaded', function() {

    // ==========================================================================
    // A. BARA DE NAVIGARE SINCRONIZATĂ PENTRU PAGINA DE REZERVĂRI
    // ==========================================================================
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

    if(closeBtn && mobileNav && hamburger) {
        closeBtn.addEventListener('click', function() {
            mobileNav.classList.remove('active'); // Ascundem meniul
            closeBtn.style.display = 'none';      // Ascundem X-ul
            hamburger.style.display = 'flex';     // Aducem liniuțele înapoi
        });
    }

    // ==========================================================================
    // B. LOGICA PENTRU LISTELE DERULANTE DINAMICE (Categorii și Pachete)
    // ==========================================================================
    const categorieSelect = document.getElementById('categorie-select');
    const pachetSelect = document.getElementById('pachet-select');

    if (categorieSelect && pachetSelect) {
        const pachete = {
            spa: [
                { value: "suedez", text: "Masaj suedez de relaxare" },
                { value: "terapeutic", text: "Masaj terapeutic profund" },
                { value: "pietre", text: "Masaj cu pietre vulcanice" },
                { value: "aroma", text: "Aromaterapie senzorială" },
                { value: "ritual", text: "Ritual corp complet" }
            ],
            sala: [
                { value: "fitness-1luna", text: "Abonament Fitness - 1 Lună" },
                { value: "fitness-3luni", text: "Abonament Fitness - 3 Luni" },
                { value: "personal-training", text: "Antrenor Personal (10 ședințe)" },
                { value: "grup", text: "Clase de Grup (Aerobic/Yoga)" }
            ]
        };

        categorieSelect.addEventListener('change', function() {
            const categorieAleasa = this.value;
            
            pachetSelect.innerHTML = '<option value="" disabled selected>Alege pachetul dorit...</option>';
            
            if (categorieAleasa && pachete[categorieAleasa]) {
                pachetSelect.disabled = false; 
                
                pachete[categorieAleasa].forEach(function(pachet) {
                    const optiuneNoua = document.createElement('option');
                    optiuneNoua.value = pachet.value;
                    optiuneNoua.textContent = pachet.text;
                    pachetSelect.appendChild(optiuneNoua);
                });
            }
        });
    }

    // ==========================================================================
    // C. LOGICA PENTRU FORMULARUL DE REZERVARE ȘI POP-UP-UL DE PLATĂ (VARIANTĂ CURATĂ)
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

    if (rezervariForm) {
        rezervariForm.addEventListener('submit', (e) => {
            e.preventDefault(); 
            
            let formularValid = true; 
            
            // --- VALIDARE EMAIL ---
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

            // --- VALIDARE TELEFON ---
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

            // Deschidem overlay-ul mare
            if (modalOverlay) modalOverlay.style.display = 'flex'; 

            // RUTELE LOGICE DIRECTE (Fără ecrane intermediare)
            if (actiuneAleasa === 'rezerva') {
                // Afișăm direct succesul pentru plata la recepție
                if (modalCardForm) modalCardForm.style.display = 'none';
                if (mesajTextSucces) mesajTextSucces.innerText = "Rezervarea a fost înregistrată! Detaliile au fost trimise pe email, iar plata se va face la recepție.";
                if (modalSucces) modalSucces.style.display = 'block';

            } else if (actiuneAleasa === 'cumpara') {
                // Afișăm direct formularul de card
                if (modalSucces) modalSucces.style.display = 'none';
                if (modalCardForm) modalCardForm.style.display = 'block'; 
            }
        });
    }

    const inputCard = document.getElementById('card-numar');
    const textEroareCard = document.querySelector('.eroare-card');
    
    const inputExp = document.getElementById('card-expirare');
    const textEroareExp = document.querySelector('.eroare-exp');
    
    const inputCvv = document.getElementById('card-cvv');
    const textEroareCvv = document.querySelector('.eroare-cvv');

    if (btnPlateste) {
        btnPlateste.addEventListener('click', () => {
            let cardValid = true; // Presupunem că e bine inițial

            // 1. Validare Număr Card (trebuie să aibă fix 16 cifre, ignorând spațiile)
            if (inputCard && textEroareCard) {
                const numarCuratat = inputCard.value.replace(/\s+/g, '');
                const cardRegex = /^[0-9]{16}$/;
                if (!cardRegex.test(numarCuratat)) {
                    textEroareCard.style.display = 'block';
                    inputCard.style.borderColor = 'red'; // Colorăm marginea
                    cardValid = false;
                } else {
                    textEroareCard.style.display = 'none';
                    inputCard.style.borderColor = '';
                }
            }

            // 2. Validare Expirare (trebuie să fie în format LL/AA, unde LL este 01-12)
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

            // 3. Validare CVV (trebuie să aibă fix 3 cifre)
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

            // Dacă s-a găsit orice greșeală, ne oprim aici și nu trecem la ecranul de succes
            if (!cardValid) {
                return;
            }

            // Dacă totul e corect, Happy Path -> Salvare ca "plătită"
            if (modalCardForm) modalCardForm.style.display = 'none';
            if (mesajTextSucces) mesajTextSucces.innerText = "Plata a fost procesată cu succes! Rezervarea este confirmată.";
            if (modalSucces) modalSucces.style.display = 'block';
        });
    }

    // ==========================================================================
    // D. REDIRECȚIONAREA CĂTRE "CONTUL MEU" LA ÎNCHIDEREA POP-UP-ULUI
    // ==========================================================================
    function finalizeazaSiRedirectioneaza() {
        window.location.href = 'login.html'; 
    }

    if (btnCloseModal) btnCloseModal.addEventListener('click', finalizeazaSiRedirectioneaza);
    if (btnInchideFinal) btnInchideFinal.addEventListener('click', finalizeazaSiRedirectioneaza);

});