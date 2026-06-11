describe('Testare Frontend - Pagina Rezervări (Conectată la DB)', () => {

  const userMock = { nume: 'Andreea Test', email: 'test@tirrawellness.ro', telefon: '0740123456' };
  
  // Catalog simulat pentru a nu depinde de viteza bazei de date în testele de UI
  const catalogServiciiMock = [
    { id: 1, nume: "Masaj suedez de relaxare", categorie: "spa", tip_achizitie: "programare", zile_valabilitate: null },
    { id: 2, nume: "Abonament Fitness 1 Luna", categorie: "fitness", tip_achizitie: "abonament", zile_valabilitate: 30 }
  ];

  function vizitareCaLogat() {
    cy.intercept('GET', '**/api/servicii', {
      statusCode: 200,
      body: catalogServiciiMock
    }).as('getServicii');

    cy.visit('pages/rezervari.html', {
      onBeforeLoad: (win) => {
        // Injectăm variabilele fix cum le așteaptă noul tău script JS
        win.localStorage.setItem('nume_utilizator', userMock.nume);
        win.localStorage.setItem('email_utilizator', userMock.email);
        win.localStorage.setItem('telefon_utilizator', userMock.telefon);
      }
    });

    cy.wait('@getServicii');
    cy.wait(250); // Așteptăm să se execute setTimeout(..., 100) din fișierul tău
  }

  function completareDateFormularBaza() {
    cy.get('#categorie-select').select('spa');
    cy.get('#pachet-select').select('Masaj suedez de relaxare');
    
    // Bypass-ul nativ pentru calendarul browserului
    cy.get('#contact-data').then($input => { $input.val('2026-07-15'); }).trigger('change', { force: true });
    cy.get('#contact-ora').then($input => { $input.val('14:30'); }).trigger('change', { force: true });
    
    cy.get('.rezervari-form textarea').type('Aș dori un terapeut cu experiență.');
  }

  it('1. Verifică Paznicul de Logare (Redirecționare dacă email-ul lipsește din memorie)', () => {
    cy.clearLocalStorage();
    cy.viewport(390, 844);
    
    cy.intercept('GET', '**/api/servicii', { body: catalogServiciiMock });
    cy.visit('pages/rezervari.html');

    cy.get('#contact-name').type('Client Nelogat');
    cy.get('#contact-telefon').type('0722111222');
    cy.get('#contact-email').type('nelogat@test.ro');
    
    cy.get('#btn-rezerva').click();

    cy.get('#login-modal').should('be.visible');
    cy.get('#btn-mergi-login').click();
    cy.url().should('include', 'conectare.html');
  });

  it('2. Testează Auto-Fill-ul asincron și Listele Derulante Dinamice', () => {
    cy.viewport(390, 844);
    vizitareCaLogat();

    cy.get('#contact-name').should('have.value', 'Andreea Test');
    cy.get('#contact-email').should('have.value', 'test@tirrawellness.ro');
    cy.get('#contact-telefon').should('have.value', '0740123456');

    cy.get('#pachet-select').should('be.disabled');
    cy.get('#categorie-select').select('spa');
    cy.get('#pachet-select').should('not.be.disabled');
    cy.get('#pachet-select').select('Masaj suedez de relaxare').should('have.value', 'Masaj suedez de relaxare');
  });

});