document.addEventListener('DOMContentLoaded', function() {
    
    // Constantele
    const hamburger = document.getElementById('hamburger-btn');
    const mobileNav = document.getElementById('mobile-nav');
    const closeBtn = document.querySelector('.buton-inchidere'); 

    // Deschide meniul la click pe hamburger
    if(hamburger && mobileNav && closeBtn) {
        hamburger.addEventListener('click', function() {
            mobileNav.classList.add('active'); 
            hamburger.style.display = 'none';  
            closeBtn.style.display = 'block';
        });
    }

    // Cand apas X
    if(closeBtn && mobileNav && hamburger) {
        closeBtn.addEventListener('click', function() {
            mobileNav.classList.remove('active');
            closeBtn.style.display = 'none';      
            hamburger.style.display = 'flex';     
        });
    }

});