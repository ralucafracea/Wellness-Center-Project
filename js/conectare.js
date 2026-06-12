
// ----------------- PROTECTIE: REDIRECTIONARE AUTOMATA DACA ESTE DEJA LOGAT -----------------

const idSesiune = localStorage.getItem('id_utilizator');
const rolSesiune = localStorage.getItem('rol_utilizator');


if (idSesiune) { // daca gasim un id in memorie
    if (rolSesiune === 'admin') {
        window.location.href = 'admin.html'; 
    } else {
        window.location.href = 'contul-meu.html'; 
    }
}

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

// ------------------------------ LOGICA PENTRU MODALUL DE EROARE ----------------------------
const modalEroare = document.getElementById('eroare-modal');
const textModalEroare = document.getElementById('mesaj-eroare-modal');
const btnInchideModal = document.getElementById('inchide-eroare-modal');
const btnOkEroare = document.getElementById('btn-ok-eroare');

function afiseazaEroarePersonalizata(mesaj) {
    textModalEroare.textContent = mesaj;
    modalEroare.style.display = 'flex';
}

function ascundeModalEroare(e) {
    e.preventDefault();
    modalEroare.style.display = 'none';
}

if (btnInchideModal) btnInchideModal.addEventListener('click', ascundeModalEroare);
if (btnOkEroare) btnOkEroare.addEventListener('click', ascundeModalEroare);

// ---------------------------- LOGICA PENTRU MODALUL DE SUCCES -----------------------
const modalSucces = document.getElementById('succes-modal');
const textModalSucces = document.getElementById('mesaj-succes-modal');
const btnOkSucces = document.getElementById('btn-ok-succes');

// Functia care deschide modalul de succes
function afiseazaSuccesPersonalizat(mesaj) {
    if(textModalSucces && modalSucces) {
        textModalSucces.textContent = mesaj;
        modalSucces.style.display = 'flex';
    }
}

// ---------------------------- GOLIRE ERORI (PT BUTONUL BACK) -----------------------
window.addEventListener('pageshow', () => {
    // Ascundem textele rosii
    document.getElementById('eroare-email-login').style.display = 'none';
    document.getElementById('eroare-nume-register').style.display = 'none';
    document.getElementById('eroare-telefon-register').style.display = 'none';
    document.getElementById('eroare-email-register').style.display = 'none';
    document.getElementById('eroare-parola-register').style.display = 'none';
    
    // Scoatem conturul rosu de pe casete
    document.getElementById('email-login').classList.remove('input-eroare');
    document.getElementById('nume-register').classList.remove('input-eroare');
    document.getElementById('telefon-register').classList.remove('input-eroare');
    document.getElementById('email-register').classList.remove('input-eroare');
    document.getElementById('parola-register').classList.remove('input-eroare');
});

// ---------------------------- COMUTARE INTRE LOGIN SI REGISTER -------------------
laRegister.addEventListener('click', (e) => {
    e.preventDefault();
    boxLogin.style.display = 'none';
    boxRegister.style.display = 'block';
    
    // golim erorile de la login daca renunta si merge la register
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
    
    // Curatam TOATE erorile de la register dacă renunta si merge la login
    document.getElementById('eroare-nume-register').style.display = 'none';
    document.getElementById('eroare-telefon-register').style.display = 'none';
    document.getElementById('eroare-email-register').style.display = 'none';
    document.getElementById('eroare-parola-register').style.display = 'none';
    
    document.getElementById('nume-register').classList.remove('input-eroare');
    document.getElementById('telefon-register').classList.remove('input-eroare');
    document.getElementById('email-register').classList.remove('input-eroare');
    document.getElementById('parola-register').classList.remove('input-eroare');

    // Golim textul scris în casutele de register
    document.getElementById('nume-register').value = '';
    document.getElementById('telefon-register').value = '';
    document.getElementById('email-register').value = '';
    document.getElementById('parola-register').value = '';
});


