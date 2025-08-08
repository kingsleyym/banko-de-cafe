// EINFACHES CAROUSEL SYSTEM

const carouselStates = {};

// Carousel Navigation
function scrollCarousel(carouselId, direction) {
    const carousel = document.getElementById(carouselId);
    const cards = carousel.querySelectorAll('.product-card');
    const totalCards = cards.length;
    
    // Initialize state
    if (!carouselStates[carouselId]) {
        carouselStates[carouselId] = 0;
    }
    
    // Berechne neue Position
    carouselStates[carouselId] += direction;
    
    // Grenzen: Zeige immer 4 Karten, verschiebe um 1
    if (carouselStates[carouselId] < 0) carouselStates[carouselId] = 0;
    if (carouselStates[carouselId] > totalCards - 4) carouselStates[carouselId] = totalCards - 4;
    
    // Transform: Verschiebe um Kartenbreite + Gap (260px + 30px = 290px)
    const translateX = carouselStates[carouselId] * -290;
    carousel.style.transform = `translateX(${translateX}px)`;
    
    // Update aktive Karten nach Animation
    setTimeout(() => updateActiveCards(carousel, carouselStates[carouselId]), 300);
}

// Setze die 2 mittleren Karten aktiv
function updateActiveCards(carousel, startIndex) {
    const cards = carousel.querySelectorAll('.product-card');
    
    // Alle deaktivieren
    cards.forEach(card => card.classList.remove('active'));
    
    // Aktiviere die 2 mittleren von den 4 sichtbaren
    if (cards[startIndex + 1]) cards[startIndex + 1].classList.add('active'); // 2. Karte
    if (cards[startIndex + 2]) cards[startIndex + 2].classList.add('active'); // 3. Karte
}

// Initialize
document.querySelectorAll('.carousel').forEach(carousel => {
    const carouselId = carousel.id;
    carouselStates[carouselId] = 0;
    
    // Setze initial die mittleren 2 Karten aktiv
    updateActiveCards(carousel, 0);
});
