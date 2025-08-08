// ==========================================
// PROFESSIONELLE CAROUSEL KLASSE
// Native CSS + JavaScript Controller
// ==========================================

class ProfessionalCarousel {
    constructor(options = {}) {
        // KONFIGURATION
        this.config = {
            containerSelector: options.containerSelector || '.carousel',
            cardSelector: options.cardSelector || '.product-card',
            prevButtonSelector: options.prevButtonSelector || '.carousel-nav.prev',
            nextButtonSelector: options.nextButtonSelector || '.carousel-nav.next',
            
            // RESPONSIVE SETTINGS
            desktopActiveCards: options.desktopActiveCards || 2,
            tabletActiveCards: options.tabletActiveCards || 1,
            mobileActiveCards: options.mobileActiveCards || 1,
            
            // BREAKPOINTS
            desktopBreakpoint: options.desktopBreakpoint || 1200,
            tabletBreakpoint: options.tabletBreakpoint || 768,
            
            // ANIMATION
            animationDuration: options.animationDuration || 400,
            scrollThrottle: options.scrollThrottle || 100,
            
            // CALLBACKS
            onCardChange: options.onCardChange || null,
            onInit: options.onInit || null
        };
        
        // STATE
        this.currentIndex = 0;
        this.isAnimating = false;
        this.totalCards = 0;
        this.activeCardCount = 2;
        
        // ELEMENTS
        this.carousel = null;
        this.cards = [];
        this.prevBtn = null;
        this.nextBtn = null;
        
        // OBSERVERS
        this.intersectionObserver = null;
        this.resizeObserver = null;
        
        this.init();
    }
    
    // ==========================================
    // INITIALISIERUNG
    // ==========================================
    init() {
        this.findElements();
        
        if (!this.carousel || this.cards.length === 0) {
            console.warn('ProfessionalCarousel: Required elements not found');
            return;
        }
        
        this.totalCards = this.cards.length;
        this.updateActiveCardCount();
        this.setupEventListeners();
        this.setupObservers();
        this.updateActiveCards();
        
        if (this.config.onInit) {
            this.config.onInit(this);
        }
    }
    
    findElements() {
        this.carousel = document.querySelector(this.config.containerSelector);
        this.cards = Array.from(document.querySelectorAll(this.config.cardSelector));
        this.prevBtn = document.querySelector(this.config.prevButtonSelector);
        this.nextBtn = document.querySelector(this.config.nextButtonSelector);
    }
    
