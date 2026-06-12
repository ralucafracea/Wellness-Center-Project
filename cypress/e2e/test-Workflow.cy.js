describe('Testare Backend API - Fluxul Suprem (Viața unui utilizator de la A la Z)', () => {

  // Definim variabilele globale pentru această sesiune
  const timestamp = new Date().getTime();
  const clientTirra = {
    nume: "Sesiune Suprema",
    email: `suprem_${timestamp}@tirrawellness.ro`,
    telefon: "0755555555",
    parola: "ParolaDeTop123!"
  };
  
  // Aici vom stoca ID-ul după ce ne logăm
  let idSesiuneCurenta = null;

  it('Pasul 1: Clientul își creează un cont nou (POST /api/register)', () => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:3000/api/register',
      body: clientTirra
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.message).to.eq('Cont creat cu succes!');
    });
  });

  it('Pasul 2: Clientul se conectează pentru a intra în sesiune (POST /api/login)', () => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:3000/api/login',
      body: {
        email: clientTirra.email,
        parola: clientTirra.parola
      }
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.success).to.be.true;
      
      // Extragem ID-ul și îl salvăm pentru restul pașilor
      idSesiuneCurenta = response.body.utilizator.id;
      cy.log(`🔑 ID extras din MySQL: ${idSesiuneCurenta}`);
    });
  });

  it('Pasul 3: Clientul trimite o întrebare prin formularul de contact (POST /api/contact)', () => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:3000/api/contact',
      body: {
        nume: clientTirra.nume,
        email: clientTirra.email,
        subiect: "Întrebare pachet relaxare",
        mesaj: "Bună ziua, trebuie să aduc prosop pentru masajul suedez?",
        data_trimitere: new Date().toISOString()
      }
    }).then((response) => {
      expect(response.status).to.eq(200);
      // Validăm că serverul a scris cu succes în tabelul mesaje_contact
      expect(response.body.message).to.contain("salvat cu succes"); 
    });
  });

  it('Pasul 4: Clientul se hotărăște și face o rezervare (POST /api/programari)', () => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:3000/api/programari',
      body: {
        nume: clientTirra.nume,
        telefon: clientTirra.telefon,
        email: clientTirra.email, 
        categorie_serviciu: "spa",
        // Pachetul de mai jos trebuie să existe în `catalog_servicii`!
        pachet_abonament: "Masaj suedez de relaxare", 
        data_rezervare: "2026-09-10",
        ora_rezervare: "12:00",
        metoda_plata: "Online cu cardul",
        status_plata: "platita",
        data_creare_rezervare: new Date().toISOString()
      }
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.message).to.eq("Programare salvată cu succes!");
    });
  });

  it('Pasul 5: Clientul își verifică Dashboard-ul pentru a vedea rezervarea (GET /api/programari-client)', () => {
    // Cerem serverului datele DOAR pentru ID-ul capturat la Pasul 2
    cy.request({
      method: 'GET',
      url: `http://localhost:3000/api/programari-client/${idSesiuneCurenta}`
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.success).to.be.true;

      // Verificăm dacă programarea făcută la Pasul 4 a ajuns unde trebuie
      const programari = response.body.programari;
      expect(programari).to.be.an('array').that.has.lengthOf(1);

      // Verificăm detaliile pentru a ne asigura că JOIN-ul SQL nu a pierdut date pe drum
      expect(programari[0].nume_serviciu).to.eq("Masaj suedez de relaxare");
      expect(programari[0].status).to.eq("platita");
      
      cy.log('🏆 Fluxul suprem a fost rulat cu succes! Toate modulele comunică perfect.');
    });
  });

});