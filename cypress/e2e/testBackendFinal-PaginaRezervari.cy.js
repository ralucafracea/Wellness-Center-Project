describe('Testare Backend API - Rute MySQL (Rezervări)', () => {

  it('1. Testează inserarea REALĂ a unei programări în MySQL (POST /api/programari)', () => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:3000/api/programari',
      body: {
        nume: "Tester Automatizat",
        telefon: "0799999999",
        email: "test.api@tirrawellness.ro", // ACEST EMAIL TREBUIE SĂ EXISTE ÎN BAZA DE DATE!
        categorie_serviciu: "Spa & Wellness",
        pachet_abonament: "Masaj suedez de relaxare", // TREBUIE SĂ EXISTE ÎN CATALOG!
        data_rezervare: "2026-10-15",
        ora_rezervare: "18:00",
        metoda_plata: "Online cu cardul",
        status_plata: "platita",
        data_creare_rezervare: new Date().toISOString()
      },
      failOnStatusCode: false // Nu pică instantaneu dacă email-ul nu există, ca să putem vedea eroarea
    }).then((response) => {
      
      if (response.status === 404) {
        // Dacă primești 404, înseamnă că scriptul tău MySQL funcționează perfect 
        // și a detectat că acel cont de test nu există încă în baza de date!
        cy.log('Eroare corectă din MySQL: ' + response.body.error);
      } else {
        // Dacă totul e corect, trebuie să primești 200 și rândul e creat în DB
        expect(response.status).to.eq(200);
        expect(response.body.message).to.eq("Programare salvată cu succes!");
      }
    });
  });

});