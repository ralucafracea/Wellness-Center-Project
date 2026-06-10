// --------------- INCARCARE PACHETE COMBINATE DIN BAZA DE DATE (CATALOG) -------------------------

async function incarcaPacheteAmasa() {
    const container = document.getElementById('container-pachete');
    if (!container) return; // Daca nu suntem pe pagina principala, ne oprim

    try {
        const raspuns = await fetch('http://localhost:3000/api/pachete-combinate');
        const date = await raspuns.json();

        if (date.success) {
            container.innerHTML = ''; // Stergem textul "Se incarca..."

            // Daca nu exista niciun pachet "combinat" in JSON
            if (date.pachete.length === 0) {
                container.innerHTML = `<p style="color: var(--color-primary);">Momentan nu avem pachete promoționale.</p>`;
                return;
            }

            // Generam dinamic fiecare card
            date.pachete.forEach(pachet => {
                // Dacă e programare afișăm minutele, dacă e abonament afișăm zilele
                const durataText = pachet.durata_minute ? `${pachet.durata_minute} MIN` : `${pachet.zile_valabilitate} ZILE`;
                
                const cardHtml = `
                    <div class="card-pret">
                        <span class="durata-pachet">${durataText}</span>
                        <h3 class="titlu-pachet">${pachet.nume.toUpperCase()}</h3>
                        
                        <p class="lista-pachet" style="padding-left: 0; line-height: 1.5;">${pachet.descriere}</p>
                        
                        <div class="footer-card">
                            <span class="pret-pachet">${pachet.pret} RON</span>
                            <a href="pages/rezervari.html" class="buton-mic">Rezervă</a>
                        </div>
                    </div>
                `;
                container.innerHTML += cardHtml;
            });
        }
    } catch (eroare) {
        console.error("Eroare la aducerea pachetelor:", eroare);
        container.innerHTML = `<p style="color: red;">Nu s-au putut încărca pachetele. Verificați conexiunea.</p>`;
    }
}

// Apelam functia automat
incarcaPacheteAmasa();

        // --------------------------------LOGICA PENTRU RECENZII---------------------------
        let indexCurent = 0; // incepem cu prima recenzie
        const slideuri = document.querySelectorAll('.slide-recenzie');
        const btnStanga = document.querySelector('.sageata-stanga');
        const btnDreapta = document.querySelector('.sageata-dreapta');

        function arataRecenzia(index) {
            slideuri.forEach(slide => slide.classList.remove('activa'));
            slideuri[index].classList.add('activa');
            // sageata stanga, care dispare daca suntem la prima recenzie:
            if (index === 0) {
                btnStanga.style.visibility = 'hidden';
            } else {
                btnStanga.style.visibility = 'visible';
            }
            // sageata dreapta, dispare daca suntem la ultima recenzie:
            if (index === (slideuri.length - 1)) {
                btnDreapta.style.visibility = 'hidden';
            } else {
                btnDreapta.style.visibility = 'visible';
            }
        }
        // cand apesi pe o sageata sa apeleaza functia asta:
        function schimbaRecenzia(directie) {
            indexCurent += directie;
            arataRecenzia(indexCurent);
        }
        // sa apara prima recenzie by default:
        arataRecenzia(indexCurent);

        // -------------------------- LOGICA PENTRU MENIU --------------------------------
        const meniuNavigatie = document.querySelector('.meniu-navigatie');
        const btnHamburger = document.querySelector('.buton-hamburger');
        const btnInchidere = document.querySelector('.buton-inchidere');
        const linkuriMeniu = document.querySelectorAll('.meniu-navigatie a');

        // deshide meniu la apasare hamburger
        btnHamburger.addEventListener('click', () => {
            meniuNavigatie.classList.add('deschis');
            btnHamburger.style.display = 'none';     
            btnInchidere.style.display = 'block';
        });

        // inchide meniul din butonul X
        btnInchidere.addEventListener('click', () => {
            meniuNavigatie.classList.remove('deschis');
            btnInchidere.style.display = 'none';     
            btnHamburger.style.display = 'flex';
        });

        // inchide meniul cand dau click pe linkuri
        linkuriMeniu.forEach(link => {
            link.addEventListener('click', () => {
                meniuNavigatie.classList.remove('deschis');
            });
        });