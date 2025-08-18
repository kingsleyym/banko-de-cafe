// Drinks Carousel Dot Indicator
(function() {
  const carousel = document.getElementById('drinks-carousel');
  const indicator = document.getElementById('drinks-carousel-indicator');
  if (!carousel || !indicator) return;

  const cards = carousel.querySelectorAll('.product-card');
  let currentIndex = 0;
  const total = cards.length;

  function updateIndicator() {
    indicator.innerHTML = '';
    for (let i = 0; i < total; i++) {
      const dot = document.createElement('span');
      dot.className = 'carousel-dot' + (i === currentIndex ? ' active' : '');
      dot.addEventListener('click', () => {
        scrollToCard(i);
      });
      indicator.appendChild(dot);
    }
  }

  function scrollToCard(index) {
    if (cards[index]) {
      cards[index].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      currentIndex = index;
      updateIndicator();
    }
  }

  function onScroll() {
    let minDiff = Infinity;
    let closest = 0;
    cards.forEach((card, i) => {
      const rect = card.getBoundingClientRect();
      const diff = Math.abs(rect.left - carousel.getBoundingClientRect().left);
      if (diff < minDiff) {
        minDiff = diff;
        closest = i;
      }
    });
    if (closest !== currentIndex) {
      currentIndex = closest;
      updateIndicator();
    }
  }

  carousel.addEventListener('scroll', onScroll);
  updateIndicator();
})();
