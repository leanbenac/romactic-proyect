"use client";

import React, { useRef, useEffect, useImperativeHandle, forwardRef } from "react";

// Flower customization configurations matching the original romantic setup
export const FLOWER_CONFIGS = {
    rose: {
        title: "La flor más linda de mi jardín 🌹",
        body: "Nos vemos en unos días, mi amor",
        colors: [
            { main: "#ff2a6d", accent: "#b50c37", highlight: "#ff7fa5" }, // Romantic pink-red
            { main: "#d90429", accent: "#ef233c", highlight: "#ffb3c1" }, // Classic red
            { main: "#800f2f", accent: "#a4133c", highlight: "#c9184a" }  // Velvet dark red
        ]
    },
    sakura: {
        title: "Te quiero para mi 🌸",
        body: "Quiero verte todos los días cuando me despierto",
        colors: [
            { main: "#ffb7c5", accent: "#ff9ebb", highlight: "#ffffff" }, // Delicate pastel pink
            { main: "#ffa6c9", accent: "#f77fbe", highlight: "#fff0f5" }, // Soft magenta
            { main: "#f3c4db", accent: "#e7a2c6", highlight: "#ffffff" }  // Light lilac pink
        ]
    },
    sunflower: {
        title: "Malu, tenes los ojos mas lindos que vi🌻",
        body: "Quiero tomar mates y comer ñoquis con vos",
        colors: [
            { main: "#ffb703", accent: "#fb8500", highlight: "#ffe893" }, // Vibrant gold
            { main: "#ffc300", accent: "#ff9f1c", highlight: "#fff3b0" }, // Sunshine yellow
            { main: "#e9d8a6", accent: "#ee9b00", highlight: "#ffffff" }  // Soft cream-yellow
        ]
    },
    daisy: {
        title: "Las que a vos te gustan bombon 🌼",
        body: "Sos para mí",
        colors: [
            { main: "#ffffff", accent: "#e9ecef", highlight: "#ffd166" }, // White petals, yellow core
            { main: "#f8f9fa", accent: "#dee2e6", highlight: "#ffb703" }, // Off-white
            { main: "#fffaf0", accent: "#ffeedd", highlight: "#ffd166" }  // Warm ivory
        ]
    }
};

