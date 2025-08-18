// JS für Catering Carousel (wie drinks/food, aber unabhängig)
const cateringCarouselState = { index: 0 };

function scrollCateringCarousel(direction) {
    const carousel = document.getElementById('catering-carousel');
    const cards = carousel.querySelectorAll('.product-card');
    cateringCarouselState.index += direction;
    if (cateringCarouselState.index < 0) cateringCarouselState.index = 0;
    if (cateringCarouselState.index > cards.length - 1) cateringCarouselState.index = cards.length - 1;
    cards.forEach((card, i) => {
        card.classList.toggle('active', i === cateringCarouselState.index);
    });
}

window.scrollCarousel = window.scrollCarousel || function(id, dir) {
    if(id === 'catering-carousel') scrollCateringCarousel(dir);
};

document.addEventListener('DOMContentLoaded', function() {
    scrollCateringCarousel(0);
});