    // ==========================================
    // EVENT LISTENERS
    // ==========================================
    setupEventListeners() {
        // NAVIGATION BUTTONS
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.navigate(-1));
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.navigate(1));
        }
        
        // SCROLL DETECTION
        let scrollTimeout;
        this.carousel.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                this.updateActiveCardsFromScroll();
            }, this.config.scrollThrottle);
        });
        
        // RESIZE DETECTION
        window.addEventListener('resize', this.throttle(() => {
            this.updateActiveCardCount();
            this.updateActiveCards();
        }, 250));
        
        // KEYBOARD NAVIGATION
        this.carousel.addEventListener('keydown', (e) => {
            this.handleKeyboardNavigation(e);
        });
        
        // TOUCH GESTURES
        this.setupTouchGestures();
    }
    
    setupTouchGestures() {
        let startX = 0;
        let currentX = 0;
        let isDragging = false;
        
        this.carousel.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
        }, { passive: true });
        
        this.carousel.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            currentX = e.touches[0].clientX;
        }, { passive: true });
        
        this.carousel.addEventListener('touchend', () => {
            if (!isDragging) return;
            
            const deltaX = startX - currentX;
            const threshold = 50;
            
            if (Math.abs(deltaX) > threshold) {
                if (deltaX > 0) {
                    this.navigate(1); // Swipe left -> next
                } else {
                    this.navigate(-1); // Swipe right -> prev
                }
            }
            
            isDragging = false;
        }, { passive: true });
    }
    
    handleKeyboardNavigation(e) {
        switch(e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                this.navigate(-1);
                break;
            case 'ArrowRight':
                e.preventDefault();
                this.navigate(1);
                break;
            case 'Home':
                e.preventDefault();
                this.goToCard(0);
                break;
            case 'End':
                e.preventDefault();
                this.goToCard(this.totalCards - 1);
                break;
        }
    }
    
    // ==========================================
    // OBSERVERS
    // ==========================================
    setupObservers() {
        // INTERSECTION OBSERVER für automatische Aktivierung
        this.intersectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && entry.intersectionRatio > 0.6) {
                    const index = parseInt(entry.target.dataset.index);
                    if (!isNaN(index) && index !== this.currentIndex) {
                        this.currentIndex = index;
                        this.updateActiveCards();
                    }
                }
            });
        }, {
            root: this.carousel,
            threshold: [0.6, 0.8]
        });
        
        // CARDS beobachten
        this.cards.forEach((card, index) => {
            card.dataset.index = index;
            this.intersectionObserver.observe(card);
        });
    }
    
    // ==========================================
    // NAVIGATION
    // ==========================================
    navigate(direction) {
        if (this.isAnimating) return;
        
        const newIndex = Math.max(0, Math.min(this.totalCards - 1, this.currentIndex + direction));
        this.goToCard(newIndex);
    }
    
    goToCard(index) {
        if (this.isAnimating || index === this.currentIndex) return;
        
        this.isAnimating = true;
        this.currentIndex = index;
        
        this.scrollToCard(index);
        
        setTimeout(() => {
            this.isAnimating = false;
        }, this.config.animationDuration);
    }
    
    scrollToCard(index) {
        const card = this.cards[index];
        if (!card) return;
        
        const cardRect = card.getBoundingClientRect();
        const carouselRect = this.carousel.getBoundingClientRect();
        const scrollLeft = this.carousel.scrollLeft;
        
        const targetScroll = scrollLeft + cardRect.left - carouselRect.left - (carouselRect.width - cardRect.width) / 2;
        
        this.carousel.scrollTo({
            left: Math.max(0, targetScroll),
            behavior: 'smooth'
        });
        
        setTimeout(() => this.updateActiveCards(), 200);
    }
    
    // ==========================================
    // RESPONSIVE LOGIC
    // ==========================================
    updateActiveCardCount() {
        const viewport = window.innerWidth;
        
        if (viewport >= this.config.desktopBreakpoint) {
            this.activeCardCount = this.config.desktopActiveCards;
        } else if (viewport >= this.config.tabletBreakpoint) {
            this.activeCardCount = this.config.tabletActiveCards;
        } else {
            this.activeCardCount = this.config.mobileActiveCards;
        }
    }
    
    updateActiveCardsFromScroll() {
        const carouselCenter = this.carousel.scrollLeft + this.carousel.offsetWidth / 2;
        let closestIndex = 0;
        let closestDistance = Infinity;
        
        this.cards.forEach((card, index) => {
            const cardCenter = card.offsetLeft + card.offsetWidth / 2;
            const distance = Math.abs(carouselCenter - cardCenter);
            
            if (distance < closestDistance) {
                closestDistance = distance;
                closestIndex = index;
            }
        });
        
        if (closestIndex !== this.currentIndex) {
            this.currentIndex = closestIndex;
            this.updateActiveCards();
        }
    }
    
    updateActiveCards() {
        // BESTIMME AKTIVE KARTEN
        let activeCards = [];
        
        if (this.activeCardCount === 1) {
            activeCards = [this.currentIndex];
        } else if (this.activeCardCount === 2) {
            activeCards = [this.currentIndex, this.currentIndex + 1];
        } else {
            // Für mehr als 2 aktive Karten
            for (let i = 0; i < this.activeCardCount; i++) {
                const index = this.currentIndex + i;
                if (index < this.totalCards) {
                    activeCards.push(index);
                }
            }
        }
        
        // UPDATE CARD STATES
        this.cards.forEach((card, index) => {
            const isActive = activeCards.includes(index);
            card.classList.toggle('active', isActive);
            card.setAttribute('aria-current', isActive ? 'true' : 'false');
        });
        
        // CALLBACK
        if (this.config.onCardChange) {
            this.config.onCardChange(this.currentIndex, activeCards);
        }
    }
    
    // ==========================================
    // UTILITY METHODS
    // ==========================================
    throttle(func, delay) {
        let timeoutId;
        let lastExecTime = 0;
        return function (...args) {
            const currentTime = Date.now();
            
            if (currentTime - lastExecTime > delay) {
                func.apply(this, args);
                lastExecTime = currentTime;
            } else {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => {
                    func.apply(this, args);
                    lastExecTime = Date.now();
                }, delay - (currentTime - lastExecTime));
            }
        };
    }
    
    // ==========================================
    // PUBLIC API
    // ==========================================
    destroy() {
        if (this.intersectionObserver) {
            this.intersectionObserver.disconnect();
        }
        
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
        }
        
        // Remove event listeners
        window.removeEventListener('resize', this.updateActiveCardCount);
    }
    
    getCurrentIndex() {
        return this.currentIndex;
    }
    
    getTotalCards() {
        return this.totalCards;
    }
    
    getActiveCardCount() {
        return this.activeCardCount;
    }
    
    refresh() {
        this.updateActiveCardCount();
        this.updateActiveCards();
    }
}

