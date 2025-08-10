// EXAKTES 4-KARTEN-SYSTEM 

const carouselStates = {};

// Zeige exakt 4 Karten mit korrekten Positionen
function scrollCarousel(carouselId, direction) {
    const carousel = document.getElementById(carouselId);
    const allCards = carousel.querySelectorAll('.product-card');
    const totalCards = allCards.length;
    
    // Initialize state
    if (!carouselStates[carouselId]) {
        carouselStates[carouselId] = 0;
    }
    
    // Berechne neue Position  
    carouselStates[carouselId] += direction;
    
    // Grenzen: Immer 4 Karten zeigen
    if (carouselStates[carouselId] < 0) carouselStates[carouselId] = 0;
    if (carouselStates[carouselId] > totalCards - 4) carouselStates[carouselId] = totalCards - 4;
    
    // Aktualisiere die Anzeige
    updateCardPositions(carousel, carouselStates[carouselId]);
}

// Setze genau 4 Karten auf die richtigen Positionen
function updateCardPositions(carousel, startIndex) {
    const allCards = carousel.querySelectorAll('.product-card');
    
    // Alle Karten unsichtbar machen
    allCards.forEach((card, index) => {
        card.classList.remove('visible', 'pos-1', 'pos-2', 'pos-3', 'pos-4');
    });
    
    // Die 4 sichtbaren Karten positionieren
    for (let i = 0; i < 4; i++) {
        const cardIndex = startIndex + i;
        if (allCards[cardIndex]) {
            const card = allCards[cardIndex];
            card.classList.add('visible', `pos-${i + 1}`);
        }
    }
}

// Initialize alle Carousels
document.querySelectorAll('.carousel').forEach(carousel => {
    const carouselId = carousel.id;
    carouselStates[carouselId] = 0;
    
    // Zeige initial Karten 1-4
    updateCardPositions(carousel, 0);
});

// Berechne den Abstand automatisch für 3-stufiges responsives System
function calculateGap() {
    const containerWidth = window.innerWidth;
    const sideMargins = 200; // 100px links + 100px rechts
    
    let smallCardWidth, largeCardWidth, totalCardWidth;
    
    if (containerWidth <= 1150) {
        // 3-KARTEN-LAYOUT: klein-groß-klein
        smallCardWidth = 160;
        largeCardWidth = 260;
        // Nur 3 Karten: 2 kleine + 1 große, 2 Abstände (links/rechts von großer Karte)
        totalCardWidth = (2 * smallCardWidth) + largeCardWidth; // 580px
        const availableSpace = containerWidth - sideMargins - totalCardWidth;
        const gap = Math.max(20, availableSpace / 2); // 2 Abstände für 3-Karten-Layout
        
        document.documentElement.style.setProperty('--gap', gap + 'px');
        console.log(`📐 3-Karten: ${containerWidth}px → Gap: ${gap.toFixed(1)}px | Karten: ${smallCardWidth}/${largeCardWidth}px`);
        
    } else if (containerWidth <= 1300) {
        // 4-KARTEN-LAYOUT KLEIN: alle kleiner aber gleiche Abstände
        smallCardWidth = 180;
        largeCardWidth = 220;
        totalCardWidth = (2 * smallCardWidth) + (2 * largeCardWidth); // 800px
        const availableSpace = containerWidth - sideMargins - totalCardWidth;
        const gap = Math.max(15, availableSpace / 3); // 3 gleiche Abstände
        
        document.documentElement.style.setProperty('--gap', gap + 'px');
        console.log(`📐 4-Karten Klein: ${containerWidth}px → Gap: ${gap.toFixed(1)}px | Karten: ${smallCardWidth}/${largeCardWidth}px`);
        
    } else {
        // 4-KARTEN-LAYOUT STANDARD: bis 1330px normale Größe
        smallCardWidth = 220;
        largeCardWidth = 260;
        totalCardWidth = (2 * smallCardWidth) + (2 * largeCardWidth); // 960px
        const availableSpace = containerWidth - sideMargins - totalCardWidth;
        const gap = Math.max(20, availableSpace / 3); // 3 gleiche Abstände
        
        document.documentElement.style.setProperty('--gap', gap + 'px');
        console.log(`📐 4-Karten Standard: ${containerWidth}px → Gap: ${gap.toFixed(1)}px | Karten: ${smallCardWidth}/${largeCardWidth}px`);
    }
}

