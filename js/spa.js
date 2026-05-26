document.addEventListener('DOMContentLoaded', function() {
    
    const hamburger = document.getElementById('hamburger-btn');
    const mobileNav = document.getElementById('mobile-nav');
    const closeBtn = document.querySelector('.buton-inchidere'); 

    // Deschide meniul la click pe hamburger
    if (hamburger && mobileNav) {
        hamburger.addEventListener('click', function() {
            mobileNav.classList.add('active');
            
            // Facem butonul X vizibil și îi dăm o culoare vizibilă pe fundalul crem
            if (closeBtn) {
                closeBtn.style.display = 'block';
                closeBtn.style.color = '#631621'; 
                closeBtn.style.zIndex = '2001';
            }
        });
    }

    // Închide meniul la click pe X
    if (closeBtn && mobileNav) {
        closeBtn.addEventListener('click', function() {
            mobileNav.classList.remove('active');
            closeBtn.style.display = 'none';
        });
    }

    // Închide meniul când se dă click pe un link din interior (util pe mobil)
    const navLinks = document.querySelectorAll('.mobile-nav ul li a');
    navLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            if (mobileNav) {
                mobileNav.classList.remove('active');
            }
            if (closeBtn) {
                closeBtn.style.display = 'none';
            }
        });
    });

});