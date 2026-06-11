describe('Testare Frontend - Pagina Conectare/Înregistrare (Tirra Wellness)', () => {

  beforeEach(() => {
    // Setează dimensiunea de telefon
    cy.viewport(390, 844);
    
    // Înainte de fiecare test, golim memoria ca să nu ne arunce protecția automată din pagină
    cy.clearLocalStorage();
    
    // Folosim onBeforeLoad ca o practică bună de securizare
    cy.visit('pages/conectare.html', {
      onBeforeLoad: (win) => {
        win.localStorage.clear();
      }
    });
  });

  it('1. Testează Paznicul de Redirecționare Automată', () => {
    // Simulăm că un utilizator (Client) este deja logat în memorie
    cy.window().then((win) => {
      win.localStorage.setItem('id_utilizator', '1');
      win.localStorage.setItem('rol_utilizator', 'client');
    });

    // Vizităm pagina de conectare. Deoarece idSesiune există, scriptul tău trebuie să îl arunce afară instant
    cy.visit('pages/conectare.html');
    
    // Verificăm dacă URL-ul s-a schimbat în contul-meu.html
    cy.url().should('include', 'contul-meu.html');

    // Acum simulăm că este un Admin
    cy.window().then((win) => {
      win.localStorage.setItem('rol_utilizator', 'admin');
    });

    cy.visit('pages/conectare.html');
    cy.url().should('include', 'admin.html');
  });

  it('2. Testează comutarea între formulare', () => {
    cy.get('#box-login').should('be.visible');
    cy.get('#box-register').should('not.be.visible');

    cy.get('#mergi-la-register').click();
    cy.get('#box-login').should('not.be.visible');
    cy.get('#box-register').should('be.visible');

    cy.get('#mergi-la-login').click();
    cy.get('#box-register').should('not.be.visible');
    cy.get('#box-login').should('be.visible');
  });

  it('3. Validare Negativă Înregistrare (Modal de Eroare Customizat)', () => {
    // Trecem pe panoul de register
    cy.get('#mergi-la-register').click();

    // INTERCEPTĂM cererea de register și forțăm o eroare 400 (ex: Email deja folosit)
    cy.intercept('POST', 'http://localhost:3000/api/register', { 
      statusCode: 400, 
      body: { success: false, message: 'Acest email este deja folosit!' } 
    }).as('eroareRegister');

    // Completăm date valide ca să trecem de validările tale Regex din JS
    cy.get('#nume-register').type('Utilizator Test');
    cy.get('#telefon-register').type('0711111111');
    cy.get('#email-register').type('deja.folosit@tirra.ro');
    cy.get('#parola-register').type('parola123');

    cy.get('#formular-inregistrare .buton-principal-autentificare').click();

    cy.wait('@eroareRegister');

    // VERIFICĂM Noul Modal de Eroare pe care l-ai creat
    cy.get('#eroare-modal').should('be.visible');
    cy.get('#mesaj-eroare-modal').should('have.text', 'Acest email este deja folosit!');

    // Testăm închiderea modalului
    cy.get('#btn-ok-eroare').click();
    cy.get('#eroare-modal').should('not.be.visible');
  });

  it('4. Happy Path: Creare Cont (Modal de Succes Customizat)', () => {
    cy.get('#mergi-la-register').click();

    // Forțăm serverul să răspundă cu succes 200
    cy.intercept('POST', 'http://localhost:3000/api/register', { 
      statusCode: 200, 
      body: { success: true, message: 'Cont creat cu succes!' } 
    }).as('succesRegister');

    cy.get('#nume-register').type('Client Nou');
    cy.get('#telefon-register').type('0722222222');
    cy.get('#email-register').type('client.nou@tirra.ro');
    cy.get('#parola-register').type('parolaSigura!');

    cy.get('#formular-inregistrare .buton-principal-autentificare').click();

    cy.wait('@succesRegister');

    // VERIFICĂM Noul Modal de Succes creat de tine
    cy.get('#succes-modal').should('be.visible');
    cy.get('#mesaj-succes-modal').should('have.text', 'Cont creat cu succes!');

    // Când apasă "Mergi la Autentificare", scriptul tău trebuie să curețe tot și să îl mute pe Login
    cy.get('#btn-ok-succes').click();
    
    // Verificăm mutarea
    cy.get('#succes-modal').should('not.be.visible');
    cy.get('#box-register').should('not.be.visible');
    cy.get('#box-login').should('be.visible');

    // Verificăm golirea casetelor
    cy.get('#nume-register').should('have.value', '');
  });

  it('5. Happy Path: Autentificare (Salvare Sesiune și Redirecționare)', () => {
    cy.get('#box-login').should('be.visible');

    // Forțăm o autentificare cu succes returnând datele unui utilizator "Client"
    cy.intercept('POST', 'http://localhost:3000/api/login', { 
      statusCode: 200, 
      body: { 
        success: true, 
        message: 'Te-ai conectat cu succes!',
        utilizator: { id: 99, nume: "Andreea", email: "andreea@test.ro", rol: "client" }
      } 
    }).as('succesLogin');

    cy.get('#email-login').type('andreea@test.ro');
    cy.get('#parola-login').type('parola123');

    cy.get('#formular-login .buton-principal-autentificare').click();

    cy.wait('@succesLogin');

    // Verificăm dacă informațiile de sesiune au fost salvate fizic în LocalStorage
    cy.window().then((win) => {
      expect(win.localStorage.getItem('id_utilizator')).to.eq('99');
      expect(win.localStorage.getItem('rol_utilizator')).to.eq('client');
    });

    // Verificăm dacă funcția window.location.href l-a aruncat în Contul Meu
    cy.url().should('include', 'contul-meu.html');
  });

});