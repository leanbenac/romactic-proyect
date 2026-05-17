// Canvas Particle Engine & Interactive Logic
function initApp() {
    // Screens and Navigation elements
    const introScreen = document.getElementById('intro-screen');
    const gardenScreen = document.getElementById('garden-screen');
    const startBtn = document.getElementById('start-btn');
    const bloomTriggerBtn = document.getElementById('bloom-trigger-btn');
    const letterContainer = document.querySelector('.letter-container');
    const closeCardBtn = document.querySelector('.close-card-btn');
    const flowerButtons = document.querySelectorAll('.flower-select-btn');
    
    // Letter content nodes
    const letterTitle = document.getElementById('letter-title');
    const letterBody = document.getElementById('letter-body');

    // Canvas Setup
    const canvas = document.getElementById('flowerCanvas');
    const ctx = canvas.getContext('2d');

    let animationId = null;
    let particles = [];
    let currentFlowerType = 'rose'; // 'rose', 'sakura', 'sunflower', 'daisy'
    let isAmbientRunning = false;

    // Responsive Canvas
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Flower customization configurations
    const FLOWER_CONFIGS = {
        rose: {
            title: 'Sos la flor más linda de mi jardin 🌹',
            body: 'Nos vemos en unos días, mi amor',
            colors: [
                { main: '#ff2a6d', accent: '#b50c37', highlight: '#ff7fa5' }, // Romantic pink-red
                { main: '#d90429', accent: '#ef233c', highlight: '#ffb3c1' }, // Classic red
                { main: '#800f2f', accent: '#a4133c', highlight: '#c9184a' }  // Velvet dark red
            ]
        },
        sakura: {
            title: 'Te quiero para mi 🌸',
            body: 'Quiero verte todos los días cuando me despierto',
            colors: [
                { main: '#ffb7c5', accent: '#ff9ebb', highlight: '#ffffff' }, // Delicate pastel pink
                { main: '#ffa6c9', accent: '#f77fbe', highlight: '#fff0f5' }, // Soft magenta
                { main: '#f3c4db', accent: '#e7a2c6', highlight: '#ffffff' }  // Light lilac pink
            ]
        },
        sunflower: {
            title: 'Malu, tenes los ojos mas lindos que vi🌻',
            body: 'Quiero tomar mates y comer ñoquis con vos',
            colors: [
                { main: '#ffb703', accent: '#fb8500', highlight: '#ffe893' }, // Vibrant gold
                { main: '#ffc300', accent: '#ff9f1c', highlight: '#fff3b0' }, // Sunshine yellow
                { main: '#e9d8a6', accent: '#ee9b00', highlight: '#ffffff' }  // Soft cream-yellow
            ]
        },
        daisy: {
            title: 'Las que a vos te gustan bombon 🌼',
            body: 'Sos para mí',
            colors: [
                { main: '#ffffff', accent: '#e9ecef', highlight: '#ffd166' }, // White petals, yellow core
                { main: '#f8f9fa', accent: '#dee2e6', highlight: '#ffb703' }, // Off-white
                { main: '#fffaf0', accent: '#ffeedd', highlight: '#ffd166' }  // Warm ivory
            ]
        }
    };

    // Particle Class Definition
    class FlowerParticle {
        constructor(x, y, type, speedMultiplier = 1) {
            this.x = x;
            this.y = y;
            this.type = type;
            
            // Randomly select a color scheme from current type configs
            const config = FLOWER_CONFIGS[this.type];
            this.color = config.colors[Math.floor(Math.random() * config.colors.length)];
            
            // Physical properties
            this.size = Math.random() * 12 + 10; // size range: 10 to 22
            this.opacity = Math.random() * 0.4 + 0.6; // opacity range: 0.6 to 1.0
            
            // Movement vectors
            this.vx = (Math.random() - 0.5) * 6 * speedMultiplier;
            this.vy = -(Math.random() * 8 + 4) * speedMultiplier;
            
            // Rotation and sway
            this.angle = Math.random() * Math.PI * 2;
            this.rotationSpeed = (Math.random() - 0.5) * 0.05;
            this.swaySpeed = Math.random() * 0.02 + 0.01;
            this.swayDistance = Math.random() * 2 + 1;
            this.swayOffset = Math.random() * 100;
            
            // Gravity/Wind
            this.gravity = 0.05;
            this.wind = 0.02;
            
            // Life span for burst particles
            this.isDead = false;
            this.decay = Math.random() * 0.005 + 0.003;
        }

        update() {
            // Physics math
            this.vy += this.gravity;
            this.vx += (Math.sin(Date.now() * this.swaySpeed + this.swayOffset) * this.swayDistance * 0.05) + this.wind;
            
            this.x += this.vx;
            this.y += this.vy;
            
            this.angle += this.rotationSpeed;
            
            // Slow fade out
            this.opacity -= this.decay;
            if (this.opacity <= 0) {
                this.isDead = true;
            }

            // Screen boundary check
            if (this.y > canvas.height + 20 || this.x < -20 || this.x > canvas.width + 20) {
                this.isDead = true;
            }
        }

        draw(ctx) {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.angle);
            ctx.globalAlpha = this.opacity;

            // Call specific drawing function based on flower type
            switch (this.type) {
                case 'rose':
                    this.drawRosePetal(ctx);
                    break;
                case 'sakura':
                    this.drawSakuraPetal(ctx);
                    break;
                case 'sunflower':
                    this.drawSunflowerPetal(ctx);
                    break;
                case 'daisy':
                    this.drawDaisyPetal(ctx);
                    break;
            }

            ctx.restore();
        }

        // Draw rose petal using bezier curves
        drawRosePetal(ctx) {
            // Draw a beautiful organic curved rose petal
            ctx.beginPath();
            ctx.moveTo(0, 0);
            
            // Curved teardrop shape
            ctx.bezierCurveTo(-this.size, -this.size * 0.6, -this.size * 0.8, -this.size * 1.5, 0, -this.size * 1.8);
            ctx.bezierCurveTo(this.size * 0.8, -this.size * 1.5, this.size, -this.size * 0.6, 0, 0);
            
            // Fill with a gorgeous gradient
            const grad = ctx.createRadialGradient(0, -this.size, 2, 0, -this.size, this.size);
            grad.addColorStop(0, this.color.highlight);
            grad.addColorStop(0.3, this.color.main);
            grad.addColorStop(1, this.color.accent);
            
            ctx.fillStyle = grad;
            ctx.fill();
            
            // Subtle dark border outline for depth
            ctx.strokeStyle = 'rgba(0,0,0,0.1)';
            ctx.lineWidth = 0.5;
            ctx.stroke();
        }

        // Draw notched cherry blossom (sakura) petal
        drawSakuraPetal(ctx) {
            ctx.beginPath();
            ctx.moveTo(0, 0);
            
            // Drawing the notch at the top of the heart-like sakura petal
            ctx.bezierCurveTo(-this.size * 0.9, -this.size * 0.5, -this.size * 0.8, -this.size * 1.4, -this.size * 0.2, -this.size * 1.6);
            ctx.lineTo(0, -this.size * 1.3); // Inner point of the notch
            ctx.lineTo(this.size * 0.2, -this.size * 1.6);
            ctx.bezierCurveTo(this.size * 0.8, -this.size * 1.4, this.size * 0.9, -this.size * 0.5, 0, 0);
            
            const grad = ctx.createLinearGradient(0, 0, 0, -this.size * 1.6);
            grad.addColorStop(0, this.color.accent);
            grad.addColorStop(0.7, this.color.main);
            grad.addColorStop(1, this.color.highlight);
            
            ctx.fillStyle = grad;
            ctx.fill();
        }

        // Draw elongated golden sunflower petal
        drawSunflowerPetal(ctx) {
            ctx.beginPath();
            ctx.moveTo(0, 0);
            
            // Slim elongated oval/teardrop shape
            ctx.bezierCurveTo(-this.size * 0.4, -this.size * 0.5, -this.size * 0.3, -this.size * 1.6, 0, -this.size * 2);
            ctx.bezierCurveTo(this.size * 0.3, -this.size * 1.6, this.size * 0.4, -this.size * 0.5, 0, 0);
            
            const grad = ctx.createLinearGradient(0, 0, 0, -this.size * 2);
            grad.addColorStop(0, this.color.accent);
            grad.addColorStop(0.5, this.color.main);
            grad.addColorStop(1, this.color.highlight);
            
            ctx.fillStyle = grad;
            ctx.fill();

            // Center spine detail
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(0, -this.size * 1.4);
            ctx.strokeStyle = 'rgba(181, 107, 0, 0.25)';
            ctx.lineWidth = 1;
            ctx.stroke();
        }

        // Draw detailed daisy petal/mini daisy
        drawDaisyPetal(ctx) {
            // Draw a full mini daisy
            const petalCount = 8;
            const r = this.size * 0.6;
            
            // Draw petals
            ctx.fillStyle = this.color.main;
            for (let i = 0; i < petalCount; i++) {
                ctx.rotate((Math.PI * 2) / petalCount);
                ctx.beginPath();
                ctx.ellipse(0, -r, r * 0.28, r * 0.7, 0, 0, Math.PI * 2);
                ctx.fill();
            }
            
            // Draw yellow core disk
            ctx.beginPath();
            ctx.arc(0, 0, r * 0.35, 0, Math.PI * 2);
            ctx.fillStyle = this.color.highlight;
            ctx.fill();

            // Core textured border
            ctx.strokeStyle = 'rgba(0,0,0,0.1)';
            ctx.lineWidth = 0.5;
            ctx.stroke();
        }
    }

    // Spawns a dramatic burst of flowers from the center/bottom area
    function spawnBurst(count, type) {
        const x = canvas.width / 2;
        const y = canvas.height * 0.8;
        
        for (let i = 0; i < count; i++) {
            // Send particles in a fan-like upward burst
            const particle = new FlowerParticle(x, y, type, 1.3);
            particles.push(particle);
        }
    }

    // Spawns a slow, natural trickle of ambient falling petals from the top
    function spawnAmbient() {
        if (!isAmbientRunning) return;
        
        // Spawn 1 particle occasionally
        if (Math.random() < 0.12 && particles.length < 150) {
            const x = Math.random() * canvas.width;
            const y = -30;
            const particle = new FlowerParticle(x, y, currentFlowerType, 0.4);
            
            // Lower horizontal speed for falling look, gravity pushes down
            particle.vx = (Math.random() - 0.5) * 1.5;
            particle.vy = Math.random() * 2 + 1;
            particle.decay = 0; // Don't fade out until out of bounds
            particle.gravity = 0.015;
            
            particles.push(particle);
        }
    }

    // Core Animation loop running on RequestAnimationFrame
    function animate() {
        // Clear canvas with transparent alpha to let HTML background show
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Handle ambient falling petals
        spawnAmbient();

        // Update and draw particles
        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.update();
            p.draw(ctx);
            
            if (p.isDead) {
                particles.splice(i, 1);
            }
        }

        animationId = requestAnimationFrame(animate);
    }

    // Navigates from the welcome screen to the main interface
    function startExperience() {
        introScreen.classList.remove('active');
        
        // Small delay to let the screen slide out beautifully
        setTimeout(() => {
            gardenScreen.classList.add('active');
            isAmbientRunning = true;
            
            // Instantly start animating canvas
            animate();
            
            // Spawn an initial soft burst to welcome her
            setTimeout(() => {
                spawnBurst(60, currentFlowerType);
            }, 600);
            
            // Fade in the letter after the first burst
            setTimeout(() => {
                showLetterCard();
            }, 1800);
        }, 400);
    }

    // Updates letter contents to match the selected flower type
    function updateLetterContent(type) {
        const config = FLOWER_CONFIGS[type];
        
        // Crossfade animation helper for letter content
        letterTitle.style.opacity = 0;
        letterBody.style.opacity = 0;
        
        setTimeout(() => {
            letterTitle.textContent = config.title;
            letterBody.textContent = config.body;
            
            letterTitle.style.opacity = 1;
            letterBody.style.opacity = 1;
        }, 250);
    }

    function showLetterCard() {
        letterContainer.classList.add('active');
    }

    function hideLetterCard() {
        letterContainer.classList.remove('active');
    }

    // Event Listeners
    startBtn.addEventListener('click', startExperience);
    
    // Flower button selection click handler
    flowerButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Remove active class from all and add to clicked
            flowerButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const selectedType = btn.getAttribute('data-type');
            currentFlowerType = selectedType;
            
            // Update the message contents with elegant fade transition
            updateLetterContent(selectedType);
            
            // Close letter and reopen to give a clean popping entrance
            hideLetterCard();
            
            // Spawn standard welcome burst of the new type
            spawnBurst(40, selectedType);
            
            // Re-reveal letter
            setTimeout(() => {
                showLetterCard();
            }, 600);
        });
    });

    // Big central action button trigger
    bloomTriggerBtn.addEventListener('click', () => {
        // Massive flower explosion!
        spawnBurst(100, currentFlowerType);
        
        // Temporarily bounce the button even more
        bloomTriggerBtn.style.transform = 'scale(0.9)';
        setTimeout(() => {
            bloomTriggerBtn.style.transform = '';
        }, 150);

        // Make sure letter is closed so she can see the full screen filled with flowers
        hideLetterCard();

        // Reveal letter after explosion settles down
        setTimeout(() => {
            showLetterCard();
        }, 3200);
    });

    closeCardBtn.addEventListener('click', hideLetterCard);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
