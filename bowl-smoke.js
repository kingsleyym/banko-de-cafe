// BOWL RAUCH-ANIMATION (adaptiert von Index-Seite)

function initBowlSmoke() {
    const canvas = document.getElementById('bowl-smoke-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];

    function resize() {
        const container = canvas.parentElement;
        width = container.offsetWidth;
        height = container.offsetHeight;
        canvas.width = width;
        canvas.height = height;
    }
    
    window.addEventListener('resize', resize);
    resize();

    class SmokeParticle {
        constructor() {
            this.reset();
        }
        
        reset() {
            // Partikel über 75% der Canvas-Breite verteilt - INNERHALB der viel größeren Canvas
            this.x = width * 0.125 + Math.random() * width * 0.75; // 75% BREITE der Canvas nutzen
            this.y = height * 0.90; // WEITER UNTEN für die viel höhere Canvas - Bowl-Position beibehalten
            this.radius = 12 + Math.random() * 18; // Größere Partikel für die viel größere Canvas
            this.speed = 0.5 + Math.random() * 0.8; // Etwas schneller für die höhere Canvas
            this.alpha = 0.25 + Math.random() * 0.35; // Etwas transparenter für natürlicheren Look
            this.drift = (Math.random() - 0.5) * 0.15; // Wenig seitliche Bewegung
        }
        
        update() {
            this.y -= this.speed;
            this.x += this.drift;
            this.radius += 0.3; // Partikel werden langsamer größer
            this.alpha -= 0.003; // LANGSAMER verblassen für längere Sichtbarkeit
            
            if (this.alpha <= 0 || this.y < -this.radius) {
                this.reset();
            }
        }
        
        draw() {
            ctx.save();
            ctx.globalAlpha = this.alpha;
            
            // Radialer Gradient für realistischen Rauch
            const gradient = ctx.createRadialGradient(
                this.x, this.y, 0,
                this.x, this.y, this.radius
            );
            gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
            gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.3)');
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    // Viel mehr Partikel für die viermal so breite Canvas
    for (let i = 0; i < 18; i++) {
        particles.push(new SmokeParticle());
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        requestAnimationFrame(animate);
    }

    animate();
}

// Starte Animation wenn DOM geladen ist
document.addEventListener('DOMContentLoaded', initBowlSmoke);
