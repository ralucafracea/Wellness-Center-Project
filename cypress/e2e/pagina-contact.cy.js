describe('Testare Frontend - Pagina Contact (Tirra Wellness)', () => {

  beforeEach(() => {
    // Păstrăm dimensiunea de iPhone 14 pentru consecvența testelor
    cy.viewport(390, 844);
    
    // Vizitează pagina de contact (asigură-te că link-ul este corect)
    cy.visit('pages/contact.html');
  });

  it('1. Verifică secțiunea Hero și informațiile de contact', () => {
    // Validăm titlul paginii
    cy.get('.hero-title').should('have.text', 'Contact');
    
    // Ne asigurăm că există exact 4 secțiuni cu detalii (Locație, Telefon, Email, Program)
    cy.get('.info-item').should('have.length', 4);

    // Validăm afișarea corectă a adresei de email
    cy.get('.info-item').contains('rezervari@tirrawellness.ro').should('be.visible');
  });

  it('2. Testează funcționalitatea Meniului Hamburger', () => {
    // Pe această pagină, JS-ul folosește clasa 'active' în loc de 'deschis' și ID-ul 'mobile-nav'
    cy.get('#mobile-nav').should('not.have.class', 'active');

    // Deschidem meniul
    cy.get('#hamburger-btn').click();
    cy.get('#mobile-nav').should('have.class', 'active');

    // Verificăm închiderea
    cy.get('.buton-inchidere').should('be.visible').click();
    cy.get('#mobile-nav').should('not.have.class', 'active');
  });

  it('3. Testează trimiterea Formularului și fereastra Modală (Pop-up)', () => {
    // Asigurăm-ne că modalul de succes este ascuns la început
    cy.get('#contact-modal').should('not.be.visible');

    // Completăm câmpurile obligatorii din formular
    // Cypress simulează un utilizator real care tastează
    cy.get('input[placeholder="Numele tău complet"]').type('Client Test');
    cy.get('input[type="email"]').type('client@email.com');
    cy.get('input[placeholder="Subiectul mesajului"]').type('Întrebare despre rezervări');
    cy.get('textarea').type('Bună ziua, aș dori să aflu mai multe detalii despre pachetele SPA.');

    // Trimitem formularul apăsând pe butonul de submit
    cy.get('.contact-form button[type="submit"]').click();

    // Verificăm dacă JS-ul tău a blocat reîncărcarea paginii (e.preventDefault) și a afișat modalul
    cy.get('#contact-modal').should('be.visible');
    cy.get('.modal-title').should('have.text', 'Îți mulțumim!');

    // Închidem modalul apăsând pe butonul principal ("Înapoi la site")
    cy.get('#btn-inchide-contact').click();

    // Verificăm dacă modalul a dispărut
    cy.get('#contact-modal').should('not.be.visible');

    // Verificăm dacă funcția contactForm.reset() și-a făcut treaba golind câmpurile
    cy.get('input[type="email"]').should('have.value', '');
    cy.get('textarea').should('have.value', '');
  });

  it('3.1 Testează validarea adresei de Email (Scenariu Negativ)', () => {
    // 1. Introducem date corecte în restul formularului
    cy.get('input[placeholder="Numele tău complet"]').type('Client Test');
    cy.get('textarea').type('Acesta este un test pentru email greșit.');

    // 2. Introducem un email INTENȚIONAT GREȘIT (fără @)
    cy.get('input[type="email"]').type('adresa.fara.arond.com');

    // 3. Încercăm să trimitem formularul
    cy.get('.contact-form button[type="submit"]').click();

    // 4. VERIFICAREA: Ne asigurăm că Pop-up-ul de succes NU a apărut
    cy.get('#contact-modal').should('not.be.visible');

    // 5. Validăm că browser-ul a marcat câmpul de email ca fiind invalid
    // Pseudo-clasa ':invalid' este aplicată automat de HTML5 când adresa nu respectă formatul type="email"
    cy.get('input[type="email"]').should('match', ':invalid');
  });

  it('4. Verifică integritatea pictogramelor și a imaginilor', () => {
    // Scanăm toate imaginile pentru a ne asigura că niciun icon de contact nu este corupt
    cy.get('img').each(($img) => {
      expect($img[0].naturalWidth).to.be.greaterThan(
        0,
        `Eroare: Imaginea de la calea "${$img.attr('src')}" nu s-a putut încărca!`
      );
    });
  });

});