// Berechne Gap beim Laden und bei Resize
window.addEventListener('load', calculateGap);
window.addEventListener('resize', calculateGap);

// Scroll-Unterstützung für alle Carousels hinzufügen
document.addEventListener('DOMContentLoaded', function() {
    const carousels = document.querySelectorAll('[data-carousel]');
    
    carousels.forEach(carousel => {
        carousel.addEventListener('wheel', (e) => {
            e.preventDefault(); // Standard-Scroll verhindern
            
            const carouselId = carousel.dataset.carousel;
            const nextBtn = document.querySelector(`[data-carousel-next="${carouselId}"]`);
            const prevBtn = document.querySelector(`[data-carousel-prev="${carouselId}"]`);
            
            if (e.deltaY > 0 && nextBtn) {
                // Nach unten scrollen = nächste Karte
                nextBtn.click();
            } else if (e.deltaY < 0 && prevBtn) {
                // Nach oben scrollen = vorherige Karte
                prevBtn.click();
            }
        });
    });
});

// MOBILE GALLERY SYSTEM - Einfach und getrennt
let isMobileMode = false;

function initMobileGallery() {
    const wasMobile = isMobileMode;
    isMobileMode = window.innerWidth < 768;
    
    if (isMobileMode) {
        // Mobile Mode aktivieren
        if (!wasMobile) {
            console.log('🔄 Mobile Gallery Mode');
            setupMobileGalleries();
        }
    } else {
        // Desktop Mode - Mobile deaktivieren
        if (wasMobile) {
            console.log('🔄 Desktop Gallery Mode');
            cleanupMobileGalleries();
        }
    }
}

function setupMobileGalleries() {
    const carousels = document.querySelectorAll('.carousel');
    
    carousels.forEach(carousel => {
        // Desktop Navigation verstecken
        const prevBtn = document.querySelector(`[data-carousel-prev="${carousel.id}"]`);
        const nextBtn = document.querySelector(`[data-carousel-next="${carousel.id}"]`);
        if (prevBtn) prevBtn.style.display = 'none';
        if (nextBtn) nextBtn.style.display = 'none';
        
        // Touch Events für Swipe
        setupMobileTouchEvents(carousel);
    });
}

function setupMobileTouchEvents(carousel) {
    let startX = 0;
    
    carousel.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    }, { passive: true });
    
    carousel.addEventListener('touchend', (e) => {
        const endX = e.changedTouches[0].clientX;
        const diffX = startX - endX;
        
        // Swipe erkennen
        if (Math.abs(diffX) > 50) {
            const cards = carousel.querySelectorAll('.product-card');
            const currentScroll = carousel.scrollLeft;
            const cardWidth = 300; // 260px + 40px gap
            const currentIndex = Math.round(currentScroll / cardWidth);
            
            if (diffX > 0 && currentIndex < cards.length - 1) {
                // Swipe left - nächste Karte
                carousel.scrollTo({
                    left: (currentIndex + 1) * cardWidth,
                    behavior: 'smooth'
                });
            } else if (diffX < 0 && currentIndex > 0) {
                // Swipe right - vorherige Karte
                carousel.scrollTo({
                    left: (currentIndex - 1) * cardWidth,
                    behavior: 'smooth'
                });
            }
        }
    }, { passive: true });
}

function cleanupMobileGalleries() {
    const carousels = document.querySelectorAll('.carousel');
    
    carousels.forEach(carousel => {
        // Desktop Navigation wieder anzeigen
        const prevBtn = document.querySelector(`[data-carousel-prev="${carousel.id}"]`);
        const nextBtn = document.querySelector(`[data-carousel-next="${carousel.id}"]`);
        if (prevBtn) prevBtn.style.display = '';
        if (nextBtn) nextBtn.style.display = '';
        
        // Desktop Positionen wiederherstellen
        updateCardPositions(carousel, carouselStates[carousel.id] || 0);
    });
}

// Initialize Mobile Gallery
window.addEventListener('load', initMobileGallery);
window.addEventListener('resize', () => {
    clearTimeout(window.mobileResizeTimeout);
    window.mobileResizeTimeout = setTimeout(initMobileGallery, 150);
});
