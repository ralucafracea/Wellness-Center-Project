describe('Testare Backend API - Rute Contul Meu (Node.js)', () => {

  it('1. Aduce lista de programări cu succes pentru un client valid', () => {
    // Folosim un ID de test (ex: 1). Chiar dacă utilizatorul cu ID 1 nu are programări,
    // serverul trebuie să răspundă cu succes și cu un array (chiar și gol).
    cy.request({
      method: 'GET',
      url: 'http://localhost:3000/api/programari-client/1'
    }).then((response) => {
      // Verificăm dacă serverul a răspuns fără să arunce o eroare internă
      expect(response.status).to.eq(200);
      
      // Verificăm contractul API (structura pe care o așteaptă frontend-ul)
      expect(response.body.success).to.be.true;
      expect(response.body).to.have.property('programari');
      expect(response.body.programari).to.be.an('array');
    });
  });

  it('2. Răspunde elegant la erori (ex: trimitem un ID invalid/litere)', () => {
    cy.request({
      method: 'GET',
      url: 'http://localhost:3000/api/programari-client/TEXT_INVALID',
      // Nu vrem ca Cypress să pice testul dacă Node dă eroare, vrem să verificăm eroarea!
      failOnStatusCode: false 
    }).then((response) => {
      // Deoarece parseInt('TEXT_INVALID') dă NaN, verificăm cum se comportă serverul.
      // Chiar dacă e un scenariu extrem, trebuie să returneze totuși un răspuns formatat
      // sau un array gol, demonstrând că nu "crapă" aplicația Node.js.
      expect(response.status).to.eq(200);
      expect(response.body.programari).to.be.an('array').that.is.empty;
    });
  });

});