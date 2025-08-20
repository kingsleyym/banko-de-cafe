// AUTOMATISCHER PRODUKT-BILDWECHSEL

class ProductSlider {
    constructor() {
        this.products = [
            {
                name: 'Bowl',
                image: '../assets/chicken_teriyaki_front.webp',
                alt: 'Chicken Teriyaki Bowl',
                type: 'bowl',
                showSmoke: true,
                sideElements: {
                    left: '../assets/casg.webp',
                    right: '../assets/mango_obj.webp'
                }
            },
            {
                name: 'Lachs Bagel',
                image: '../assets/manhatten_city_plain.webp',
                alt: 'Lachs Bagel',
                type: 'bagel',
                showSmoke: false,
                sideElements: {
                    left: '../assets/lachs_obj.webp',
                    right: '../assets/avo_obj.webp'
                }
            },
            {
                name: 'Pastrami Panini',
                image: '../assets/pastrami_plain.webp',
                alt: 'Pastrami Panini',
                type: 'panini',
                showSmoke: false,
                sideElements: {
                    left: '../assets/tomato_obj.webp',
                    right: '../assets/salat_obj.webp'
                }
            },
            {
                name: 'Matcha Cup',
                image: '../assets/Gruppe 6.webp',
                alt: 'Matcha Cup',
                type: 'matcha',
                showSmoke: false, // Heißer Matcha hat Dampf
                sideElements: {
                    left: '../assets/matcha_round.webp',
                    right: '../assets/matcha_slash.webp'
                }
            }
        ];

        this.currentIndex = 0;
        this.heroImage = document.getElementById('hero-product-image');
        this.smokeElement = document.querySelector('.smoke');
        this.leftElement = document.querySelector('.coffee-bean.left img');
        this.rightElement = document.querySelector('.coffee-bean.right img');
        this.intervalTime = 6000; // LÄNGER: 6 Sekunden statt 4
        this.isRunning = false;

        this.init();
    }

    init() {
        if (!this.heroImage) return;

        // Setze erstes Produkt beim Laden
        this.showProduct(0);

        // Starte automatischen Wechsel
        this.startAutoSlide();

        // Pausiere beim Hover
        this.heroImage.addEventListener('mouseenter', () => this.pauseAutoSlide());
        this.heroImage.addEventListener('mouseleave', () => this.startAutoSlide());

        // TASTATUR-NAVIGATION - Links/Rechts Pfeile
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                this.previousProduct();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                this.nextProduct();
            }
        });
    }

    showProduct(index) {
        const product = this.products[index];
        if (!product) return;

        // PHASE 1: Alles ausblenden (synchron und langsam)
        this.heroImage.style.opacity = '0';
        this.heroImage.style.transform = 'scale(0.9)';

        // Seitliche Elemente raus-animieren (links raus, rechts raus)
        if (this.leftElement) {
            this.leftElement.style.transform = 'translateX(-100px) scale(0.8)';
            this.leftElement.style.opacity = '0';
        }
        if (this.rightElement) {
            this.rightElement.style.transform = 'translateX(100px) scale(0.8)';
            this.rightElement.style.opacity = '0';
        }

        // Rauch ausblenden
        if (this.smokeElement) {
            this.smokeElement.style.opacity = '0';
        }

        // PHASE 2: Nach 800ms - Bilder wechseln
        setTimeout(() => {
            // Hauptbild wechseln
            this.heroImage.src = product.image;
            this.heroImage.alt = product.alt;
            this.heroImage.setAttribute('data-product', product.type);

            // Seitliche Bilder wechseln
            if (this.leftElement && product.sideElements) {
                this.leftElement.src = product.sideElements.left;
            }
            if (this.rightElement && product.sideElements) {
                this.rightElement.src = product.sideElements.right;
            }

            // Hintergrund ändern - SYNCHRON MIT BILD!
            this.updateBackground(product);

        }, 800); // Langsamer Wechsel

        // PHASE 3: Nach 1000ms - Alles einblenden (synchron)
        setTimeout(() => {
            // Hauptbild einblenden
            this.heroImage.style.opacity = '1';
            this.heroImage.style.transform = 'scale(1.02)';

            // Seitliche Elemente rein-animieren
            if (this.leftElement) {
                this.leftElement.style.transform = 'translateX(0) scale(1)';
                this.leftElement.style.opacity = '1';
            }
            if (this.rightElement) {
                this.rightElement.style.transform = 'translateX(0) scale(1)';
                this.rightElement.style.opacity = '1';
            }

            // Rauch einblenden falls nötig
            if (this.smokeElement) {
                this.smokeElement.style.opacity = product.showSmoke ? '1' : '0';
            }

            // PHASE 4: Nach 1300ms - Zurück zu normaler Größe
            setTimeout(() => {
                this.heroImage.style.transform = 'scale(1)';
            }, 300);

        }, 1000); // Synchroner Einblend-Start

        // Event für weitere Anpassungen
        document.dispatchEvent(new CustomEvent('productChanged', {
            detail: { product, index }
        }));
    }

    updateBackground(product) {
        // Hintergrund ändern - AUCH DEN HEADER!
        const heroContainer = document.querySelector('.hero-container');
        const header = document.querySelector('header');
        if (heroContainer) {
            console.log('Setting background for product:', product.type);
            heroContainer.setAttribute('data-current-product', product.type);
        }

        if (header) {
            header.setAttribute('data-current-product', product.type);
            console.log('Header background set for:', product.type);
        }
    }

    nextProduct() {
        this.currentIndex = (this.currentIndex + 1) % this.products.length;
        this.showProduct(this.currentIndex);
    }

    previousProduct() {
        this.currentIndex = (this.currentIndex - 1 + this.products.length) % this.products.length;
        this.showProduct(this.currentIndex);
    }

    startAutoSlide() {
        if (this.isRunning) return;

        this.isRunning = true;
        this.interval = setInterval(() => {
            this.nextProduct();
        }, this.intervalTime);
    }

    pauseAutoSlide() {
        if (this.interval) {
            clearInterval(this.interval);
            this.isRunning = false;
        }
    }
}

// Initialisiere den Product Slider
document.addEventListener('DOMContentLoaded', () => {
    new ProductSlider();
});
