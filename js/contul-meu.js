 // Logica simplă de comutare între tab-uri
        const btnProgramari = document.getElementById('btn-programari');
        const btnAbonamente = document.getElementById('btn-abonamente');
        const sectiuneProgramari = document.getElementById('sectiune-programari');
        const sectiuneAbonamente = document.getElementById('sectiune-abonamente');

        btnProgramari.addEventListener('click', () => {
            // Arătăm programările
            sectiuneProgramari.style.display = 'block';
            sectiuneAbonamente.style.display = 'none';
            // Schimbăm aspectul butonului activ
            btnProgramari.classList.add('activ');
            btnAbonamente.classList.remove('activ');
        });

        btnAbonamente.addEventListener('click', () => {
            // Arătăm abonamentele
            sectiuneAbonamente.style.display = 'block';
            sectiuneProgramari.style.display = 'none';
            // Schimbăm aspectul butonului activ
            btnAbonamente.classList.add('activ');
            btnProgramari.classList.remove('activ');
        });

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