const FlowerCanvas = forwardRef(({ currentType = "rose", isAmbientRunning = false }, ref) => {
    const canvasRef = useRef(null);
    const particlesRef = useRef([]);
    const animationIdRef = useRef(null);

    // Expose explosive burst method to parent UI components
    useImperativeHandle(ref, () => ({
        spawnBurst(count, type) {
            const canvas = canvasRef.current;
            if (!canvas) return;

            const x = canvas.width / 2;
            const y = canvas.height * 0.8;

            for (let i = 0; i < count; i++) {
                const particle = new FlowerParticle(x, y, type || currentType, 1.3, canvas);
                particlesRef.current.push(particle);
            }
        }
    }));

    // Particle Class Definition adapted for React environment
    class FlowerParticle {
        constructor(x, y, type, speedMultiplier = 1, canvas) {
            this.x = x;
            this.y = y;
            this.type = type;
            this.canvas = canvas;
            
            const config = FLOWER_CONFIGS[this.type];
            this.color = config.colors[Math.floor(Math.random() * config.colors.length)];
            
            this.size = Math.random() * 18 + 24; // size range: 24 to 42
            this.opacity = Math.random() * 0.4 + 0.6; // opacity range: 0.6 to 1.0
            
            this.vx = (Math.random() - 0.5) * 6 * speedMultiplier;
            this.vy = -(Math.random() * 8 + 4) * speedMultiplier;
            
            this.angle = Math.random() * Math.PI * 2;
            this.rotationSpeed = (Math.random() - 0.5) * 0.05;
            this.swaySpeed = Math.random() * 0.02 + 0.01;
            this.swayDistance = Math.random() * 2 + 1;
            this.swayOffset = Math.random() * 100;
            
            this.gravity = 0.05;
            this.wind = 0.02;
            
            this.isDead = false;
            this.decay = Math.random() * 0.005 + 0.003;
        }

        update() {
            this.vy += this.gravity;
            this.vx += (Math.sin(Date.now() * this.swaySpeed + this.swayOffset) * this.swayDistance * 0.05) + this.wind;
            
            this.x += this.vx;
            this.y += this.vy;
            
            this.angle += this.rotationSpeed;
            
            this.opacity -= this.decay;
            if (this.opacity <= 0) {
                this.isDead = true;
            }

            if (this.y > this.canvas.height + 20 || this.x < -20 || this.x > this.canvas.width + 20) {
                this.isDead = true;
            }
        }

        draw(ctx) {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.angle);
            ctx.globalAlpha = Math.max(0, this.opacity);

            switch (this.type) {
                case "rose":
                    this.drawRosePetal(ctx);
                    break;
                case "sakura":
                    this.drawSakuraPetal(ctx);
                    break;
                case "sunflower":
                    this.drawSunflowerPetal(ctx);
                    break;
                case "daisy":
                    this.drawDaisyPetal(ctx);
                    break;
            }

            ctx.restore();
        }

        drawRosePetal(ctx) {
            ctx.beginPath();
            ctx.moveTo(0, 0);
            
            ctx.bezierCurveTo(-this.size, -this.size * 0.6, -this.size * 0.8, -this.size * 1.5, 0, -this.size * 1.8);
            ctx.bezierCurveTo(this.size * 0.8, -this.size * 1.5, this.size, -this.size * 0.6, 0, 0);
            
            const grad = ctx.createRadialGradient(0, -this.size, 2, 0, -this.size, this.size);
            grad.addColorStop(0, this.color.highlight);
            grad.addColorStop(0.3, this.color.main);
            grad.addColorStop(1, this.color.accent);
            
            ctx.fillStyle = grad;
            ctx.fill();
            
            ctx.strokeStyle = "rgba(0,0,0,0.1)";
            ctx.lineWidth = 0.5;
            ctx.stroke();
        }

        drawSakuraPetal(ctx) {
            ctx.beginPath();
            ctx.moveTo(0, 0);
            
            ctx.bezierCurveTo(-this.size * 0.9, -this.size * 0.5, -this.size * 0.8, -this.size * 1.4, -this.size * 0.2, -this.size * 1.6);
            ctx.lineTo(0, -this.size * 1.3);
            ctx.lineTo(this.size * 0.2, -this.size * 1.6);
            ctx.bezierCurveTo(this.size * 0.8, -this.size * 1.4, this.size * 0.9, -this.size * 0.5, 0, 0);
            
            const grad = ctx.createLinearGradient(0, 0, 0, -this.size * 1.6);
            grad.addColorStop(0, this.color.accent);
            grad.addColorStop(0.7, this.color.main);
            grad.addColorStop(1, this.color.highlight);
            
            ctx.fillStyle = grad;
            ctx.fill();
        }

        drawSunflowerPetal(ctx) {
            ctx.beginPath();
            ctx.moveTo(0, 0);
            
            ctx.bezierCurveTo(-this.size * 0.4, -this.size * 0.5, -this.size * 0.3, -this.size * 1.6, 0, -this.size * 2);
            ctx.bezierCurveTo(this.size * 0.3, -this.size * 1.6, this.size * 0.4, -this.size * 0.5, 0, 0);
            
            const grad = ctx.createLinearGradient(0, 0, 0, -this.size * 2);
            grad.addColorStop(0, this.color.accent);
            grad.addColorStop(0.5, this.color.main);
            grad.addColorStop(1, this.color.highlight);
            
            ctx.fillStyle = grad;
            ctx.fill();

            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(0, -this.size * 1.4);
            ctx.strokeStyle = "rgba(181, 107, 0, 0.25)";
            ctx.lineWidth = 1;
            ctx.stroke();
        }

        drawDaisyPetal(ctx) {
            const petalCount = 8;
            const r = this.size * 0.6;
            
            ctx.fillStyle = this.color.main;
            for (let i = 0; i < petalCount; i++) {
                ctx.rotate((Math.PI * 2) / petalCount);
                ctx.beginPath();
                ctx.ellipse(0, -r, r * 0.28, r * 0.7, 0, 0, Math.PI * 2);
                ctx.fill();
            }
            
            ctx.beginPath();
            ctx.arc(0, 0, r * 0.35, 0, Math.PI * 2);
            ctx.fillStyle = this.color.highlight;
            ctx.fill();

            ctx.strokeStyle = "rgba(0,0,0,0.1)";
            ctx.lineWidth = 0.5;
            ctx.stroke();
        }
    }

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");

        // Responsive sizing
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        
        window.addEventListener("resize", resizeCanvas);
        resizeCanvas();

        // Handle ambient natural falling petals
        const spawnAmbient = () => {
            if (!isAmbientRunning) return;
            
            if (Math.random() < 0.12 && particlesRef.current.length < 150) {
                const x = Math.random() * canvas.width;
                const y = -30;
                const particle = new FlowerParticle(x, y, currentType, 0.4, canvas);
                
                particle.vx = (Math.random() - 0.5) * 1.5;
                particle.vy = Math.random() * 2 + 1;
                particle.decay = 0; // ambient falls indefinitely until out of bounds
                particle.gravity = 0.015;
                
                particlesRef.current.push(particle);
            }
        };

        // Animation Loop
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            spawnAmbient();

            const particles = particlesRef.current;
            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];
                p.update();
                p.draw(ctx);
                
                if (p.isDead) {
                    particles.splice(i, 1);
                }
            }

            animationIdRef.current = requestAnimationFrame(animate);
        };

        animate();

        // Cleanup
        return () => {
            window.removeEventListener("resize", resizeCanvas);
            if (animationIdRef.current) {
                cancelAnimationFrame(animationIdRef.current);
            }
        };
    }, [currentType, isAmbientRunning]);

    return <canvas ref={canvasRef} />;
});

FlowerCanvas.displayName = "FlowerCanvas";
export default FlowerCanvas;
