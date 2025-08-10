// ==========================================
// PROFESSIONELLE FIXES FÜR ORIGINAL DESIGN
// Bowl Parallax + Carousel Responsive
// ==========================================

// BOWL PARALLAX REPARIERT
function initBowlParallax() {
    const bowl = document.querySelector('.center-drink');
    if (!bowl) return;
    
    let scrollY = 0;
    let targetY = 0;
    let rafId = null;
    
    function updateParallax() {
        targetY = window.pageYOffset;
        
        // Smooth interpolation
        scrollY += (targetY - scrollY) * 0.1;
        
        // Mobile-optimierte Geschwindigkeit
        const isMobile = window.innerWidth < 768;
        const speed = isMobile ? 0.15 : 0.3;
        
        const offset = scrollY * speed;
        bowl.style.transform = `translateX(-50%) translateY(${offset}px)`;
        
        rafId = requestAnimationFrame(updateParallax);
    }
    
    function startParallax() {
        if (rafId) cancelAnimationFrame(rafId);
        updateParallax();
    }
    
    function stopParallax() {
        if (rafId) {
            cancelAnimationFrame(rafId);
            rafId = null;
        }
    }
    
    // Event Listeners
    window.addEventListener('scroll', startParallax);
    window.addEventListener('resize', startParallax);
    
    // Reduced motion support
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        stopParallax();
    }
    
    // Start initial
    startParallax();
}

// CAROUSEL FIXES
function initCarouselFixes() {
    document.querySelectorAll('.carousel').forEach(carousel => {
        function updateActiveCards() {
            const cards = carousel.querySelectorAll('.product-card');
            const carouselRect = carousel.getBoundingClientRect();
            const carouselCenter = carouselRect.left + carouselRect.width / 2;
            
            // Responsive: Anzahl aktiver Karten
            const screenWidth = window.innerWidth;
            let maxActiveCards = screenWidth >= 1200 ? 2 : 1;
            
            // Alle deaktivieren
            cards.forEach(card => card.classList.remove('active'));

            // Berechne Distanzen
            const cardDistances = Array.from(cards).map(card => {
                const cardRect = card.getBoundingClientRect();
                const cardCenter = cardRect.left + cardRect.width / 2;
                const distance = Math.abs(carouselCenter - cardCenter);
                return { card, distance };
            });

            // Sortiere und aktiviere näheste
            cardDistances.sort((a, b) => a.distance - b.distance);
            
            for (let i = 0; i < maxActiveCards && i < cardDistances.length; i++) {
                cardDistances[i].card.classList.add('active');
            }
        }
        
        // Throttled scroll listener
        let scrollTimeout;
        carousel.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(updateActiveCards, 100);
        });
        
        window.addEventListener('resize', updateActiveCards);
        updateActiveCards();
    });
}

// SCROLL CAROUSEL FUNCTION FIXED
function scrollCarousel(carouselId, direction) {
    const carousel = document.getElementById(carouselId);
    if (!carousel) return;
    
    const scrollAmount = 280; // 260px + 20px gap
    carousel.scrollBy({
        left: direction * scrollAmount,
        behavior: 'smooth'
    });
}

// ORIGINAL PARALLAX ENHANCED
function updateParallax() {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.02;
    
    // Texte - leichte vertikale Bewegung
    const heroTexts = document.querySelectorAll('.hero-text');
    heroTexts.forEach(text => {
        text.style.transform = `translateY(calc(-50% + ${rate}px))`;
    });
    
    // Bagels - leichte horizontale und vertikale Bewegung
    const leftBagel = document.querySelector('.coffee-bean.left');
    const rightBagel = document.querySelector('.coffee-bean.right');
    
    if (leftBagel) {
        leftBagel.style.transform = `rotate(-15deg) translate(${rate * 0.5}px, ${rate * 0.3}px)`;
    }
    
    if (rightBagel) {
        rightBagel.style.transform = `rotate(25deg) translate(${rate * -0.5}px, ${rate * 0.3}px)`;
    }
}

// INITIALIZATION
document.addEventListener('DOMContentLoaded', () => {
    initBowlParallax();
    initCarouselFixes();
});

// Keep original scroll listener
window.addEventListener('scroll', updateParallax);
