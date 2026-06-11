describe('Testare End-to-End (Frontend + Backend) - Pagina Contact', () => {

  beforeEach(() => {
    cy.viewport(390, 844);
    
    // Revenim la varianta ta curată și corectă!
    cy.visit('pages/contact.html'); 
  });

  it('Testează fluxul complet de trimitere a datelor către serverul Node.js', () => {
    
    // Interceptăm traficul care pleacă din pagina ta către serverul backend de pe portul 3000
    cy.intercept('POST', 'http://localhost:3000/api/contact').as('trimitereCatreServer');

    // Completăm formularul
    cy.get('#contact-name').type('Utilizator E2E');
    cy.get('#contact-email').type('test.automat@tirra.ro');
    cy.get('#contact-subject').type('Testare Integrare Cypress');
    cy.get('#contact-message').type('Verificăm dacă fetch-ul trimite datele corect în JSON.');

    // Apăsăm butonul de trimitere
    cy.get('.contact-form button[type="submit"]').click();

    // Așteptăm ca datele să ajungă la Node.js și verificăm răspunsul
    cy.wait('@trimitereCatreServer').then((interception) => {
      expect(interception.response.statusCode).to.eq(200);
      expect(interception.request.body.email).to.eq('test.automat@tirra.ro');
    });

    // Validăm afișarea modalului de succes
    cy.get('#contact-modal').should('be.visible');
    cy.get('.modal-title').should('have.text', 'Îți mulțumim!');
    
    // Închidem modalul
    cy.get('#btn-inchide-contact').click();
    cy.get('#contact-modal').should('not.be.visible');

    cy.readFile('backend/Data/mock-contact.json').then((mesaje) => {
      
      // Cypress este foarte inteligent și transformă automat fișierul JSON într-un Array
      
      // Extragem ultimul element din listă
      const ultimulMesaj = mesaje[mesaje.length - 1];

      // Verificăm dacă valorile salvate fizic sunt exact cele introduse de robot mai sus
      expect(ultimulMesaj.nume).to.eq('Utilizator E2E');
      expect(ultimulMesaj.email).to.eq('test.automat@tirra.ro');
      expect(ultimulMesaj.subiect).to.eq('Testare Integrare Cypress');
      expect(ultimulMesaj.mesaj).to.eq('Verificăm dacă fetch-ul trimite datele corect în JSON.');
      
    });
    
  });

});