describe('Testare Backend API - Rute MySQL (Contact)', () => {

  it('1. Testează inserarea REALĂ a unui mesaj de contact în MySQL (POST /api/contact)', () => {
    // Ocolim complet interfața și trimitem un pachet de date exact cum face funcția ta fetch()
    cy.request({
      method: 'POST',
      url: 'http://localhost:3000/api/contact',
      body: {
        nume: "Robot Automatizare",
        email: "robot.qa@tirrawellness.ro",
        subiect: "Testare Integrare API",
        mesaj: "Acest mesaj a fost generat automat de suita de teste Cypress pentru a valida ruta de backend.",
        data_trimitere: new Date().toISOString()
      }
    }).then((response) => {
      // Dacă conexiunea cu baza de date Aiven e reușită, ar trebui să primim status 200
      expect(response.status).to.eq(200);
      
      // Verificăm exact mesajul text setat de tine în server.js
      expect(response.body.message).to.eq('Mesaj contact salvat cu succes pe structura corectă!');
    });
  });

});