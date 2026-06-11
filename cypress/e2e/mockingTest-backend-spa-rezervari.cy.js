describe('Testare Frontend - Pagina Rezervări (Dinamizată)', () => {

  const userMock = { nume: 'Utilizator Test', email: 'test@tirrawellness.ro', telefon: '0740123456' };
  
  // Creăm un catalog fals (Mock) pe care Cypress îl va trimite frontend-ului 
  // atunci când pagina face cererea GET către server
  const catalogServiciiMock = [
    { id: 1, nume: "Masaj suedez de relaxare", categorie: "spa", tip_achizitie: "programare" },
    { id: 2, nume: "Abonament Fitness 1 Luna", categorie: "fitness", tip_achizitie: "abonament" }
  ];

  function vizitareCaLogat() {
    // 1. Interceptăm cererea GET și îi dăm catalogul nostru fals
    cy.intercept('GET', 'http://localhost:3000/api/servicii', {
      statusCode: 200,
      body: catalogServiciiMock
    }).as('getServicii');

    // 2. Vizităm pagina și injectăm datele în localStorage
    cy.visit('pages/rezervari.html', {
      onBeforeLoad: (win) => {
        win.localStorage.setItem('userLogat', JSON.stringify(userMock));
      }
    });

    // 3. Așteptăm ca scriptul tău JS să termine de adus și construit listele
    cy.wait('@getServicii');
  }
  // Definim o funcție reutilizabilă pentru a completa datele de bază ale formularului
  function completareDateFormularBaza() {
    cy.get('#categorie-select').select('spa');
    cy.get('#pachet-select').select('Masaj suedez de relaxare');
    
    // TACTICA NOUĂ: Ștergem atributul 'onclick' ca să nu mai deschidă calendarul, apoi tastăm normal
    cy.get('#contact-data').invoke('removeAttr', 'onclick').type('2026-07-15');
    cy.get('#contact-ora').invoke('removeAttr', 'onclick').type('14:30');
    
    cy.get('.rezervari-form textarea').type('Aș dori un terapeut cu experiență.');
  }

  it('1. Verifică blocarea formularului și redirecționarea la Login', () => {
    cy.clearLocalStorage();
    cy.viewport(390, 844);
    
    // Interceptăm și aici catalogul pentru a nu avea erori în consolă la deschiderea paginii
    cy.intercept('GET', 'http://localhost:3000/api/servicii', { body: catalogServiciiMock });
    cy.visit('pages/rezervari.html');

    cy.get('#contact-name').type('Client Nelogat');
    cy.get('#contact-telefon').type('0722111222');
    cy.get('#contact-email').type('nelogat@test.ro');
    
    cy.get('#btn-rezerva').click();

    cy.get('#login-modal').should('be.visible');
    
    // Verificăm dacă butonul "Mergi la Login" duce către noua pagină (conectare.html)
    cy.get('#btn-mergi-login').click();
    cy.url().should('include', 'conectare.html');
  });

  it('2. Testează Auto-Fill și Listele Derulante Dinamice (Utilizator Logat)', () => {
    cy.viewport(390, 844);
    vizitareCaLogat();

    cy.get('#contact-name').should('have.value', 'Utilizator Test');
    cy.get('#contact-email').should('have.value', 'test@tirrawellness.ro');
    cy.get('#contact-telefon').should('have.value', '0740123456');

    cy.get('#pachet-select').should('be.disabled');

    cy.get('#categorie-select').select('spa');

    cy.get('#pachet-select').should('not.be.disabled');
    // Verificăm dacă opțiunea din JS a fost generată corect din datele Mock
    cy.get('#pachet-select').select('Masaj suedez de relaxare').should('have.value', 'Masaj suedez de relaxare');
  });

  it('3. Flux Complet: Rezervare Simplă (Plată la recepție)', () => {
    cy.viewport(390, 844);
    vizitareCaLogat();

    // INTERCEPTARE POST: Oprim cererea să ajungă la backend-ul real și forțăm un răspuns de SUCCES
    cy.intercept('POST', 'http://localhost:3000/api/programari', { 
      statusCode: 200, 
      body: { message: "Mock Salvat" } 
    }).as('cerereRezervare');

    
    DateFormularBaza();
    cy.get('#btn-rezerva').click();

    cy.wait('@cerereRezervare').then((interception) => {
      // Verificăm dacă frontend-ul a trimis denumirea corectă și statusul 'neplatita'
      expect(interception.request.body.metoda_plata).to.eq('La recepție');
      expect(interception.request.body.status_plata).to.eq('neplatita');
      expect(interception.request.body.pachet_abonament).to.eq('Masaj suedez de relaxare');
    });

    cy.get('#payment-modal').should('be.visible');
    cy.get('#mesaj-text-succes').should('contain.text', 'Plata se va face la recepție.');
  });

  it('4. Flux Complet: Cumpărare Online cu Cardul', () => {
    cy.viewport(390, 844);
    vizitareCaLogat();

    cy.intercept('POST', 'http://localhost:3000/api/programari', { 
      statusCode: 200, 
      body: { message: "Mock Salvat" } 
    }).as('cererePlata');

    completareDateFormularBaza();
    cy.get('#btn-cumpara').click();

    cy.get('#payment-modal').should('be.visible');
    cy.get('#modal-card-form').should('be.visible');

    cy.get('#card-numar').type('1234567812345678');
    cy.get('#card-expirare').type('12/28');
    cy.get('#card-cvv').type('999');

    cy.get('#btn-plateste').click();

    cy.wait('@cererePlata').then((interception) => {
      expect(interception.request.body.metoda_plata).to.eq('Online cu cardul');
      expect(interception.request.body.status_plata).to.eq('platita');
    });

    cy.get('#modal-card-form').should('not.be.visible');
    cy.get('#modal-succes').should('be.visible');
    cy.get('#mesaj-text-succes').should('contain.text', 'Plata a fost procesată cu succes!');
  });

  it('5. Verifică redirecționarea finală după succes', () => {
    cy.viewport(390, 844);
    vizitareCaLogat();

    cy.intercept('POST', 'http://localhost:3000/api/programari', { statusCode: 200 });
    
    completareDateFormularBaza();
    cy.get('#btn-rezerva').click();

    // Verificăm dacă noul buton de final duce la conectare.html
    cy.get('#btn-inchide-final').click();
    cy.url().should('include', 'pages/conectare.html');
  });

});