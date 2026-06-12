describe('Testare Backend API - Flux Complet: Cont Nou + 2 Rezervări + Verificare', () => {

  // Generăm un email unic pentru a rula testul de câte ori vrem fără erori de duplicat
  const timestamp = new Date().getTime();
  const userTest = {
    nume: "Robot Automatizare",
    telefon: "0711223344",
    email: `client_nou_${timestamp}@tirrawellness.ro`,
    parola: "ParolaTest123!"
  };

  let idUtilizatorLogat = null;

  it('Pasul 1: Creează un cont nou (POST /api/register)', () => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:3000/api/register',
      body: userTest
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.success).to.be.true;
    });
  });

  it('Pasul 2: Autentificare pentru a extrage ID-ul generat de MySQL (POST /api/login)', () => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:3000/api/login',
      body: {
        email: userTest.email,
        parola: userTest.parola
      }
    }).then((response) => {
      expect(response.status).to.eq(200);
      
      // Salvăm ID-ul real din baza de date pentru a-l folosi la final
      idUtilizatorLogat = response.body.utilizator.id;
      expect(idUtilizatorLogat).to.be.a('number');
    });
  });

  it('Pasul 3: Creează prima rezervare', () => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:3000/api/programari',
      body: {
        nume: userTest.nume,
        telefon: userTest.telefon,
        // Backend-ul tău folosește adresa de email pentru a lega programarea de cont!
        email: userTest.email, 
        categorie_serviciu: "spa",
        // ATENȚIE: Acest serviciu TREBUIE să existe deja în tabelul tău `catalog_servicii`
        pachet_abonament: "Masaj suedez de relaxare", 
        data_rezervare: "2026-08-20",
        ora_rezervare: "10:00",
        metoda_plata: "La recepție",
        status_plata: "neplatita",
        data_creare_rezervare: new Date().toISOString()
      }
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.message).to.eq("Programare salvată cu succes!");
    });
  });

  it('Pasul 4: Creează a doua rezervare (Card)', () => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:3000/api/programari',
      body: {
        nume: userTest.nume,
        telefon: userTest.telefon,
        email: userTest.email,
        categorie_serviciu: "spa",
        pachet_abonament: "Masaj suedez de relaxare", // Folosim același serviciu, altă zi
        data_rezervare: "2026-08-25",
        ora_rezervare: "18:30",
        metoda_plata: "Online cu cardul",
        status_plata: "platita",
        data_creare_rezervare: new Date().toISOString()
      }
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.message).to.eq("Programare salvată cu succes!");
    });
  });

  it('Pasul 5: Verifică dacă MySQL aduce corect ambele programări în Contul Meu', () => {
    // Cerem programările exact pentru ID-ul salvat la Pasul 2
    cy.request({
      method: 'GET',
      url: `http://localhost:3000/api/programari-client/${idUtilizatorLogat}`
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.success).to.be.true;

      // MOMENTUL ADEVĂRULUI: Deoarece e un cont nou, trebuie să aibă EXACT 2 programări
      expect(response.body.programari).to.be.an('array').that.has.lengthOf(2);

      // Verificăm dacă prima programare din array și-a păstrat detaliile (Contractul JOIN)
      expect(response.body.programari[0].nume_serviciu).to.eq("Masaj suedez de relaxare");
      expect(response.body.programari[0].status).to.eq("neplatita"); // Cea de la recepție

      // Verificăm dacă a doua programare și-a păstrat detaliile
      expect(response.body.programari[1].nume_serviciu).to.eq("Masaj suedez de relaxare");
      expect(response.body.programari[1].status).to.eq("platita"); // Cea online
    });
  });

});