// ==============================================================================
// 1. PROTECȚIE PAGINĂ ȘI ÎNCĂRCARE DATE UTILIZATOR
// ==============================================================================

// Citim datele salvate în browser (localStorage)
const idUtilizator = localStorage.getItem('id_utilizator');
const numeUtilizator = localStorage.getItem('nume_utilizator');

// Dacă nu există ID înseamnă că nu s-a logat -> îl dăm afară pe pagina de conectare
if (!idUtilizator) {
    window.location.href = 'conectare.html';
} else {
    // Afișăm numele lui real în pagină
    document.getElementById('salut-utilizator').textContent = `Bună, ${numeUtilizator}!`;
}

// ==============================================================================
// 2. FETCH: ADUCEREA PROGRAMĂRILOR REALE
// ==============================================================================
async function incarcaProgramari() {
    const containerProgramari = document.getElementById('sectiune-programari');
    
    try {
        // Facem cerere la ruta noastră nouă, trimițând ID-ul clientului
        const raspuns = await fetch(`http://localhost:3000/api/programari-client/${idUtilizator}`);
        const date = await raspuns.json();

        if (date.success) {
            if (date.programari.length === 0) {
                containerProgramari.innerHTML = `<p class="descriere-autentificare" style="text-align: center; margin-top: 20px;">Nu aveți nicio programare activă în acest moment.</p>`;
                return;
            }

            containerProgramari.innerHTML = ''; // Curățăm containerul

            // Generăm cardurile pentru fiecare programare găsită
            date.programari.forEach(programare => {
                const statusText = programare.status || 'confirmat';
                // Facem prima literă mare pentru design
                const statusFormatat = statusText.charAt(0).toUpperCase() + statusText.slice(1);
                
                const cardHtml = `
                    <div class="card-item">
                        <div class="card-header">
                            <h3 class="card-titlu">${programare.nume_serviciu}</h3>
                            <span class="badge-status">${statusFormatat}</span>
                        </div>
                        <div class="card-body">
                            <div class="detaliu-rand">
                                <span class="detaliu-label">DATA</span>
                                <span class="detaliu-valoare">${programare.data}</span>
                            </div>
                            <div class="detaliu-rand">
                                <span class="detaliu-label">ORA</span>
                                <span class="detaliu-valoare">${programare.ora}</span>
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

// Apelăm funcția ca să se ruleze automat la deschiderea paginii
incarcaProgramari();

// ==============================================================================
// 3. LOGICA PENTRU LOGOUT (DECONECTARE)
// ==============================================================================
const btnDeconectare = document.getElementById('buton-deconectare');
if (btnDeconectare) {
    btnDeconectare.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Ștergem absolut tot din memorie
        localStorage.clear();

        // Îl trimitem înapoi la login
        window.location.href = 'conectare.html';
    });
}

// ==============================================================================
// 4. LOGICA DE MENIU ȘI TAB-URI (RĂMASĂ NESCHIMBATĂ)
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