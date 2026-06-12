describe('Testare Frontend - Pagina Fitness ', () => {

  // Creăm un mock pentru a testa randarea dinamică realizată de scriptul tău
  const catalogFitnessMock = [
    {
        id: 10,
        nume: 'Personal Training 1-on-1',
        pret: 180,
        durata_minute: 60,
        descriere: 'Antrenament personalizat cu un coach dedicat.',
        categorie: 'fitness',
        tip_achizitie: 'programare'
    },
    {
        id: 11,
        nume: 'Abonament Fitness Premium',
        pret: 350,
        descriere: 'Acces nelimitat\nSaună inclusă\nSesiune evaluare',
        categorie: 'fitness',
        tip_achizitie: 'abonament',
        zile_valabilitate: 30
    }
  ];

  beforeEach(() => {
    // Setează ecranul la dimensiunile de iPhone 14
    cy.viewport(390, 844);
    
    // Interceptăm ruta pentru a-i oferi scriptului JS pachetele noastre false de test
    cy.intercept('GET', '**/api/servicii', {
      statusCode: 200,
      body: catalogFitnessMock
    }).as('getServiciiFitness');

    // Vizitează pagina
    cy.visit('pages/sala.html');
  });

  
  it('1. Testează funcționalitatea Meniului Hamburger (Selectori Actualizați)', () => {
    // Acum verificăm ID-ul corect și clasa nouă 'active'
    cy.get('#mobile-nav').should('not.have.class', 'active');

    // Deschidem meniul folosind ID-ul butonului
    cy.get('#hamburger-btn').click();
    cy.get('#mobile-nav').should('have.class', 'active');

    // Verificăm dacă butonul "X" funcționează și închide meniul la loc
    cy.get('.buton-inchidere').should('be.visible').click();
    cy.get('#mobile-nav').should('not.have.class', 'active');
  });

  it('2. Verifică secțiunea Dinamică de Programe', () => {
    // Așteptăm ca scriptul tău să aducă datele de la serverul interceptat
    cy.wait('@getServiciiFitness');
    
    // Verificăm dacă scriptul a generat cardul pe baza JSON-ului nostru
    cy.get('.fitness-service-card').should('have.length', 1);

    // Verificăm dacă detaliile s-au inserat corect în HTML
    cy.get('.fitness-service-card').first().within(() => {
      cy.get('h3').should('contain.text', 'Personal Training 1-on-1');
      cy.get('.fitness-price').should('have.text', '180 RON');
      cy.get('.fitness-duration').should('contain.text', '60 MIN');
      cy.get('.fitness-description').should('contain.text', 'Antrenament personalizat');
    });
  });

  it('3. Verifică secțiunea Dinamică de Abonamente și Slider-ul', () => {
    cy.wait('@getServiciiFitness');
    
    // Verificăm dacă slide-urile au fost create (inclusiv clonele din scriptul tău de slider)
    cy.get('.abonament-slide').should('exist');
    
    // Ne uităm în interiorul benzii slider-ului
    cy.get('#track-abonamente').within(() => {
        cy.get('h3.titlu-pachet').should('contain.text', 'Abonament Fitness Premium');
        cy.get('.pret-pachet').should('contain.text', '350 RON / lună');
        // Verificăm dacă acel .split('\n') din codul tău a generat corect lista HTML (<li>)
        cy.get('li').should('contain.text', 'Saună inclusă');
    });
  });

  it('4. Verifică secțiunea Antrenori (Elemente Statice)', () => {
    // Verificăm dacă echipa conține 3 membri
    cy.get('.trainer-card').should('have.length', 3);

    // Verificăm detaliile primului antrenor
    cy.get('.trainer-card').first().within(() => {
      cy.get('h3').should('contain.text', 'Andrei Popescu');
      cy.get('.trainer-role').should('contain.text', 'SENIOR PERFORMANCE COACH');
    });
  });

  it('5. Testează caruselul Bootstrap', () => {
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

  it('6. Verifică integritatea tuturor imaginilor', () => {
    // Scanăm toate elementele <img> pentru a preveni linkurile rupte
    cy.get('img').each(($img) => {
      expect($img[0].naturalWidth).to.be.greaterThan(
        0,
        `Eroare: Imaginea de la calea "${$img.attr('src')}" este coruptă sau lipsește!`
      );
    });
  });

});