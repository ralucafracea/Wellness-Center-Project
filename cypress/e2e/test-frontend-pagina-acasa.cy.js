describe('Testare Frontend - Pagina Acasă (Tirra Wellness)', () => {

  beforeEach(() => {

        cy.viewport(390, 844); // Simulăm un telefon mobil (Iphone 14)
        //cy.viewport(1280, 800);         //simulam pentru laptop

        cy.visit('index.html'); 
 });

  it('1. Verifică Header-ul și Logo-ul', () => {
    // Selectăm tot antetul și verificăm dacă e vizibil
    cy.get('.header-principal').should('be.visible');

    // Verificăm dacă textele de logo există și sunt corecte
    cy.get('.titlu-logo').should('have.text', 'TIRRA');
    cy.get('.subtitlu-logo').should('have.text', 'WELLNESS');

  });

  it('2. Verifică Secțiunea Hero', () => {
    // Verificăm textul principal din Hero
    cy.get('.hero h1').should('have.text', 'Echilibru între forță și relaxare');
    
    // Verificăm dacă butonul de rezervare duce la pagina corectă
    cy.get('.buton-rezervare')
      .should('be.visible')
      .and('have.attr', 'href', 'pages/rezervari.html');

    
  });

  it('3. Testează funcționalitatea Meniului Hamburger (Pe mobil)', () => {
    // Redimensionăm fereastra Cypress ca să simuleze un telefon (ex: iPhone)
    cy.viewport(430, 932);

    // Meniul nu ar trebui să aibă clasa 'deschis' la început
    cy.get('.meniu-navigatie').should('not.have.class', 'deschis');

    // Apăsăm pe butonul hamburger
    cy.get('.buton-hamburger').click();

    // Verificăm dacă scriptul tău JS a adăugat clasa 'deschis'
    cy.get('.meniu-navigatie').should('have.class', 'deschis');

    // Verificăm dacă a apărut butonul de închidere (X)
    cy.get('.buton-inchidere').should('be.visible');

    // Apăsăm pe butonul de închidere
    cy.get('.buton-inchidere').click();

    // Verificăm dacă meniul s-a închis (clasa 'deschis' a fost eliminată)
    cy.get('.meniu-navigatie').should('not.have.class', 'deschis');

  });

  it('4. Testează funcționalitatea Slider-ului de Recenzii', () => {
    // Facem scroll până la secțiunea de recenzii
    cy.get('.recenzii').scrollIntoView();

    // Verificăm dacă prima recenzie este activă și are textul corect
    cy.get('.slide-recenzie.activa .text-recenzie')
      .should('contain.text', 'relaxare totală');

    // Apăsăm săgeata dreapta
    cy.get('.sageata-dreapta').click();

    // Verificăm dacă a doua recenzie a devenit activă (verificând textul ei)
    cy.get('.slide-recenzie.activa .text-recenzie')
      .should('contain.text', 'schimbat complet rutina');
  });

  it('5. Verifică Secțiunea Contact și elementele CSS', () => {
    // Testăm un element specific de design din CSS (ex: fontul titlului de contact)
    cy.get('.titlu-contact a')
      .should('have.css', 'text-decoration').and('match', /none|solid/); // Verifică formatarea linkului

    // Verificăm dacă toate cele 4 elemente de contact sunt randate pe ecran
    cy.get('.element-contact').should('have.length', 4);
  });

  it('6. Verifică dacă toate imaginile s-au încărcat corect', () => {
      // Selectăm absolut toate etichetele <img> de pe pagină
      cy.get('img').each(($img) => {
        
        // 1. Ne asigurăm că imaginea este vizibilă pe ecran
        cy.wrap($img).should('be.visible');
        
        // 2. Verificăm fizic fișierul (lățimea naturală trebuie să fie mai mare ca 0)
        // Dacă testul pică aici, mesajul te va avertiza exact care cale (src) este greșită
        expect($img[0].naturalWidth).to.be.greaterThan(
          0, 
          `Eroare: Imaginea de la calea "${$img.attr('src')}" este stricată sau nu a fost găsită!`
        );
      });
    });
  

});