// PARALLAX JAVASCRIPT

// Subtile Parallax-Effekte
// PARALLAX EFFEKTE - FLÜSSIGER UND MEHR BEWEGUNG
function updateParallax() {
    const scrolled = window.pageYOffset;
    
    // VERLAUF BEWEGT SICH ENTGEGENGESETZT ZUM SCROLL
    const gradientRate = scrolled * 0.5; // ERHÖHT für sichtbaren Effekt
    const header = document.querySelector('header');
    if (header) {
        header.style.setProperty('--gradient-offset', `${gradientRate}px`);
        console.log('Gradient offset:', gradientRate); // DEBUG
    }
    
    // Hero Texte - flüssigere Parallax-Geschwindigkeit
    const heroRate = scrolled * -0.05;
    const heroTexts = document.querySelectorAll('.hero-text');
    heroTexts.forEach(text => {
        text.style.transform = `translateY(calc(-50% + ${heroRate}px))`;
    });
    
    // Bowl - FLÜSSIGER PARALLAX aber FIXED positioniert
    const bowlRate = scrolled * -0.03;
    const bowl = document.querySelector('.center-drink');
    if (bowl) {
        bowl.style.transform = `translateX(-50%) translateY(${bowlRate}px)`;
    }
    
    // Bagels - flüssigere Parallax-Bewegung
    const bagelRate = scrolled * -0.05;
    const leftBagel = document.querySelector('.coffee-bean.left');
    const rightBagel = document.querySelector('.coffee-bean.right');
    
    if (leftBagel) {
        leftBagel.style.transform = `rotate(-15deg) translate(${bagelRate * 0.8}px, ${bagelRate * 0.5}px)`;
    }
    
    if (rightBagel) {
        rightBagel.style.transform = `rotate(25deg) translate(${bagelRate * -0.8}px, ${bagelRate * 0.5}px)`;
    }
}

// Event Listener für Scroll
window.addEventListener('scroll', updateParallax);
