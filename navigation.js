// NAVIGATION UND SMOOTH SCROLLING

document.addEventListener('DOMContentLoaded', function() {
    // Alle Navigations-Links
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Entferne active von allen Links
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Füge active zum geklickten Link hinzu
            this.classList.add('active');
            
            // Smooth Scroll zur Sektion
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Scroll Spy - aktiver Link basierend auf Scroll-Position
    function updateActiveNavigation() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100; // Offset für bessere Erkennung
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                // Entferne active von allen Links
                navLinks.forEach(link => link.classList.remove('active'));
                
                // Füge active zum aktuellen Link hinzu
                const activeLink = document.querySelector(`.nav-menu a[href="#${sectionId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }
    
    // Update Navigation beim Scrollen
    window.addEventListener('scroll', updateActiveNavigation);
    
    // Initiale Aktivierung
    updateActiveNavigation();
});
