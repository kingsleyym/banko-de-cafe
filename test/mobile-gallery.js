// MOBILE GALERIE MIT SNAP SCROLL UND TOUCH SUPPORT

// Mobile Galerie initialisieren
function initMobileGallery() {
    // Nur auf Mobile ausführen
    if (window.innerWidth > 768) return;
    
    // Alle bestehenden Carousels für Mobile vorbereiten
    document.querySelectorAll('.carousel').forEach(carousel => {
        createMobileGallery(carousel);
    });
}

// Mobile Galerie aus bestehender Desktop-Galerie erstellen
function createMobileGallery(desktopCarousel) {
    const wrapper = desktopCarousel.parentElement;
    const cards = Array.from(desktopCarousel.querySelectorAll('.product-card'));
    
    // Mobile Carousel Container erstellen
    const mobileCarousel = document.createElement('div');
    mobileCarousel.className = 'mobile-carousel';
    
    // Karten für Mobile klonen und anpassen
    cards.forEach((card, index) => {
        const mobileCard = card.cloneNode(true);
        mobileCard.className = 'mobile-product-card';
        
        // Erstes Element ist groß
        if (index === 0) {
            mobileCard.classList.add('first-large');
        }
        
        mobileCarousel.appendChild(mobileCard);
    });
    
    // Mobile Carousel zu Wrapper hinzufügen
    wrapper.appendChild(mobileCarousel);
    
    // Touch/Swipe Events hinzufügen
    addTouchSupport(wrapper);
    
    // Snap-Scroll Behavior
    addSnapScrollSupport(wrapper, mobileCarousel);
}

// Touch/Swipe Support hinzufügen
function addTouchSupport(wrapper) {
    let startX = 0;
    let scrollLeft = 0;
    let isDown = false;
    
    const carousel = wrapper.querySelector('.mobile-carousel');
    if (!carousel) return;
    
    // Touch Start
    wrapper.addEventListener('touchstart', (e) => {
        isDown = true;
        startX = e.touches[0].pageX - wrapper.offsetLeft;
        scrollLeft = wrapper.scrollLeft;
    });
    
    // Touch Move
    wrapper.addEventListener('touchmove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        
        const x = e.touches[0].pageX - wrapper.offsetLeft;
        const walk = (x - startX) * 2; // Scroll-Multiplikator
        wrapper.scrollLeft = scrollLeft - walk;
    });
    
    // Touch End
    wrapper.addEventListener('touchend', () => {
        isDown = false;
        
        // Snap to nearest card
        snapToNearestCard(wrapper);
    });
}

// Snap-Scroll Support
function addSnapScrollSupport(wrapper, mobileCarousel) {
    const cards = mobileCarousel.querySelectorAll('.mobile-product-card');
    
    // Scroll Event Listener für dynamisches Vergrößern
    wrapper.addEventListener('scroll', () => {
        updateActiveCard(wrapper, cards);
    });
    
    // Initial erste Karte aktiv setzen
    setTimeout(() => updateActiveCard(wrapper, cards), 100);
}

// Nächste Karte beim Snap
function snapToNearestCard(wrapper) {
    const cards = wrapper.querySelectorAll('.mobile-product-card');
    const cardWidth = 300; // 280px + 20px gap
    const scrollLeft = wrapper.scrollLeft;
    
    // Berechne nächste Karte
    const nearestIndex = Math.round(scrollLeft / cardWidth);
    const targetScroll = nearestIndex * cardWidth;
    
    // Smooth scroll zur nächsten Karte
    wrapper.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
    });
}

// Aktive Karte basierend auf Scroll-Position updaten
function updateActiveCard(wrapper, cards) {
    const cardWidth = 300;
    const scrollLeft = wrapper.scrollLeft;
    const centerPosition = scrollLeft + wrapper.clientWidth / 2;
    
    // Alle Karten zurücksetzen
    cards.forEach(card => {
        card.style.transform = 'scale(0.9)';
        card.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
        card.style.zIndex = '1';
    });
    
    // Aktive Karte finden und vergrößern
    cards.forEach((card, index) => {
        const cardLeft = index * cardWidth;
        const cardCenter = cardLeft + cardWidth / 2;
        
        // Wenn Karte in der Nähe der Mitte ist
        if (Math.abs(cardCenter - centerPosition) < cardWidth / 2) {
            card.style.transform = 'scale(1.1)';
            card.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.2)';
            card.style.zIndex = '10';
        }
    });
}

// Button-Events für Mobile erweitern
function scrollCarousel(carouselId, direction) {
    // Desktop Verhalten (original)
    if (window.innerWidth > 768) {
        const carousel = document.getElementById(carouselId);
        const cards = carousel.querySelectorAll('.product-card');
        const totalCards = cards.length;
        
        if (!carouselStates[carouselId]) {
            carouselStates[carouselId] = 0;
        }
        
        carouselStates[carouselId] += direction;
        
        if (carouselStates[carouselId] < 0) carouselStates[carouselId] = 0;
        if (carouselStates[carouselId] > totalCards - 4) carouselStates[carouselId] = totalCards - 4;
        
        const translateX = carouselStates[carouselId] * -290;
        carousel.style.transform = `translateX(${translateX}px)`;
        
        setTimeout(() => updateActiveCards(carousel, carouselStates[carouselId]), 300);
        return;
    }
    
    // Mobile Verhalten
    const section = document.getElementById(carouselId).closest('.content-section');
    const wrapper = section.querySelector('.carousel-wrapper');
    const cardWidth = 300;
    
    const currentScroll = wrapper.scrollLeft;
    const newScroll = currentScroll + (direction * cardWidth);
    
    wrapper.scrollTo({
        left: newScroll,
        behavior: 'smooth'
    });
}

// Initialisierung bei DOM Ready und Resize
document.addEventListener('DOMContentLoaded', initMobileGallery);
window.addEventListener('resize', () => {
    // Bei Bildschirmwechsel neu initialisieren
    setTimeout(initMobileGallery, 100);
});
