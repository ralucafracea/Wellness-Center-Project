describe('Testare Frontend - Pagina Conectare/Înregistrare (Tirra Wellness)', () => {

  beforeEach(() => {
    // Păstrăm dimensiunea de iPhone 14
    cy.viewport(390, 844);
    cy.visit('pages/conectare.html');
  });

  it('1. Testează comutarea între Autentificare și Înregistrare', () => {
    // La pornire, formularul de Login trebuie să fie vizibil, iar Register ascuns
    cy.get('#box-login').should('be.visible');
    cy.get('#box-register').should('not.be.visible');

    // Apăsăm pe linkul de creare cont
    cy.get('#mergi-la-register').click();

    // Verificăm dacă s-au inversat
    cy.get('#box-login').should('not.be.visible');
    cy.get('#box-register').should('be.visible');

    // Ne întoarcem la Login
    cy.get('#mergi-la-login').click();
    cy.get('#box-register').should('not.be.visible');
    cy.get('#box-login').should('be.visible');
  });

  it('2. Testează validarea la Autentificare (Scenariu Negativ)', () => {
    // Introducem un email care pică testul Regex (fără @)
    cy.get('#email-login').type('email-gresit.com');
    
    // Apăsăm butonul de submit
    cy.get('#formular-login .buton-principal-autentificare').click();

    // Verificăm dacă JS-ul tău afișează textul de eroare
    cy.get('#eroare-email-login').should('be.visible');
    
    // Verificăm dacă funcția a adăugat clasa pentru conturul roșu
    cy.get('#email-login').should('have.class', 'input-eroare');
  });

  it('2.1 Testează validarea lungimii parolei la Autentificare', () => {
    // Ne asigurăm că suntem pe secțiunea de Login
    cy.get('#box-login').should('be.visible');

    // Introducem un email valid ca să nu pice validarea de email
    cy.get('#email-login').type('utilizator@corect.ro');

    // 1. Introducem o parolă de doar 3 caractere folosind noul ID
    cy.get('#parola-login').type('123');
    
    // Încercăm să trimitem formularul
    cy.get('#formular-login .buton-principal-autentificare').click();

    // VERIFICARE NEGATIVĂ: Trebuie să apară eroarea nouă și conturul roșu
    cy.get('#eroare-parola-login').should('be.visible');
    cy.get('#parola-login').should('have.class', 'input-eroare');

    // 2. REPARARE: Completăm parola până la 6 caractere
    cy.get('#parola-login').type('456');
    
    // Apăsăm din nou pe trimitere
    cy.get('#formular-login .buton-principal-autentificare').click();

    // Robotul ar trebui acum să fie redirecționat automat, deci verificăm dacă URL-ul s-a schimbat
    // Aceasta confirmă că logica de succes din JS (window.location.href) a funcționat
    cy.url().should('include', 'contul-meu.html');
  });

  it('3. Testează validarea completă la Înregistrare (Scenariu Negativ)', () => {
    // Mergem la secțiunea de înregistrare
    cy.get('#mergi-la-register').click();

    // Lăsăm câmpurile goale și apăsăm direct butonul "CREEAZĂ CONT"
    cy.get('#formular-inregistrare .buton-principal-autentificare').click();

    // Toate cele 4 erori ar trebui să fie vizibile simultan
    cy.get('#eroare-nume-register').should('be.visible');
    cy.get('#eroare-telefon-register').should('be.visible');
    cy.get('#eroare-email-register').should('be.visible');
    cy.get('#eroare-parola-register').should('be.visible');

    // Testăm specific validarea telefonului (mai puțin de 10 cifre)
    cy.get('#telefon-register').type('0740123');
    cy.get('#formular-inregistrare .buton-principal-autentificare').click();
    
    // Eroarea de telefon trebuie să rămână activă deoarece nu a respectat Regex-ul
    cy.get('#eroare-telefon-register').should('be.visible');
  });

  it('3.1 Testează validarea lungimii parolei (sub 6 caractere)', () => {
    // Mergem la formularul de înregistrare
    cy.get('#mergi-la-register').click();

    // 1. Introducem o parolă de doar 3 caractere
    cy.get('#parola-register').type('123');
    
    // Încercăm să trimitem formularul
    cy.get('#formular-inregistrare .buton-principal-autentificare').click();

    // VERIFICARE NEGATIVĂ: Trebuie să apară eroarea și conturul roșu
    cy.get('#eroare-parola-register').should('be.visible');
    cy.get('#parola-register').should('have.class', 'input-eroare');

    // 2. REPARARE: Mai adăugăm încă 3 caractere (parola devine '123456')
    cy.get('#parola-register').type('456');
    
    // Apăsăm din nou pe trimitere
    cy.get('#formular-inregistrare .buton-principal-autentificare').click();

    // VERIFICARE POZITIVĂ: Codul tău JS ar trebui acum să ascundă eroarea pentru parolă
    cy.get('#eroare-parola-register').should('not.be.visible');
    cy.get('#parola-register').should('not.have.class', 'input-eroare');
  });

  it('4. Testează fluxul de Înregistrare cu succes (Happy Path)', () => {
    cy.get('#mergi-la-register').click();

    // INTERCEPTARE: Spunem robotului Cypress să intercepteze ferestrele 'alert' din browser
    cy.on('window:alert', (textPopUp) => {
      // Verificăm dacă alerta conține textul scris de tine în JS
      expect(textPopUp).to.contains('Contul a fost creat cu succes!');
    });

    // Completăm date perfect valide care trec de toate verificările
    cy.get('#nume-register').type('Utilizator Test');
    cy.get('#telefon-register').type('0712345678');
    cy.get('#email-register').type('utilizator@test.ro');
    cy.get('#parola-register').type('parolaSigura123');

    // Trimitem formularul
    cy.get('#formular-inregistrare .buton-principal-autentificare').click();

    // După ce se închide alerta, codul tău trebuie să ascundă Register și să arate Login
    cy.get('#box-register').should('not.be.visible');
    cy.get('#box-login').should('be.visible');

    // Verificăm dacă JS-ul a curățat corect caseta de nume pentru următorul utilizator
    cy.get('#nume-register').should('have.value', '');
  });

  it('5. Testează funcționalitatea Meniului Hamburger', () => {
    // Verificăm funcționarea meniului de navigație (codul tău din partea de jos a JS-ului)
    cy.get('.meniu-navigatie').should('not.have.class', 'deschis');

    cy.get('.buton-hamburger').click();
    cy.get('.meniu-navigatie').should('have.class', 'deschis');

    cy.get('.buton-inchidere').should('be.visible').click();
    cy.get('.meniu-navigatie').should('not.have.class', 'deschis');
  });

});