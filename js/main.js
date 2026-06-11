
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