// ---------------------------- VALIDARE SI TRIMITERE LOGIN ---------------------------------
formLogin.addEventListener('submit', async (e) => {  // async pentru backend
    e.preventDefault(); 
    
    const inputEmail = document.getElementById('email-login');
    const textEroare = document.getElementById('eroare-email-login');
    const inputParola = document.getElementById('parola-login');
    const errParola = document.getElementById('eroare-parola-login');
    let areErori = false;
    
    // Validare Email
    if (!emailRegex.test(inputEmail.value.trim())) {
        textEroare.style.display = 'block';      
        inputEmail.classList.add('input-eroare'); 
        areErori = true;
    } else {
        textEroare.style.display = 'none';
        inputEmail.classList.remove('input-eroare');
    }
    
    // Validare Parola
    if (inputParola.value.trim().length < 6) {
        errParola.style.display = 'block';
        inputParola.classList.add('input-eroare');
        areErori = true;
    } else {
        errParola.style.display = 'none';
        inputParola.classList.remove('input-eroare');
    }

    // Daca sunt erori de completare, ne oprim aici
    if (areErori) {
        return; 
    }

    // ------------------------------- COMUNICAREA CU BACKEND-UL (NODE.JS) ------------------------------------
    try {
        const raspuns = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                email: inputEmail.value.trim(), 
                parola: inputParola.value.trim() 
            })
        });

        const date = await raspuns.json();

        if (date.success) {
            // salvam datele utilizatorului in memoria browserului
            localStorage.setItem('id_utilizator', date.utilizator.id);
            localStorage.setItem('nume_utilizator', date.utilizator.nume);
            localStorage.setItem('email_utilizator', date.utilizator.email);
            localStorage.setItem('rol_utilizator', date.utilizator.rol);
            localStorage.setItem('telefon_utilizator', date.utilizator.telefon);

            //alert(date.message); // mesaj de succes (o sa sterg asta dupa ce e totul ok)
            if (date.utilizator.rol === 'admin') {
                window.location.href = 'admin.html';
            } else {
                window.location.href = 'contul-meu.html'; 
            }
        } else {
            // daca emailul sau parola au fost gresite
            //alert(date.message);
            afiseazaEroarePersonalizata(date.message);
        }
    } catch (eroare) {
        console.error('Eroare de rețea:', eroare);
        alert('Eroare de conexiune la server. Te rugăm să încerci mai târziu.');
    }
});


// ---------------------------- VALIDARE SI TRIMITERE INREGISTRARE -----------------------------

formInregistrare.addEventListener('submit', async (e) => { // async pt backend
    e.preventDefault(); 
    
    const inputNume = document.getElementById('nume-register');
    const errNume = document.getElementById('eroare-nume-register');
    const inputTelefon = document.getElementById('telefon-register');
    const errTelefon = document.getElementById('eroare-telefon-register');
    const inputEmail = document.getElementById('email-register');
    const errEmail = document.getElementById('eroare-email-register');
    const inputParola = document.getElementById('parola-register');
    const errParola = document.getElementById('eroare-parola-register');

    let areErori = false;

    // Validare Nume
    if (inputNume.value.trim() === '') {
        errNume.style.display = 'block';
        inputNume.classList.add('input-eroare');
        areErori = true;
    } else {
        errNume.style.display = 'none';
        inputNume.classList.remove('input-eroare');
    }

    // Validare Telefon
    if (!telefonRegex.test(inputTelefon.value.trim())) {
        errTelefon.style.display = 'block';
        inputTelefon.classList.add('input-eroare');
        areErori = true;
    } else {
        errTelefon.style.display = 'none';
        inputTelefon.classList.remove('input-eroare');
    }

    // Validare Email
    if (!emailRegex.test(inputEmail.value.trim())) {
        errEmail.style.display = 'block';
        inputEmail.classList.add('input-eroare');
        areErori = true;
    } else {
        errEmail.style.display = 'none';
        inputEmail.classList.remove('input-eroare');
    }

    // Validare Parola
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

    // ------------------ COMUNICAREA CU BACKEND-UL (NODE.JS) PENTRU CREARE CONT ----------------------
    try {
        const raspuns = await fetch('http://localhost:3000/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                nume: inputNume.value.trim(), 
                telefon: inputTelefon.value.trim(),
                email: inputEmail.value.trim(), 
                parola: inputParola.value.trim() 
            })
        });

        const date = await raspuns.json();

        if (date.success) {
            // apel modal
            afiseazaSuccesPersonalizat(date.message);
            
            // curatam mutam
            if (btnOkSucces) {
                btnOkSucces.addEventListener('click', (e) => {
                    e.preventDefault();
                    modalSucces.style.display = 'none';
                    boxRegister.style.display = 'none';
                    boxLogin.style.display = 'block';
                    inputNume.value = '';
                    inputTelefon.value = '';
                    inputEmail.value = '';
                    inputParola.value = '';
                }, { once: true }); 
            }
        } else {
            // Esec (de ex: Email deja folosit)
            //alert(date.message);
            afiseazaEroarePersonalizata(date.message);
        }
    } catch (eroare) {
        console.error('Eroare de rețea:', eroare);
        alert('Eroare de conexiune la server. Te rugăm să încerci mai târziu.');
    }
});

// ------------------------------- LOGICA PENTRU MENIU (HAMBURGER) ---------------------
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