document.addEventListener('DOMContentLoaded', function() {
    
    // Păstrăm constantele tale exact așa cum erau
    const hamburger = document.getElementById('hamburger-btn');
    const mobileNav = document.getElementById('mobile-nav');
    const closeBtn = document.querySelector('.buton-inchidere'); 

    // Deschide meniul la click pe hamburger (folosind variabila 'hamburger')
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

});

// Funcție pentru a încărca dinamic tratamentele SPA din baza de date
async function incarcaTratamenteSpa() {
    try {
        // 1. Cerem toate serviciile de la server
        const response = await fetch('http://localhost:3000/api/servicii');
        const toateServiciile = await response.json();

        // 2. Le păstrăm DOAR pe cele din categoria 'spa'
        const tratamenteSpa = toateServiciile.filter(s => s.categorie === 'spa');

        // 3. Găsim containerul gol din HTML
        const containerSpa = document.getElementById('lista-tratamente-spa');
        containerSpa.innerHTML = ''; // Ne asigurăm că e gol

        // 4. Construim cardurile exact cu designul tău
        tratamenteSpa.forEach(tratament => {
            const card = document.createElement('div');
            card.className = 'static-card';

            card.innerHTML = `
                <div class="card-top">
                    <h3 class="card-title">${tratament.nume}</h3>
                    <span class="card-price">${tratament.pret} RON</span>
                </div>
                <p class="card-duration">${tratament.durata_minute} MIN</p>
                <p class="card-desc">${tratament.descriere}</p>
            `;

            containerSpa.appendChild(card);
        });

    } catch (eroare) {
        console.error('Eroare la încărcarea tratamentelor SPA:', eroare);
    }
}

// Apelăm funcția când se deschide pagina
document.addEventListener('DOMContentLoaded', () => {
    incarcaTratamenteSpa();
});