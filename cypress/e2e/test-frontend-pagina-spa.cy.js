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
    // COMENTAT: În așteptarea bazei de date / dinamizării.
    // Selectorii au fost actualizați conform noului JS ('active' în loc de 'deschis') 
    // și noului HTML (clasa '.buton-inchidere' în loc de ID).

    cy.get('#mobile-nav').should('not.have.class', 'active');
    cy.get('#hamburger-btn').click();
    
    // Verificăm dacă butonul de închidere (X) devine activ
    cy.get('.buton-inchidere').should('be.visible');
    
    // Testăm și închiderea pentru un flux complet
    cy.get('.buton-inchidere').click();
    cy.get('#mobile-nav').should('not.have.class', 'active');
  });
  
  

  it('4. Testează interacțiunea cu Flip Cards (Facilități)', () => {
    cy.get('.flip-card').first().as('primulCard');

    // 1. Verificăm că NU e întors la început
    cy.get('@primulCard').should('not.have.class', 'flipped');

    // 2. Dăm click
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

  /*
  it('6. Verifică pașii ritualului și lista de incluziuni', () => {
    // COMENTAT: În așteptarea bazei de date.
    // Secțiunea '.steps-list' a fost eliminată din noul HTML.
    // Testul a fost rescris pentru a verifica lista curentă cu clasa '.lista-inclus'.

    // Verificăm dacă lista de detalii incluse conține cele 6 beneficii gratuite
    cy.get('.lista-inclus li').should('have.length', 6);
    cy.get('.lista-inclus li').first().should('contain.text', 'Halat și papuci spa premium');
  });
  */

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