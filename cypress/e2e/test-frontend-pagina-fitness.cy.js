describe('Testare Frontend - Pagina Fitness (Tirra Wellness)', () => {

  beforeEach(() => {
    // Setează ecranul la dimensiunile de iPhone 14
    cy.viewport(390, 844);
    
    // Vizitează pagina de fitness de pe serverul local
    cy.visit('pages/sala.html');
  });

  it('1. Verifică secțiunea Hero', () => {
    // Verificăm textele principale de la intrarea pe pagină
    cy.get('.hero-subtitle').should('have.text', 'SALĂ DE FITNESS');
    cy.get('.hero-title').should('have.text', 'Forță, formă și echilibru');
  });

  it('2. Testează funcționalitatea Meniului Hamburger', () => {
    // Verificăm că meniul este închis inițial
    cy.get('.meniu-navigatie').should('not.have.class', 'deschis');

    // Deschidem meniul
    cy.get('.buton-hamburger').click();
    cy.get('.meniu-navigatie').should('have.class', 'deschis');

    // Verificăm dacă butonul "X" funcționează și închide meniul la loc
    cy.get('.buton-inchidere').should('be.visible').click();
    cy.get('.meniu-navigatie').should('not.have.class', 'deschis');
  });

  it('3. Verifică secțiunea de Programe', () => {
    // Verificăm dacă sunt exact 5 programe afișate
    cy.get('.service-card').should('have.length', 5);

    // Verificăm primul program în detaliu
    cy.get('.service-card').first().within(() => {
      cy.get('h3').should('contain.text', 'Personal Training 1-on-1');
      cy.get('.price').should('have.text', '180 RON');
      cy.get('.duration').should('have.text', '60 MIN');
    });
  });

  it('4. Verifică secțiunea de Dotări și iconițele SVG', () => {
    // Verificăm dacă există cele 5 carduri de echipamente
    cy.get('.dotari-card').should('have.length', 5);

    // Ne asigurăm că fiecare dotare are iconița SVG atașată
    cy.get('.dotari-card .card-icon').should('have.length', 5);
  });

  it('5. Verifică secțiunea Antrenori', () => {
    // Verificăm dacă echipa conține 3 membri
    cy.get('.trainer-card').should('have.length', 3);

    // Verificăm detaliile primului antrenor
    cy.get('.trainer-card').first().within(() => {
      cy.get('h3').should('contain.text', 'Andrei Popescu');
      cy.get('.trainer-role').should('contain.text', 'SENIOR PERFORMANCE COACH');
    });
  });

  it('6. Testează caruselul Bootstrap', () => {
    // Verificăm dacă slider-ul este vizibil
    cy.get('#fitnessCarousel').should('be.visible');

    // Verificăm că doar o imagine este activă la pornire
    cy.get('#fitnessCarousel .carousel-item.active').should('have.length', 1);

    // Simulăm un click pe butonul de 'Next'
    cy.get('#fitnessCarousel .carousel-control-next').click();

    // Așteptăm tranziția și verificăm dacă s-a schimbat imaginea
    cy.wait(600); 
    cy.get('#fitnessCarousel .carousel-item.active img').should('have.attr', 'alt', 'Spa');
  });

  it('7. Verifică integritatea tuturor imaginilor', () => {
    // Scanăm toate elementele <img> pentru a preveni linkurile rupte
    cy.get('img').each(($img) => {
      expect($img[0].naturalWidth).to.be.greaterThan(
        0,
        `Eroare: Imaginea de la calea "${$img.attr('src')}" este coruptă sau lipsește!`
      );
    });
  });

});