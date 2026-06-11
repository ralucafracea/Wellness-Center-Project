describe('Testare Backend API - Rute de Autentificare (Node.js)', () => {

  // Generăm un identificator unic bazat pe ora curentă (timestamp)
  // Facem asta pentru ca la fiecare rulare a testului să avem un email nou, 
  // altfel backend-ul ar da eroare de "email deja folosit" după prima rulare.
  const timestamp = new Date().getTime();
  const userTest = {
    nume: 'Automatizare Backend',
    email: `api_test_${timestamp}@tirra.ro`, 
    telefon: '0799999999',
    parola: 'parolaAPI123'
  };

  it('1. Testează crearea unui cont nou (POST /api/register)', () => {
    // cy.request ocolește interfața grafică și lovește direct serverul Node.js
    cy.request({
      method: 'POST',
      url: 'http://localhost:3000/api/register',
      body: userTest
    }).then((response) => {
      // Verificăm statusul HTTP
      expect(response.status).to.eq(200);
      
      // Verificăm structura JSON-ului returnat de server.js
      expect(response.body.success).to.be.true;
      expect(response.body.message).to.eq('Cont creat cu succes!');
    });
  });

  it('2. Testează validarea de email duplicat (POST /api/register)', () => {
    // Trimitem EXACT același user de mai sus pentru a doua oară
    cy.request({
      method: 'POST',
      url: 'http://localhost:3000/api/register',
      body: userTest,
      // SPILUL AICI: Cypress pică automat testele dacă serverul întoarce o eroare 400.
      // Noi îi spunem să NU pice testul, pentru că noi vrem intenționat să testăm acea eroare!
      failOnStatusCode: false 
    }).then((response) => {
      // Trebuie să ne întoarcă eroare 400 (Bad Request) setată de tine în server.js
      expect(response.status).to.eq(400);
      expect(response.body.success).to.be.false;
      expect(response.body.message).to.eq('Acest email este deja folosit!');
    });
  });

  it('3. Testează autentificarea cu succes (POST /api/login)', () => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:3000/api/login',
      body: {
        email: userTest.email, // Folosim adresa cu care ne-am înregistrat la Testul 1
        parola: userTest.parola
      }
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.success).to.be.true;
      
      // Verificăm dacă backend-ul a returnat corect obiectul utilizatorului
      expect(response.body.utilizator).to.have.property('id');
      expect(response.body.utilizator.nume).to.eq('Automatizare Backend');
      expect(response.body.utilizator.rol).to.eq('client'); // Verificăm logica de alocare a rolului
    });
  });

  it('4. Testează autentificarea eșuată - parolă greșită (POST /api/login)', () => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:3000/api/login',
      body: {
        email: userTest.email,
        parola: 'ParolaHackeri999' // Parolă greșită intenționat
      },
      failOnStatusCode: false // Din nou, îi spunem să accepte erorile HTTP ca făcând parte din test
    }).then((response) => {
      // 401 înseamnă "Unauthorized"
      expect(response.status).to.eq(401); 
      expect(response.body.success).to.be.false;
      expect(response.body.message).to.eq('Email sau parolă incorectă!');
    });
  });

});