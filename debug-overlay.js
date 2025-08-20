// DEBUG OVERLAY FÜR RESPONSIVE ENTWICKLUNG
function createDebugOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'debug-overlay';
    overlay.innerHTML = `
        <div class="debug-header">
            <h4>📐 Debug Info</h4>
            <button class="debug-toggle" onclick="toggleDebugOverlay()">−</button>
        </div>
        <div class="debug-content">
            <div class="debug-item">
                <span class="debug-label">Breite:</span>
                <span class="debug-value" id="debug-width">0px</span>
            </div>
            <div class="debug-item">
                <span class="debug-label">Höhe:</span>
                <span class="debug-value" id="debug-height">0px</span>
            </div>
            <div class="debug-item">
                <span class="debug-label">Breakpoint:</span>
                <span class="debug-value" id="debug-breakpoint">
                    <span class="breakpoint mobile">Mobile</span>
                </span>
            </div>
            <div class="debug-item">
                <span class="debug-label">Scroll:</span>
                <span class="debug-value" id="debug-scroll">0px</span>
            </div>
            <div class="debug-item">
                <span class="debug-label">Produkt:</span>
                <span class="debug-value" id="debug-product">Bowl</span>
            </div>
        </div>
    `;
    
    document.body.appendChild(overlay);
    
    function updateDebugInfo() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const scroll = window.pageYOffset;
        
        document.getElementById('debug-width').textContent = width + 'px';
        document.getElementById('debug-height').textContent = height + 'px';
        document.getElementById('debug-scroll').textContent = scroll + 'px';
        
        // Breakpoint Detection
        let breakpoint = '';
        let className = '';
        
        if (width < 768) {
            breakpoint = 'Mobile';
            className = 'mobile';
        } else if (width < 1024) {
            breakpoint = 'Tablet';
            className = 'tablet';
        } else if (width < 1440) {
            breakpoint = 'Desktop';
            className = 'desktop';
        } else {
            breakpoint = 'Large';
            className = 'large';
        }
        
        document.getElementById('debug-breakpoint').innerHTML = 
            `<span class="breakpoint ${className}">${breakpoint}</span>`;
    }
    
    // Update on load, resize, and scroll
    updateDebugInfo();
    window.addEventListener('resize', updateDebugInfo);
    window.addEventListener('scroll', updateDebugInfo);
    
    // Höre auf Produkt-Wechsel
    document.addEventListener('productChanged', (event) => {
        const productElement = document.getElementById('debug-product');
        if (productElement) {
            productElement.textContent = event.detail.product.name;
        }
    });
}

// MINIMIEREN-FUNKTION
function toggleDebugOverlay() {
    const overlay = document.querySelector('.debug-overlay');
    const button = document.querySelector('.debug-toggle');
    
    if (overlay.classList.contains('minimized')) {
        overlay.classList.remove('minimized');
        button.textContent = '−';
    } else {
        overlay.classList.add('minimized');
        button.textContent = '+';
    }
}

// Initialize debug overlay
document.addEventListener('DOMContentLoaded', createDebugOverlay);
