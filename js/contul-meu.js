// ==============================================================================
// PROTECTIE PAGINA SI INCARCARE DATE UTILIZATOR
// ==============================================================================

// Citim datele salvate în browser (localStorage)
const idUtilizator = localStorage.getItem('id_utilizator');
const numeUtilizator = localStorage.getItem('nume_utilizator');

// Dacă nu există ID înseamnă că nu s-a logat -> îl dăm afară pe pagina de conectare
if (!idUtilizator) {
    window.location.href = 'conectare.html';
} else {
    document.getElementById('salut-utilizator').textContent = `Bună, ${numeUtilizator}!`;
}

// ==============================================================================
// FETCH: ADUCEREA PROGRAMARILOR REALE
// ==============================================================================
async function incarcaProgramari() {
    const containerProgramari = document.getElementById('sectiune-programari');
    
    try {
        const raspuns = await fetch(`http://localhost:3000/api/programari-client/${idUtilizator}`);
        const date = await raspuns.json();

        if (date.success) {
            if (date.programari.length === 0) {
                containerProgramari.innerHTML = `<p class="descriere-autentificare" style="text-align: center; margin-top: 20px;">Nu aveți nicio programare activă în acest moment.</p>`;
                return;
            }

            containerProgramari.innerHTML = '';

            date.programari.forEach(programare => {
                const statusText = programare.status || 'confirmat';
                // Facem prima literă mare pentru design
                const statusFormatat = statusText.charAt(0).toUpperCase() + statusText.slice(1);
                
                // 1. Formatam data
                const dataObiect = new Date(programare.data);
                const dataFormatata = dataObiect.toLocaleDateString('ro-RO', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                });

                // 2. Formatam ora
                let oraFormatata = programare.ora;
                if (oraFormatata && oraFormatata.length >= 5) {
                    oraFormatata = oraFormatata.substring(0, 5);
                }

                const cardHtml = `
                    <div class="card-item">
                        <div class="card-header">
                            <h3 class="card-titlu">${programare.nume_serviciu}</h3>
                            <span class="badge-status">${statusFormatat}</span>
                        </div>
                        <div class="card-body">
                            <div class="detaliu-rand">
                                <span class="detaliu-label">DATA</span>
                                <span class="detaliu-valoare">${dataFormatata}</span> 
                            </div>
                            <div class="detaliu-rand">
                                <span class="detaliu-label">ORA</span>
                                <span class="detaliu-valoare">${oraFormatata}</span>
                            </div>
                        </div>
                    </div>
                `;
                containerProgramari.innerHTML += cardHtml;
            });
        }
    } catch (eroare) {
        console.error("Eroare la încărcarea programărilor:", eroare);
        containerProgramari.innerHTML = `<p style="color: red; text-align: center;">Nu s-au putut încărca programările.</p>`;
    }
}

incarcaProgramari();

// ==============================================================================
// LOGICA PENTRU LOGOUT (DECONECTARE)
// ==============================================================================
const btnDeconectare = document.getElementById('buton-deconectare');
if (btnDeconectare) {
    btnDeconectare.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Stergem absolut tot din memorie
        localStorage.clear();

        window.location.href = 'conectare.html';
    });
}

// ==============================================================================
// LOGICA DE MENIU SI TAB-URI
// ==============================================================================
const btnProgramari = document.getElementById('btn-programari');
const btnAbonamente = document.getElementById('btn-abonamente');
const sectiuneProgramari = document.getElementById('sectiune-programari');
const sectiuneAbonamente = document.getElementById('sectiune-abonamente');

btnProgramari.addEventListener('click', () => {
    sectiuneProgramari.style.display = 'block';
    sectiuneAbonamente.style.display = 'none';
    btnProgramari.classList.add('activ');
    btnAbonamente.classList.remove('activ');
});

btnAbonamente.addEventListener('click', () => {
    sectiuneAbonamente.style.display = 'block';
    sectiuneProgramari.style.display = 'none';
    btnAbonamente.classList.add('activ');
    btnProgramari.classList.remove('activ');
});

const meniuNavigatie = document.querySelector('.meniu-navigatie');
const btnHamburger = document.querySelector('.buton-hamburger');
const btnInchidere = document.querySelector('.buton-inchidere');
const linkuriMeniu = document.querySelectorAll('.meniu-navigatie a');

btnHamburger.addEventListener('click', () => {
    meniuNavigatie.classList.add('deschis');
    btnHamburger.style.display = 'none';     
    btnInchidere.style.display = 'block';
});

btnInchidere.addEventListener('click', () => {
    meniuNavigatie.classList.remove('deschis');
    btnInchidere.style.display = 'none';     
    btnHamburger.style.display = 'flex';
});

linkuriMeniu.forEach(link => {
    link.addEventListener('click', () => {
        meniuNavigatie.classList.remove('deschis');
    });
});