// ==========================================
// PARALLAX KLASSE
// ==========================================
class ProfessionalParallax {
    constructor(options = {}) {
        this.config = {
            elementSelector: options.elementSelector || '.bowl',
            speed: options.speed || 0.3,
            mobileSpeed: options.mobileSpeed || 0.15,
            mobileBreakpoint: options.mobileBreakpoint || 768,
            throttle: options.throttle || 16, // 60fps
            cssVariable: options.cssVariable || '--parallax-offset'
        };
        
        this.element = null;
        this.scrollY = 0;
        this.targetY = 0;
        this.rafId = null;
        this.isActive = true;
        
        this.init();
    }
    
    init() {
        this.element = document.querySelector(this.config.elementSelector);
        
        if (!this.element) {
            console.warn('ProfessionalParallax: Element not found');
            return;
        }
        
        this.setupEventListeners();
        this.startAnimation();
    }
    
    setupEventListeners() {
        window.addEventListener('scroll', this.throttle(() => {
            this.targetY = window.pageYOffset;
        }, this.config.throttle));
        
        window.addEventListener('resize', () => {
            this.updateParallax();
        });
        
        // Pause on reduced motion preference
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            this.isActive = false;
        }
    }
    
    startAnimation() {
        const animate = () => {
            if (this.isActive) {
                this.updateParallax();
            }
            this.rafId = requestAnimationFrame(animate);
        };
        animate();
    }
    
    updateParallax() {
        if (!this.isActive) return;
        
        // Smooth interpolation
        this.scrollY += (this.targetY - this.scrollY) * 0.1;
        
        // Calculate speed based on viewport
        const isMobile = window.innerWidth < this.config.mobileBreakpoint;
        const speed = isMobile ? this.config.mobileSpeed : this.config.speed;
        
        const offset = this.scrollY * speed;
        
        // Apply via CSS custom property or transform
        if (this.config.cssVariable) {
            this.element.style.setProperty(this.config.cssVariable, `${offset}px`);
        } else {
            this.element.style.transform = `translateX(-50%) translateY(${offset}px)`;
        }
    }
    
    throttle(func, delay) {
        let timeoutId;
        let lastExecTime = 0;
        return function (...args) {
            const currentTime = Date.now();
            
            if (currentTime - lastExecTime > delay) {
                func.apply(this, args);
                lastExecTime = currentTime;
            } else {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => {
                    func.apply(this, args);
                    lastExecTime = Date.now();
                }, delay - (currentTime - lastExecTime));
            }
        };
    }
    
    destroy() {
        if (this.rafId) {
            cancelAnimationFrame(this.rafId);
        }
        this.isActive = false;
    }
    
    pause() {
        this.isActive = false;
    }
    
    resume() {
        this.isActive = true;
    }
}

// ==========================================
// EXPORT FÜR MODULE
// ==========================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ProfessionalCarousel, ProfessionalParallax };
}

// ==========================================
// GLOBAL VERFÜGBAR MACHEN
// ==========================================
window.ProfessionalCarousel = ProfessionalCarousel;
window.ProfessionalParallax = ProfessionalParallax;
