document.addEventListener('DOMContentLoaded', function() {

    // ==========================================================================
    // A. BARA DE NAVIGARE SCONCRONIZATĂ PENTRU PAGINA DE REZERVĂRI
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

    // 2. Când apeși pe X
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
    // C. LOGICA PENTRU FORMULARUL DE REZERVARE ȘI POP-UP-UL DE PLATĂ
    // ==========================================================================
    const rezervariForm = document.querySelector('.rezervari-form'); 
    const modalOverlay = document.getElementById('payment-modal');
    const btnCloseModal = document.getElementById('close-modal-btn');
    const btnInchideFinal = document.getElementById('btn-inchide-final');
    
    const modalAlegere = document.getElementById('modal-alegere');
    const modalCardForm = document.getElementById('modal-card-form');
    const modalSucces = document.getElementById('modal-succes');
    const mesajTextSucces = document.getElementById('mesaj-text-succes');
    
    const btnCard = document.getElementById('btn-card');
    const btnCash = document.getElementById('btn-cash');
    const btnPlateste = document.getElementById('btn-plateste');

    if (rezervariForm) {
        rezervariForm.addEventListener('submit', (e) => {
            e.preventDefault(); 
            if (modalOverlay) modalOverlay.style.display = 'flex'; 
        });
    }

    if (btnCash) {
        btnCash.addEventListener('click', () => {
            if (modalAlegere) modalAlegere.style.display = 'none';
            if (mesajTextSucces) mesajTextSucces.innerText = "Rezervarea dumneavoastră a fost înregistrată cu succes. Detaliile au fost trimise pe email.";
            if (modalSucces) modalSucces.style.display = 'block';
        });
    }

    if (btnCard) {
        btnCard.addEventListener('click', () => {
            if (modalAlegere) modalAlegere.style.display = 'none';
            if (modalCardForm) modalCardForm.style.display = 'block';
        });
    }

    if (btnPlateste) {
        btnPlateste.addEventListener('click', () => {
            if (modalCardForm) modalCardForm.style.display = 'none';
            if (mesajTextSucces) mesajTextSucces.innerText = "Plata a fost procesată! Rezervarea este confirmată. Vă așteptăm cu drag la locație.";
            if (modalSucces) modalSucces.style.display = 'block';
        });
    }

    function resetAndCloseModal() {
        if (modalOverlay) modalOverlay.style.display = 'none'; 
        if (modalAlegere) modalAlegere.style.display = 'block';
        if (modalCardForm) modalCardForm.style.display = 'none';
        if (modalSucces) modalSucces.style.display = 'none';
        
        if (rezervariForm) {
            rezervariForm.reset();
            if (pachetSelect) {
                pachetSelect.innerHTML = '<option value="" disabled selected>Alege pachetul dorit</option>';
                pachetSelect.disabled = true;
            }
        }
    }

    if (btnCloseModal) btnCloseModal.addEventListener('click', resetAndCloseModal);
    if (btnInchideFinal) btnInchideFinal.addEventListener('click', resetAndCloseModal);

});