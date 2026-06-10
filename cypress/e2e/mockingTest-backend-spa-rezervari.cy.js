describe('Testare End-to-End - Pagina Rezervări (Tirra Wellness)', () => {

  // Definim o funcție reutilizabilă pentru a completa datele de bază ale formularului
  function completareDateFormularBaza() {
    cy.get('#categorie-select').select('spa');
    cy.get('#pachet-select').select('masaj-terapeutic');
    cy.get('#contact-data').type('2026-07-15');
    cy.get('#contact-ora').type('14:30');
    cy.get('.rezervari-form textarea').type('Aș dori un terapeut cu experiență pentru masajul profund.');
  }

  it('1. Verifică blocarea formularului dacă utilizatorul NU este logat (Paznicul de Logare)', () => {
    // Ne asigurăm că localStorage-ul este complet gol
    cy.clearLocalStorage();
    cy.viewport(390, 844);
    cy.visit('pages/rezervari.html');

    // Completăm numele, telefonul și emailul manual
    cy.get('#contact-name').type('Client Nelogat');
    cy.get('#contact-telefon').type('0722111222');
    cy.get('#contact-email').type('nelogat@test.ro');
    
    // Încercăm să trimitem o rezervare simplă
    cy.get('#btn-rezerva').click();

    // VERIFICARE: Scriptul tău JS trebuie să oprească trimiterea și să deschidă modalul de eroare
    cy.get('#login-modal').should('be.visible');
    cy.get('#login-modal .modal-title').should('have.text', 'Autentificare necesară');
  });

  it('2. Testează Auto-Fill și Listele Derulante Dinamice (Utilizator Logat)', () => {
    // SIMULARE LOGARE: Injectăm date în localStorage ÎNAINTE de a vizita pagina
    cy.window().then((win) => {
      const dateUtilizator = {
        nume: 'Andreea-Maria Mata',
        email: 'andreea.maria@test.ro',
        telefon: '0740123456'
      };
      win.localStorage.setItem('userLogat', JSON.stringify(dateUtilizator));
    });

    cy.viewport(390, 844);
    cy.visit('pages/rezervari.html');

    // VERIFICARE AUTO-FILL: Casetele trebuie să preia automat valorile injectate mai sus
    cy.get('#contact-name').should('have.value', 'Andreea-Maria Mata');
    cy.get('#contact-email').should('have.value', 'andreea.maria@test.ro');
    cy.get('#contact-telefon').should('have.value', '0740123456');

    // VERIFICARE SELECT DINAMIC: Inițial, pachetul trebuie să fie dezactivat
    cy.get('#pachet-select').should('be.disabled');

    // Alegem categoria "Spa & Wellness"
    cy.get('#categorie-select').select('spa');

    // Pachetul ar trebui să devină activ și să conțină opțiunile definite în obiectul tău JS
    cy.get('#pachet-select').should('not.be.devizualizat');
    cy.get('#pachet-select').select('masaj cu pietre').should('have.value', 'masaj cu pietre');
  });

  it('3. Flux Complet: Rezervare Simplă (Plată la recepție -> status "neplatita")', () => {
    // Logăm utilizatorul
    cy.window().then((win) => {
      win.localStorage.setItem('userLogat', JSON.stringify({ nume: 'Andreea', email: 'andreea@test.ro', telefon: '0740123456' }));
    });
    cy.viewport(390, 844);
    cy.visit('pages/rezervari.html');

    // Interceptăm ruta POST din spa-server.js
    cy.intercept('POST', 'http://localhost:3000/api/programari').as('cerereRezervare');

    // Completăm restul datelor din calendar și select-uri
    completareDateFormularBaza();

    // Apăsăm butonul "Rezervă"
    cy.get('#btn-rezerva').click();

    // Validăm comunicarea cu serverul Node.js
    cy.wait('@cerereRezervare').then((interception) => {
      expect(interception.response.statusCode).to.eq(200);
      
      // Verificăm dacă datele trimise respectă modelul cerut de backend
      expect(interception.request.body.metoda_plata).to.eq('La recepție');
      expect(interception.request.body.status_plata).to.eq('neplatita');
    });

    // Verificăm afișarea mesajului corect în interfață
    cy.get('#payment-modal').should('be.visible');
    cy.get('#mesaj-text-succes').should('contain.text', 'Plata se va face la recepție.');

    // Verificăm scrierea fizică în fișierul JSON din backend-spa
    cy.readFile('backend-spa/Data/mock-programari.json').then((programari) => {
      const ultimaProgramare = programari[programari.length - 1];
      expect(ultimaProgramare.status_plata).to.eq('neplatita');
      expect(ultimaProgramare.categorie_serviciu).to.eq('Spa & Wellness');
    });
  });

  it('4. Flux Complet: Cumpărare Online cu Cardul (Plată confirmată -> status "platita")', () => {
    // Logăm utilizatorul
    cy.window().then((win) => {
      win.localStorage.setItem('userLogat', JSON.stringify({ nume: 'Andreea', email: 'andreea@test.ro', telefon: '0740123456' }));
    });
    cy.viewport(390, 844);
    cy.visit('pages/rezervari.html');

    cy.intercept('POST', 'http://localhost:3000/api/programari').as('cererePlata');

    completareDateFormularBaza();

    // Pasul A: Apăsăm pe butonul "Cumpără online cu cardul"
    cy.get('#btn-cumpara').click();

    // Ar trebui să se deschidă modalul și să afișeze direct formularul de card introducând ID-urile tale
    cy.get('#payment-modal').should('be.visible');
    cy.get('#modal-card-form').should('be.visible');

    // Pasul B: Introducem date de card perfect valide pentru a trece de regulile Regex din JS
    cy.get('#card-numar').type('1234567812345678');
    cy.get('#card-expirare').type('12/28');
    cy.get('#card-cvv').type('999');

    // Pasul C: Apăsăm "Confirmă Plata"
    cy.get('#btn-plateste').click();

    // Verificăm dacă fetch-ul a plecat cu parametrii modificați pentru plată online
    cy.wait('@cererePlata').then((interception) => {
      expect(interception.response.statusCode).to.eq(200);
      expect(interception.request.body.metoda_plata).to.eq('Online cu cardul');
      expect(interception.request.body.status_plata).to.eq('platita');
    });

    // Verificăm dacă s-a schimbat conținutul modalului în cel de succes total
    cy.get('#modal-card-form').should('not.be.visible');
    cy.get('#modal-succes').should('be.visible');
    cy.get('#mesaj-text-succes').should('contain.text', 'Plata a fost procesată cu succes!');

    // Validăm stocarea pe disc a bazei de date fictive
    cy.readFile('backend-spa/Data/mock-programari.json').then((programari) => {
      const ultimaProgramare = programari[programari.length - 1];
      expect(ultimaProgramare.status_plata).to.eq('platita');
      expect(ultimaProgramare.metoda_plata).to.eq('Online cu cardul');
    });
  });

  it('5. Verifică redirecționarea finală după succes', () => {
    // Logăm utilizatorul și deschidem pagina
    cy.window().then((win) => {
      win.localStorage.setItem('userLogat', JSON.stringify({ nume: 'Andreea', email: 'andreea@test.ro', telefon: '0740123456' }));
    });
    cy.viewport(390, 844);
    cy.visit('pages/rezervari.html');

    cy.intercept('POST', 'http://localhost:3000/api/programari', { statusCode: 200 });
    
    completareDateFormularBaza();
    cy.get('#btn-rezerva').click();

    // Când procesul s-a încheiat și utilizatorul apasă pe butonul "Înapoi la site"
    cy.get('#btn-inchide-final').click();

    // Verificăm dacă funcția finalizeazaSiRedirectioneaza() l-a trimis pe login.html (Contul Meu)
    cy.url().should('include', 'login.html');
  });

});