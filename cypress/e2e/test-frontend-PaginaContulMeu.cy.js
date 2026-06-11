describe('Testare Frontend - Pagina Contul Meu (Dashboard)', () => {

  const utilizatorLogat = {
    id: '99',
    nume: 'Andreea Test'
  };

  // Definim o listă falsă de programări pentru a testa design-ul cardurilor
  const programariMock = {
    success: true,
    programari: [
      { id_programare: 1, nume_serviciu: 'Masaj Terapeutic', data: '2026-08-10', ora: '14:00', status: 'confirmat' },
      { id_programare: 2, nume_serviciu: 'Abonament Fitness', data: '2026-08-15', ora: '09:00', status: 'platita' }
    ]
  };

  beforeEach(() => {
    cy.viewport(390, 844);
  });

  it('1. Paznicul de Sesiune: Redirecționează utilizatorii nelogați', () => {
    // Curățăm memoria pentru a simula un vizitator anonim
    cy.clearLocalStorage();
    cy.visit('pages/contul-meu.html');

    // Scriptul tău ar trebui să detecteze lipsa ID-ului și să-l arunce la conectare
    cy.url().should('include', 'conectare.html');
  });

  it('2. Afișează corect starea "Fără programări"', () => {
    // Interceptăm ruta și îi spunem să returneze un array GOL
    cy.intercept('GET', `http://localhost:3000/api/programari-client/${utilizatorLogat.id}`, {
      statusCode: 200,
      body: { success: true, programari: [] }
    }).as('aduceProgramariGoale');

    // Vizităm pagina injectând datele de sesiune
    cy.visit('pages/contul-meu.html', {
      onBeforeLoad: (win) => {
        win.localStorage.setItem('id_utilizator', utilizatorLogat.id);
        win.localStorage.setItem('nume_utilizator', utilizatorLogat.nume);
      }
    });

    cy.wait('@aduceProgramariGoale');

    // Verificăm salutul personalizat
    cy.get('#salut-utilizator').should('have.text', `Bună, ${utilizatorLogat.nume}!`);

    // Verificăm dacă mesajul tău pentru lista goală este afișat
    cy.get('#sectiune-programari').should('contain.text', 'Nu aveți nicio programare activă în acest moment.');
  });

  it('3. Generează și afișează corect cardurile de programări (DOM Dinamic)', () => {
    // Interceptăm ruta și îi dăm lista noastră cu 2 programări
    cy.intercept('GET', `http://localhost:3000/api/programari-client/${utilizatorLogat.id}`, {
      statusCode: 200,
      body: programariMock
    }).as('aduceProgramariMock');

    cy.visit('pages/contul-meu.html', {
      onBeforeLoad: (win) => {
        win.localStorage.setItem('id_utilizator', utilizatorLogat.id);
        win.localStorage.setItem('nume_utilizator', utilizatorLogat.nume);
      }
    });

    cy.wait('@aduceProgramariMock');

    // Verificăm dacă scriptul tău a creat exact 2 div-uri cu clasa .card-item
    cy.get('.card-item').should('have.length', 2);

    // Verificăm detaliile din primul card
    cy.get('.card-item').first().within(() => {
      cy.get('.card-titlu').should('have.text', 'Masaj Terapeutic');
      cy.get('.badge-status').should('have.text', 'Confirmat'); // Verificăm că prima literă e mare!
      cy.get('.detaliu-valoare').eq(0).should('have.text', '2026-08-10'); // Data
      cy.get('.detaliu-valoare').eq(1).should('have.text', '14:00'); // Ora
    });
  });

  it('4. Testează comutarea între Tab-uri (Programări vs Abonamente)', () => {
    // Facem un mock rapid doar ca să se încarce pagina fără erori
    cy.intercept('GET', 'http://localhost:3000/api/programari-client/*', { body: { success: true, programari: [] } });
    
    cy.visit('pages/contul-meu.html', {
      onBeforeLoad: (win) => {
        win.localStorage.setItem('id_utilizator', utilizatorLogat.id);
      }
    });

    // La pornire, tab-ul de programări trebuie să fie activ și vizibil
    cy.get('#btn-programari').should('have.class', 'activ');
    cy.get('#sectiune-programari').should('be.visible');
    cy.get('#sectiune-abonamente').should('not.be.visible');

    // Apăsăm pe butonul de Abonamente
    cy.get('#btn-abonamente').click();

    // Verificăm dacă s-au inversat clasele și vizibilitatea
    cy.get('#btn-abonamente').should('have.class', 'activ');
    cy.get('#sectiune-abonamente').should('be.visible');
    cy.get('#sectiune-programari').should('not.be.visible');
  });

  it('5. Testează funcția de Deconectare (Logout)', () => {
    cy.intercept('GET', 'http://localhost:3000/api/programari-client/*', { body: { success: true, programari: [] } });
    
    cy.visit('pages/contul-meu.html', {
      onBeforeLoad: (win) => {
        win.localStorage.setItem('id_utilizator', utilizatorLogat.id);
        win.localStorage.setItem('nume_utilizator', utilizatorLogat.nume);
      }
    });

    // Apăsăm pe link-ul de deconectare
    cy.get('#buton-deconectare').click();

    // Verificăm dacă memoria a fost ștearsă complet
    cy.window().then((win) => {
      expect(win.localStorage.getItem('id_utilizator')).to.be.null;
    });

    // Verificăm dacă ne-a aruncat înapoi pe pagina de conectare
    cy.url().should('include', 'conectare.html');
  });

});