describe('Testare Backend API - Rute MySQL (Autentificare & Înregistrare)', () => {

  // Generăm un timestamp pentru a avea un email UNIC la fiecare rulare a testului.
  // Altfel, MySQL va respinge testul la a doua rulare cu "Email deja folosit".
  const timestamp = new Date().getTime();
  const userTest = {
    nume: "Robot API Tester",
    telefon: "0799999999",
    email: `api_tester_${timestamp}@tirrawellness.ro`,
    parola: "ParolaBackend123!"
  };

  it('1. POST /api/register - Înregistrarea unui cont nou (Happy Path)', () => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:3000/api/register',
      body: userTest
    }).then((response) => {
      // Verificăm dacă serverul a răspuns cu succes
      expect(response.status).to.eq(200);
      expect(response.body.success).to.be.true;
      
      // Verificăm dacă mesajul este exact cel din server.js
      expect(response.body.message).to.eq('Cont creat cu succes!');
    });
  });

  it('2. POST /api/register - Respingerea unui email duplicat (Securitate)', () => {
    // Încercăm să înregistrăm exact același utilizator creat la Pasul 1
    cy.request({
      method: 'POST',
      url: 'http://localhost:3000/api/register',
      body: userTest,
      failOnStatusCode: false // Îi spunem lui Cypress să NU pice testul la erori 4xx, pentru că noi fix asta testăm
    }).then((response) => {
      // MySQL ar trebui să blocheze inserarea și server.js să returneze 400 Bad Request
      expect(response.status).to.eq(400);
      expect(response.body.success).to.be.false;
      expect(response.body.message).to.eq('Acest email este deja folosit!');
    });
  });

  it('3. POST /api/login - Conectare reușită (Happy Path)', () => {
    // Ne conectăm cu adresa de email și parola de la Pasul 1
    cy.request({
      method: 'POST',
      url: 'http://localhost:3000/api/login',
      body: {
        email: userTest.email,
        parola: userTest.parola
      }
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.success).to.be.true;
      expect(response.body.message).to.eq('Te-ai conectat cu succes!');
      
      // Verificăm dacă serverul returnează corect obiectul utilizatorului (fără parolă)
      expect(response.body.utilizator).to.have.property('id');
      expect(response.body.utilizator.nume).to.eq('Robot API Tester');
      expect(response.body.utilizator.rol).to.eq('client'); // Baza de date atribuie rolul 'client' automat
    });
  });

  it('4. POST /api/login - Respingere conectare cu parolă greșită (Securitate)', () => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:3000/api/login',
      body: {
        email: userTest.email,
        parola: 'O_Parola_Gresita_Intentionat'
      },
      failOnStatusCode: false
    }).then((response) => {
      // Server.js trebuie să returneze 401 Unauthorized la parole greșite
      expect(response.status).to.eq(401);
      expect(response.body.success).to.be.false;
      expect(response.body.message).to.eq('Email sau parolă incorectă!');
    });
  });

  it('5. POST /api/login - Respingere conectare cu email inexistent (Securitate)', () => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:3000/api/login',
      body: {
        email: 'email_fals_care_nu_exista_in_db@tirra.ro',
        parola: 'OricareParola123'
      },
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(401);
      expect(response.body.success).to.be.false;
      expect(response.body.message).to.eq('Email sau parolă incorectă!');
    });
  });

});