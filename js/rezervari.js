document.addEventListener('DOMContentLoaded', function() {

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
                pachetSelect.disabled = false; // Deblocăm lista
                
                pachete[categorieAleasa].forEach(function(pachet) {
                    const optiuneNoua = document.createElement('option');
                    optiuneNoua.value = pachet.value;
                    optiuneNoua.textContent = pachet.text;
                    pachetSelect.appendChild(optiuneNoua);
                });
            }
        });
    }

    const rezervariForm = document.querySelector('.rezervari-form'); 
    
    // Elementele Modalului
    const modalOverlay = document.getElementById('payment-modal');
    const btnCloseModal = document.getElementById('close-modal-btn');
    const btnInchideFinal = document.getElementById('btn-inchide-final');
    
    // Secțiunile din Modal
    const modalAlegere = document.getElementById('modal-alegere');
    const modalCardForm = document.getElementById('modal-card-form');
    const modalSucces = document.getElementById('modal-succes');
    const mesajTextSucces = document.getElementById('mesaj-text-succes');
    
    // Butoanele de plată
    const btnCard = document.getElementById('btn-card');
    const btnCash = document.getElementById('btn-cash');
    const btnPlateste = document.getElementById('btn-plateste');

    // 1. Deschide Modalul când apeși Trimite
    if (rezervariForm) {
        rezervariForm.addEventListener('submit', (e) => {
            e.preventDefault(); 
            modalOverlay.style.display = 'flex'; // Afișăm pop-up-ul
        });
    }

    // 2. Alege CASH
    if (btnCash) {
        btnCash.addEventListener('click', () => {
            modalAlegere.style.display = 'none';
            mesajTextSucces.innerText = "Rezervarea dumneavoastră a fost înregistrată cu succes. Detaliile au fost trimise pe email.";
            modalSucces.style.display = 'block';
        });
    }

    // 3. Alege CARD
    if (btnCard) {
        btnCard.addEventListener('click', () => {
            modalAlegere.style.display = 'none';
            modalCardForm.style.display = 'block';
        });
    }

    // 4. Finalizare plată card
    if (btnPlateste) {
        btnPlateste.addEventListener('click', () => {
            modalCardForm.style.display = 'none';
            mesajTextSucces.innerText = "Plata a fost procesată! Rezervarea este confirmată. Vă așteptăm cu drag la locație.";
            modalSucces.style.display = 'block';
        });
    }

    // 5. FUNCȚIA DE RESET (Închide modalul și curăță pagina automat)
    function resetAndCloseModal() {
        modalOverlay.style.display = 'none'; // Ascunde modalul
        
        // Resetează starea interioară a modalului pentru data viitoare
        modalAlegere.style.display = 'block';
        modalCardForm.style.display = 'none';
        modalSucces.style.display = 'none';
        
        // Curăță formularul principal și blochează lista de pachete
        rezervariForm.reset();
        const pachetSelect = document.getElementById('pachet-select');
        if (pachetSelect) {
            pachetSelect.innerHTML = '<option value="" disabled selected>Alege pachetul dorit</option>';
            pachetSelect.disabled = true;
        }
    }

    // Ascultăm click-urile pe butonul "X" și pe "Înapoi la site"
    if (btnCloseModal) btnCloseModal.addEventListener('click', resetAndCloseModal);
    if (btnInchideFinal) btnInchideFinal.addEventListener('click', resetAndCloseModal);

});