 // ---------------------------- SELECTORI ELEMENTE ---------------------------------
        const boxLogin = document.getElementById('box-login');
        const boxRegister = document.getElementById('box-register');
        const laRegister = document.getElementById('mergi-la-register');
        const laLogin = document.getElementById('mergi-la-login');
        
        const formLogin = document.getElementById('formular-login');
        const formInregistrare = document.getElementById('formular-inregistrare');

        // Expresii regulate (Reguli)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
        const telefonRegex = /^0[0-9]{9}$/; // Începe cu 0 și are fix 10 cifre

        // ---------------------------- CURĂȚARE ERORI (PENTRU BUTONUL BACK) ----------------
        window.addEventListener('pageshow', () => {
            // Ascundem textele roșii
            document.getElementById('eroare-email-login').style.display = 'none';
            document.getElementById('eroare-nume-register').style.display = 'none';
            document.getElementById('eroare-telefon-register').style.display = 'none';
            document.getElementById('eroare-email-register').style.display = 'none';
            document.getElementById('eroare-parola-register').style.display = 'none';
            
            // Scoatem conturul roșu de pe casete
            document.getElementById('email-login').classList.remove('input-eroare');
            document.getElementById('nume-register').classList.remove('input-eroare');
            document.getElementById('telefon-register').classList.remove('input-eroare');
            document.getElementById('email-register').classList.remove('input-eroare');
            document.getElementById('parola-register').classList.remove('input-eroare');
        });

        // ---------------------------- COMUTARE ÎNTRE LOGIN ȘI REGISTER -------------------
        laRegister.addEventListener('click', (e) => {
            e.preventDefault();
            boxLogin.style.display = 'none';
            boxRegister.style.display = 'block';
            
            // Curățăm erorile de la login dacă renunță și merge la register
            document.getElementById('eroare-email-login').style.display = 'none';
            document.getElementById('email-login').classList.remove('input-eroare');
            document.getElementById('eroare-parola-login').style.display = 'none';
            document.getElementById('parola-login').classList.remove('input-eroare');

            document.getElementById('email-login').value = '';
            document.getElementById('parola-login').value = '';
        });

        laLogin.addEventListener('click', (e) => {
            e.preventDefault();
            boxRegister.style.display = 'none';
            boxLogin.style.display = 'block';
            
            // Curățăm TOATE erorile de la register dacă renunță și merge la login
            document.getElementById('eroare-nume-register').style.display = 'none';
            document.getElementById('eroare-telefon-register').style.display = 'none';
            document.getElementById('eroare-email-register').style.display = 'none';
            document.getElementById('eroare-parola-register').style.display = 'none';
            
            document.getElementById('nume-register').classList.remove('input-eroare');
            document.getElementById('telefon-register').classList.remove('input-eroare');
            document.getElementById('email-register').classList.remove('input-eroare');
            document.getElementById('parola-register').classList.remove('input-eroare');

            // NOU: Golim textul scris în căsuțele de register
            document.getElementById('nume-register').value = '';
            document.getElementById('telefon-register').value = '';
            document.getElementById('email-register').value = '';
            document.getElementById('parola-register').value = '';
        });

        // ---------------------------- VALIDARE LOGIN ---------------------------------
        formLogin.addEventListener('submit', (e) => {
            e.preventDefault(); // Oprim comportamentul nativ
            
            const inputEmail = document.getElementById('email-login');
            const textEroare = document.getElementById('eroare-email-login');
            const inputParola = document.getElementById('parola-login');
            const errParola = document.getElementById('eroare-parola-login');
            let areErori = false;
            // VERIFICARE DACA E GRESIT
            if (!emailRegex.test(inputEmail.value.trim())) {
                textEroare.style.display = 'block';      
                inputEmail.classList.add('input-eroare'); 
                areErori = true;
            } else {
                // Dacă e corect
                textEroare.style.display = 'none';
                inputEmail.classList.remove('input-eroare');
            }
            // 4. Validare Parolă (minim 6 caractere)
            if (inputParola.value.trim().length < 6) {
                errParola.style.display = 'block';
                inputParola.classList.add('input-eroare');
                areErori = true;
            } else {
                errParola.style.display = 'none';
                inputParola.classList.remove('input-eroare');
            }
            if (areErori) {
                return; 
            }
            // REDIRECȚIONĂM către pagina de cont daca totul e ok
            window.location.href = 'contul-meu.html';
            
            inputEmail.value = '';
            inputParola.value = '';
        });

        // ---------------------------- VALIDARE INREGISTRARE (Cele 4 câmpuri) ----------
        formInregistrare.addEventListener('submit', (e) => {
            e.preventDefault(); // Oprim comportamentul nativ
            
            const inputNume = document.getElementById('nume-register');
            const errNume = document.getElementById('eroare-nume-register');
            
            const inputTelefon = document.getElementById('telefon-register');
            const errTelefon = document.getElementById('eroare-telefon-register');
            
            const inputEmail = document.getElementById('email-register');
            const errEmail = document.getElementById('eroare-email-register');
            
            const inputParola = document.getElementById('parola-register');
            const errParola = document.getElementById('eroare-parola-register');

            let areErori = false;

            // 1. Validare Nume
            if (inputNume.value.trim() === '') {
                errNume.style.display = 'block';
                inputNume.classList.add('input-eroare');
                areErori = true;
            } else {
                errNume.style.display = 'none';
                inputNume.classList.remove('input-eroare');
            }

            // 2. Validare Telefon
            if (!telefonRegex.test(inputTelefon.value.trim())) {
                errTelefon.style.display = 'block';
                inputTelefon.classList.add('input-eroare');
                areErori = true;
            } else {
                errTelefon.style.display = 'none';
                inputTelefon.classList.remove('input-eroare');
            }

            // 3. Validare Email
            if (!emailRegex.test(inputEmail.value.trim())) {
                errEmail.style.display = 'block';
                inputEmail.classList.add('input-eroare');
                areErori = true;
            } else {
                errEmail.style.display = 'none';
                inputEmail.classList.remove('input-eroare');
            }

            // 4. Validare Parolă (minim 6 caractere)
            if (inputParola.value.trim().length < 6) {
                errParola.style.display = 'block';
                inputParola.classList.add('input-eroare');
                areErori = true;
            } else {
                errParola.style.display = 'none';
                inputParola.classList.remove('input-eroare');
            }

            // Dacă s-a găsit vreo greșeală, oprim funcția aici!
            if (areErori) {
                return; 
            }

            // Dacă totul e perfect, trecem mai departe:
            alert('Contul a fost creat cu succes! Acum te rugăm să te autentifici.'); 
            boxRegister.style.display = 'none';
            boxLogin.style.display = 'block';
            
            // Golim casetele
            inputNume.value = '';
            inputTelefon.value = '';
            inputEmail.value = '';
            inputParola.value = '';
        });

        // ------------------------------- LOGICA PENTRU MENIU (HAMBURGER) ----------------
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