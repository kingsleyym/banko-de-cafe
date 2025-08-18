// JS für Über uns Carousel (wie drinks/food, aber unabhängig)
const aboutCarouselState = { index: 0 };

function scrollAboutCarousel(direction) {
    const carousel = document.getElementById('about-carousel');
    const cards = carousel.querySelectorAll('.product-card');
    aboutCarouselState.index += direction;
    if (aboutCarouselState.index < 0) aboutCarouselState.index = 0;
    if (aboutCarouselState.index > cards.length - 1) aboutCarouselState.index = cards.length - 1;
    cards.forEach((card, i) => {
        card.classList.toggle('active', i === aboutCarouselState.index);
    });
}

window.scrollCarousel = window.scrollCarousel || function(id, dir) {
    if(id === 'about-carousel') scrollAboutCarousel(dir);
};

document.addEventListener('DOMContentLoaded', function() {
    scrollAboutCarousel(0);
});
