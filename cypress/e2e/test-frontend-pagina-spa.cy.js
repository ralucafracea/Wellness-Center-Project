describe('Testare Frontend - Pagina SPA & Wellness (Tirra Wellness)', () => {

  beforeEach(() => {
    // Setează ecranul la dimensiunile exacte de iPhone 14
    cy.viewport(390, 844);
    
    cy.visit('pages/spa.html');
  });

  it('1. Verifică elementele din secțiunea Hero', () => {
    // Verificăm dacă subtitlul și titlul principal sunt corecte
    cy.get('.hero-subtitle').should('have.text', 'SPA & WELLNESS');
    cy.get('.hero-title').should('have.text', 'Ritualuri pentru corp & spirit.');
  });

  it('2. Testează funcționalitatea Meniului Hamburger', () => {
    // Verificăm că meniul mobil nu este vizibil sau deschis la început
    cy.get('#mobile-nav').should('not.have.class', 'deschis');

    // Apăsăm pe butonul hamburger folosind ID-ul definit de tine
    cy.get('#hamburger-btn').click();

    // Dacă scriptul tău adaugă o clasă pentru vizibilitate (ex: o clasă de tip 'show' sau similară), o poți verifica aici.
    // Verificăm dacă butonul de închidere (X) devine activ
    cy.get('#close-btn').should('be.visible');
  });

  it('3. Verifică existența pachetelor de tratamente', () => {
    // Verificăm dacă sunt afișate corect toate cele 5 carduri de tratamente statice
    cy.get('.static-card').should('have.length', 5);

    // Verificăm primul card pentru a ne asigura că structura de text e corectă
    cy.get('.static-card').first().within(() => {
      cy.get('.card-title').should('contain.text', 'Masaj suedez de relaxare');
      cy.get('.card-price').should('have.text', '220 RON');
      cy.get('.card-duration').should('have.text', '60 MIN');
    });
  });

  it('4. Testează interacțiunea cu Flip Cards (Facilități)', () => {
    cy.get('.flip-card').first().as('primulCard');

    // 1. Verificăm că NU e întors la început
    cy.get('@primulCard').should('not.have.class', 'flipped');

    // 2. Dăm click (exact cum ai intuit că trebuie făcut)
    cy.get('@primulCard').click();

    
    cy.wait(1000); 

    // 3. Verificăm că s-a întors (clasa 'flipped' a fost adăugată)
    cy.get('@primulCard')
      .find('.flip-card-back p')
      .should('exist')
      .and('contain.text', 'Cufundă-te în liniștea piscinei noastre');
  });

  it('5. Verifică integritatea caruselului Bootstrap', () => {
    // Ne asigurăm că elementul de carusel există în pagină
    cy.get('#spaCarousel').should('exist').and('be.visible');

    // Verificăm dacă există o imagine activă în carusel la pornire
    cy.get('#spaCarousel .carousel-item.active').should('have.length', 1);

    // Simulăm un click pe butonul 'Next' al caruselului
    cy.get('#spaCarousel .carousel-control-next').click();

    // Așteptăm scurt ca tranziția Bootstrap să se execute și verificăm dacă s-a schimbat imaginea activă
    cy.wait(600); 
    cy.get('#spaCarousel .carousel-item.active img').should('have.attr', 'alt', 'Piscina Spa 2');
  });

  it('6. Verifică pașii ritualului și lista de incluziuni', () => {
    // Verificăm dacă lista cu ritualuri, modifcam cand o sa avem o baza de date si extragem de acolo nr de elemente, acum verificam doar daca sunt 5
    cy.get('.steps-list li').should('have.length', 5);
    
    // Verificăm dacă lista de detalii incluse conține cele 7 beneficii gratuite
    cy.get('.included-list li').should('have.length', 6);
  });

  it('7. Verifică dacă toate pozele de pe pagina SPA se încarcă corect', () => {
    // Scanăm automat toate imaginile de pe pagină (inclusiv logo, carduri și carusel)
    cy.get('img').each(($img) => {      
      // Validăm că fișierul grafic de la sursa (src) nu este corupt sau lipsă
      expect($img[0].naturalWidth).to.be.greaterThan(
        0,
        `Imaginea defectă detectată la calea: "${$img.attr('src')}"`
      );
    });
  });

});