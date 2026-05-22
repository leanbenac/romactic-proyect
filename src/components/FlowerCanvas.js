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
    planet: {
        title: "Te quiero para mi 🪐",
        body: "Quiero verte todos los días cuando me despierto",
        colors: [
            { main: "#ffe5b4", accent: "#cca473", highlight: "#80582d" },
            { main: "#c0eeff", accent: "#0096c7", highlight: "#03045e" }
        ]
    },
    galaxy: {
        title: "Malu, tenes los ojos mas lindos del universo 🌌",
        body: "Quiero tomar mates y comer ñoquis con vos",
        colors: [
            { main: "#ffb703", accent: "#fb8500", highlight: "#ffe893" }
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

const roseCache = {};

const FlowerCanvas = forwardRef(({ currentType = "rose", isAmbientRunning = false, ambientMode = "garden" }, ref) => {
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
                const particle = new FlowerParticle(x, y, type || currentType, 1.3, canvas, false);
                particlesRef.current.push(particle);
            }
        }
    }));

    // Particle Class Definition adapted for React environment
    class FlowerParticle {
        constructor(x, y, type, speedMultiplier = 1, canvas, isAmbient = false) {
            this.x = x;
            this.y = y;
            this.type = type;
            this.canvas = canvas;
            this.isAmbient = isAmbient;

            if (this.type === "saturn" || this.type === "blue_planet") {
                this.type = "planet";
            }

            const isFlower = ["rose", "daisy"].includes(this.type);

            if (isFlower) {
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
                if (this.type === "rose") {
                    this.prerenderRose();
                }
            } else if (this.type === "firefly") {
                this.size = Math.random() * 5 + 4; // small glow dots
                this.opacity = Math.random() * 0.5 + 0.3;
                this.maxOpacity = Math.random() * 0.4 + 0.6;

                // Fireflies drift slowly upwards and sway
                this.vx = (Math.random() - 0.5) * 1.0;
                this.vy = -(Math.random() * 0.6 + 0.3);

                this.angle = 0;
                this.rotationSpeed = 0;
                this.swaySpeed = Math.random() * 0.01 + 0.005;
                this.swayDistance = Math.random() * 3 + 2;
                this.swayOffset = Math.random() * 100;

                this.gravity = 0;
                this.wind = (Math.random() - 0.5) * 0.01;
                this.decay = 0; // dies off-screen
                this.isDead = false;

                // Pulsing glow
                this.pulseSpeed = Math.random() * 0.03 + 0.015;
                this.pulseOffset = Math.random() * Math.PI * 2;
            } else if (this.type === "star") {
                // Depth layers: far stars are tiny and dim, close ones bigger and brighter
                const depthLayer = Math.random(); // 0=far, 1=close
                this.depthLayer = depthLayer;
                this.size = depthLayer < 0.6
                    ? Math.random() * 1.2 + 0.5   // far: tiny (0.5-1.7)
                    : Math.random() * 2.5 + 1.5;  // close: larger (1.5-4)

                // Stellar color temperature: white, blue-white, pale yellow, warm orange
                const starPalette = [
                    { r: 255, g: 255, b: 255 }, // white (most common)
                    { r: 255, g: 255, b: 255 },
                    { r: 200, g: 220, b: 255 }, // blue-white (hot O/B type)
                    { r: 200, g: 220, b: 255 },
                    { r: 255, g: 245, b: 200 }, // pale yellow (G type like sun)
                    { r: 255, g: 210, b: 140 }, // warm orange (K/M giant)
                ];
                this.starColor = starPalette[Math.floor(Math.random() * starPalette.length)];

                this.opacity = depthLayer < 0.6
                    ? Math.random() * 0.3 + 0.15  // far: dim
                    : Math.random() * 0.5 + 0.45; // close: bright
                this.maxOpacity = this.opacity + Math.random() * 0.3;

                // Parallax: close stars drift slightly, far ones are static
                this.vx = depthLayer > 0.7 ? (Math.random() - 0.5) * 0.04 : 0;
                this.vy = depthLayer > 0.7 ? (Math.random() - 0.5) * 0.02 : 0;

                this.angle = Math.random() * Math.PI * 2;
                this.rotationSpeed = (Math.random() - 0.5) * 0.001;
                this.swaySpeed = 0;
                this.swayDistance = 0;
                this.swayOffset = 0;

                this.gravity = 0;
                this.wind = 0;
                this.decay = 0;
                this.isDead = false;

                // Twinkling: far stars twinkle faster/more erratically
                this.pulseSpeed = depthLayer < 0.6
                    ? Math.random() * 0.08 + 0.04
                    : Math.random() * 0.03 + 0.01;
                this.pulseOffset = Math.random() * Math.PI * 2;
            } else if (this.type === "shooting_star") {
                this.size = Math.random() * 2.5 + 1.5;
                this.opacity = 1;

                // Random angle: mostly top-left to bottom-right, with some variation
                const speed = Math.random() * 14 + 16;
                const baseAngle = Math.PI * (0.1 + Math.random() * 0.2); // 18-54 deg
                this.vx = Math.cos(baseAngle) * speed;
                this.vy = Math.sin(baseAngle) * speed;
                this.trailLength = Math.random() * 8 + 8; // variable trail length

                this.angle = baseAngle;
                this.rotationSpeed = 0;
                this.swaySpeed = 0;
                this.swayDistance = 0;
                this.swayOffset = 0;

                this.gravity = 0;
                this.wind = 0;
                this.decay = 0.025; // slightly slower fadeout
                this.isDead = false;

            } else if (this.type === "planet") {
                const baseSize = Math.random() * 9 + 10;
                this.size = isAmbient ? baseSize * 0.6 : baseSize;
                this.opacity = Math.random() * 0.4 + 0.6;
                this.ringAngle = -0.22;
                this.planetSubtype = Math.floor(Math.random() * 4); // 4 varieties

                if (isAmbient) {
                    this.vx = (Math.random() - 0.5) * 0.8;
                    this.vy = -(Math.random() * 0.4 + 0.15);
                    this.gravity = 0;
                    this.wind = 0.005;
                    this.decay = 0;
                } else {
                    this.vx = (Math.random() - 0.5) * 6 * speedMultiplier;
                    this.vy = -(Math.random() * 8 + 3.5) * speedMultiplier;
                    this.gravity = 0.045;
                    this.wind = 0.015;
                    this.decay = Math.random() * 0.004 + 0.002;
                }

                this.angle = Math.random() * Math.PI * 2;
                this.rotationSpeed = (Math.random() - 0.5) * (isAmbient ? 0.005 : 0.02);
                this.swaySpeed = isAmbient ? Math.random() * 0.01 + 0.005 : 0;
                this.swayDistance = isAmbient ? Math.random() * 4 + 2 : 0;
                this.swayOffset = Math.random() * 100;
                this.isDead = false;
            } else if (this.type === "galaxy") {
                const baseSize = Math.random() * 22 + 20;
                this.size = isAmbient ? baseSize * 0.7 : baseSize;
                this.opacity = isAmbient ? Math.random() * 0.3 + 0.4 : Math.random() * 0.5 + 0.5;
                this.galaxySubtype = Math.floor(Math.random() * 3); // 3 varieties

                if (isAmbient) {
                    this.vx = (Math.random() - 0.5) * 0.6;
                    this.vy = -(Math.random() * 0.3 + 0.1);
                    this.gravity = 0;
                    this.wind = 0.004;
                    this.decay = 0;
                } else {
                    this.vx = (Math.random() - 0.5) * 5 * speedMultiplier;
                    this.vy = -(Math.random() * 7 + 2.5) * speedMultiplier;
                    this.gravity = 0.04;
                    this.wind = 0.01;
                    this.decay = Math.random() * 0.0035 + 0.0018;
                }

                this.angle = Math.random() * Math.PI * 2;
                this.rotationSpeed = (Math.random() - 0.5) * (isAmbient ? 0.004 : 0.015);
                this.swaySpeed = isAmbient ? Math.random() * 0.008 + 0.004 : 0;
                this.swayDistance = isAmbient ? Math.random() * 5 + 3 : 0;
                this.swayOffset = Math.random() * 100;
                this.isDead = false;
            } else if (this.type === "nebula") {
                // Large, soft, semi-transparent colored gas cloud
                this.size = Math.random() * 80 + 60;
                this.opacity = Math.random() * 0.06 + 0.03; // very subtle
                this.maxOpacity = this.opacity;

                // Nebula color palette
                const nebulaPalette = [
                    { r: 120, g: 40, b: 160 },  // deep violet
                    { r: 40, g: 80, b: 160 },   // cobalt blue
                    { r: 160, g: 40, b: 100 },  // rose/magenta
                    { r: 30, g: 120, b: 130 },  // teal
                    { r: 80, g: 30, b: 120 },   // purple
                ];
                this.nebulaColor = nebulaPalette[Math.floor(Math.random() * nebulaPalette.length)];

                this.vx = 0;
                this.vy = 0;
                this.angle = Math.random() * Math.PI * 2;
                this.rotationSpeed = (Math.random() - 0.5) * 0.0005;
                this.swaySpeed = 0;
                this.swayDistance = 0;
                this.swayOffset = 0;
                this.gravity = 0;
                this.wind = 0;
                this.decay = 0;
                this.isDead = false;

                // Very slow breathing pulse
                this.pulseSpeed = Math.random() * 0.008 + 0.003;
                this.pulseOffset = Math.random() * Math.PI * 2;
            }
        }

        update() {
            this.vy += this.gravity;
            this.vx += (Math.sin(Date.now() * this.swaySpeed + this.swayOffset) * this.swayDistance * 0.05) + this.wind;

            this.x += this.vx;
            this.y += this.vy;

            this.angle += this.rotationSpeed;

            // Special update for twinkling or pulsing elements
            if (this.type === "firefly" || this.type === "star" || this.type === "nebula") {
                this.opacity = this.maxOpacity * (0.3 + 0.7 * Math.sin(Date.now() * this.pulseSpeed + this.pulseOffset));
            } else {
                this.opacity -= this.decay;
                if (this.opacity <= 0) {
                    this.isDead = true;
                }
            }

            // Boundaries check
            if (this.type === "shooting_star") {
                if (this.y > this.canvas.height + 20 || this.x > this.canvas.width + 20) {
                    this.isDead = true;
                }
            } else if (this.type === "star" || this.type === "nebula") {
                // Stars/nebulae stay put, check if off-screen on resize
                if (this.x < -20 || this.x > this.canvas.width + 20 || this.y < -20 || this.y > this.canvas.height + 20) {
                    this.isDead = true;
                }
            } else {
                if (this.y < -50 || this.y > this.canvas.height + 50 || this.x < -50 || this.x > this.canvas.width + 50) {
                    this.isDead = true;
                }
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
                case "planet":
                case "saturn":
                case "blue_planet":
                    this.drawPlanetVariety(ctx);
                    break;
                case "galaxy":
                    this.drawGalaxyVariety(ctx);
                    break;
                case "daisy":
                    this.drawDaisyPetal(ctx);
                    break;
                case "firefly":
                    this.drawFirefly(ctx);
                    break;
                case "star":
                    this.drawStar(ctx);
                    break;
                case "shooting_star":
                    this.drawShootingStar(ctx);
                    break;
                case "nebula":
                    this.drawNebula(ctx);
                    break;
            }

            ctx.restore();
        }

        prerenderRose() {
            const size = Math.round(this.size * 0.65);
            const key = `${this.color.main}_${this.color.accent}_${this.color.highlight}_${size}`;

            if (roseCache[key]) {
                this.roseCanvas = roseCache[key].canvas;
                this.roseOffsetX = roseCache[key].offsetX;
                this.roseOffsetY = roseCache[key].offsetY;
                return;
            }

            const canvasSize = Math.ceil(size * 5);
            const offCanvas = document.createElement("canvas");
            offCanvas.width = canvasSize;
            offCanvas.height = canvasSize;
            const offCtx = offCanvas.getContext("2d");

            const cx = canvasSize / 2;
            const cy = canvasSize * 0.38;
            offCtx.translate(cx, cy);

            const drawPetalShape = (r, rotation, scaleX, scaleY) => {
                offCtx.save();
                offCtx.rotate(rotation);
                offCtx.scale(scaleX, scaleY);
                offCtx.beginPath();
                offCtx.moveTo(0, 0);
                offCtx.bezierCurveTo(-r * 0.8, -r * 0.5, -r * 0.6, -r * 1.3, 0, -r * 1.5);
                offCtx.bezierCurveTo(r * 0.6, -r * 1.3, r * 0.8, -r * 0.5, 0, 0);
                offCtx.fill();
                offCtx.strokeStyle = "rgba(0,0,0,0.12)";
                offCtx.lineWidth = 0.6;
                offCtx.stroke();
                offCtx.restore();
            };

            // Layer 1: 5 large outer petals
            const petalCount = 5;
            for (let i = 0; i < petalCount; i++) {
                const angle = (i * Math.PI * 2) / petalCount;
                const pGrad = offCtx.createRadialGradient(0, 0, size * 0.5, 0, 0, size * 1.2);
                pGrad.addColorStop(0, this.color.main);
                pGrad.addColorStop(1, this.color.accent);
                offCtx.fillStyle = pGrad;
                drawPetalShape(size * 0.8, angle, 1.2, 0.9);
            }

            // Layer 2: 4 mid petals rotated slightly
            const midCount = 4;
            for (let i = 0; i < midCount; i++) {
                const angle = (i * Math.PI * 2) / midCount + 0.3;
                const pGrad = offCtx.createRadialGradient(0, 0, size * 0.2, 0, 0, size * 0.8);
                pGrad.addColorStop(0, this.color.highlight);
                pGrad.addColorStop(1, this.color.main);
                offCtx.fillStyle = pGrad;
                drawPetalShape(size * 0.65, angle, 1.1, 0.85);
            }

            // Layer 3: Inner tight bud petals
            const innerCount = 3;
            for (let i = 0; i < innerCount; i++) {
                const angle = (i * Math.PI * 2) / innerCount + 0.6;
                offCtx.fillStyle = this.color.highlight;
                drawPetalShape(size * 0.45, angle, 1.0, 0.8);
            }

            // Add stem and leaf behind the rose (slightly shorter)
            offCtx.save();
            offCtx.globalCompositeOperation = "destination-over";
            offCtx.strokeStyle = "#40916c";
            offCtx.lineWidth = size * 0.14;
            offCtx.lineCap = "round";
            offCtx.beginPath();
            offCtx.moveTo(0, 0);
            offCtx.quadraticCurveTo(-size * 0.5, size * 0.8, -size * 0.2, size * 1.85);
            offCtx.stroke();

            // Left Leaf
            offCtx.fillStyle = "#52b788";
            offCtx.beginPath();
            offCtx.ellipse(-size * 0.38, size * 0.7, size * 0.35, size * 0.17, Math.PI / 3, 0, Math.PI * 2);
            offCtx.fill();

            // Right Leaf
            offCtx.beginPath();
            offCtx.ellipse(size * 0.22, size * 0.8, size * 0.26, size * 0.13, -Math.PI / 6, 0, Math.PI * 2);
            offCtx.fill();

            offCtx.restore();

            // Cache the canvas
            roseCache[key] = {
                canvas: offCanvas,
                offsetX: -cx,
                offsetY: -cy
            };

            this.roseCanvas = offCanvas;
            this.roseOffsetX = -cx;
            this.roseOffsetY = -cy;
        }

        drawRosePetal(ctx) {
            if (this.roseCanvas) {
                ctx.drawImage(this.roseCanvas, this.roseOffsetX, this.roseOffsetY);
            }
        }

        drawPlanetVariety(ctx) {
            const size = this.size;

            // Pre-calculate colors and features based on subtype
            let centerGrad = ctx.createRadialGradient(-size * 0.25, -size * 0.25, 0, 0, 0, size);
            let ringColor = "";
            let ringWidth = size * 0.15;
            let hasRings = false;
            let ringTilt = this.ringAngle;

            if (this.planetSubtype === 0) { // Golden Saturn
                centerGrad.addColorStop(0, "#ffe5b4");
                centerGrad.addColorStop(0.7, "#cca473");
                centerGrad.addColorStop(1, "#80582d");
                ringColor = "rgba(224, 185, 120, 0.75)";
                ringWidth = size * 0.22;
                hasRings = true;
            } else if (this.planetSubtype === 1) { // Blue Giant
                centerGrad.addColorStop(0, "#c0eeff");
                centerGrad.addColorStop(0.6, "#0096c7");
                centerGrad.addColorStop(1, "#03045e");
                ringColor = "rgba(160, 230, 255, 0.45)";
                ringWidth = size * 0.08;
                hasRings = true;
                ringTilt = -0.15;
            } else if (this.planetSubtype === 2) { // Red Planet
                centerGrad.addColorStop(0, "#ffb3a7");
                centerGrad.addColorStop(0.65, "#d90429");
                centerGrad.addColorStop(1, "#5c0612");
                hasRings = false;
            } else { // Emerald Gas Giant
                centerGrad.addColorStop(0, "#d8f3dc");
                centerGrad.addColorStop(0.7, "#2d6a4f");
                centerGrad.addColorStop(1, "#081c15");
                ringColor = "rgba(180, 240, 210, 0.55)";
                ringWidth = size * 0.12;
                hasRings = true;
                ringTilt = 0.1;
            }

            // Draw back half of rings if present
            if (hasRings) {
                ctx.save();
                ctx.rotate(ringTilt);
                ctx.beginPath();
                ctx.ellipse(0, 0, size * 1.45, size * 0.28, 0, Math.PI, 0);
                ctx.strokeStyle = ringColor;
                ctx.lineWidth = ringWidth;
                ctx.stroke();
                ctx.restore();
            }

            // Draw planet body
            ctx.beginPath();
            ctx.fillStyle = centerGrad;
            ctx.arc(0, 0, size, 0, Math.PI * 2);
            ctx.fill();

            // Draw extra atmospheric detail (spots/bands)
            if (this.planetSubtype === 2) { // Mars spots/craters
                ctx.fillStyle = "rgba(0, 0, 0, 0.12)";
                ctx.beginPath();
                ctx.arc(-size * 0.3, size * 0.2, size * 0.22, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
                ctx.arc(size * 0.4, -size * 0.2, size * 0.18, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
                ctx.arc(-size * 0.1, -size * 0.4, size * 0.12, 0, Math.PI * 2);
                ctx.fill();
            } else { // Gas giant banding
                ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
                ctx.lineWidth = size * 0.15;
                ctx.beginPath();
                ctx.arc(0, 0, size, Math.PI * 0.1, Math.PI * 0.9);
                ctx.stroke();

                ctx.strokeStyle = "rgba(0, 0, 0, 0.08)";
                ctx.lineWidth = size * 0.12;
                ctx.beginPath();
                ctx.arc(0, 0, size, Math.PI * 1.1, Math.PI * 1.9);
                ctx.stroke();
            }

            // Draw front half of rings if present
            if (hasRings) {
                ctx.save();
                ctx.rotate(ringTilt);
                ctx.beginPath();
                ctx.ellipse(0, 0, size * 1.45, size * 0.28, 0, 0, Math.PI);
                ctx.strokeStyle = ringColor;
                ctx.lineWidth = ringWidth;
                ctx.stroke();
                ctx.restore();
            }
        }

        drawGalaxyVariety(ctx) {
            const size = this.size;
            ctx.save();

            let coreColor = "rgba(255, 215, 255, 0.85)";
            let outerColor = "rgba(160, 110, 255, 0.35)";
            let armColor = "rgba(230, 195, 255, 0.75)";
            let arms = 2;
            let armTwist = 1.7;
            let particlesPerArm = 14;
            let hasBar = false;

            if (this.galaxySubtype === 0) { // Violet Spiral
                coreColor = "rgba(255, 215, 255, 0.85)";
                outerColor = "rgba(160, 110, 255, 0.35)";
                armColor = "rgba(230, 195, 255, 0.75)";
                arms = 2;
            } else if (this.galaxySubtype === 1) { // Golden Barred
                coreColor = "rgba(255, 250, 200, 0.9)";
                outerColor = "rgba(255, 180, 50, 0.35)";
                armColor = "rgba(255, 220, 130, 0.75)";
                arms = 2;
                hasBar = true;
            } else { // Cyan 3-Arm Swirl
                coreColor = "rgba(220, 255, 255, 0.9)";
                outerColor = "rgba(0, 180, 216, 0.35)";
                armColor = "rgba(144, 224, 239, 0.75)";
                arms = 3;
                armTwist = 2.1;
                particlesPerArm = 12;
            }

            // Core glow
            const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, size * 0.55);
            grad.addColorStop(0, coreColor);
            grad.addColorStop(0.4, outerColor);
            grad.addColorStop(1, "rgba(0, 0, 0, 0)");
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(0, 0, size * 0.55, 0, Math.PI * 2);
            ctx.fill();

            // Draw central stellar bar if barred galaxy
            if (hasBar) {
                ctx.fillStyle = coreColor;
                ctx.save();
                ctx.beginPath();
                ctx.ellipse(0, 0, size * 0.6, size * 0.15, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }

            // Draw spiral arms
            ctx.fillStyle = armColor;
            for (let arm = 0; arm < arms; arm++) {
                const baseAngle = (arm * Math.PI * 2) / arms + (hasBar ? 0.3 : 0);
                for (let i = 0; i < particlesPerArm; i++) {
                    const factor = i / particlesPerArm;
                    const distance = (hasBar ? 0.35 + factor * 0.65 : factor) * size * 1.45;
                    const angle = baseAngle + factor * Math.PI * armTwist;

                    const px = Math.cos(angle) * distance;
                    const py = Math.sin(angle) * distance;
                    const pSize = (1 - factor) * 2.2 + 0.4;

                    ctx.beginPath();
                    ctx.arc(px, py, pSize, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
            ctx.restore();
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

        drawFirefly(ctx) {
            ctx.beginPath();
            const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size);
            grad.addColorStop(0, "rgba(255, 236, 120, 1)");
            grad.addColorStop(0.2, "rgba(235, 215, 60, 0.8)");
            grad.addColorStop(0.5, "rgba(200, 200, 30, 0.3)");
            grad.addColorStop(1, "rgba(200, 200, 30, 0)");
            ctx.fillStyle = grad;
            ctx.arc(0, 0, this.size, 0, Math.PI * 2);
            ctx.fill();
        }

        drawStar(ctx) {
            const { r, g, b } = this.starColor || { r: 255, g: 255, b: 255 };
            const s = this.size;

            // Soft outer glow halo
            const halo = ctx.createRadialGradient(0, 0, 0, 0, 0, s * 2.5);
            halo.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.3)`);
            halo.addColorStop(0.4, `rgba(${r}, ${g}, ${b}, 0.08)`);
            halo.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
            ctx.fillStyle = halo;
            ctx.beginPath();
            ctx.arc(0, 0, s * 2.5, 0, Math.PI * 2);
            ctx.fill();

            // 4-pointed cross flare
            ctx.beginPath();
            ctx.moveTo(0, -s);
            ctx.quadraticCurveTo(0, 0, s, 0);
            ctx.quadraticCurveTo(0, 0, 0, s);
            ctx.quadraticCurveTo(0, 0, -s, 0);
            ctx.quadraticCurveTo(0, 0, 0, -s);
            ctx.closePath();

            const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, s);
            grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, 1)`);
            grad.addColorStop(0.3, `rgba(${r}, ${g}, ${b}, 0.7)`);
            grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
            ctx.fillStyle = grad;
            ctx.fill();
        }

        drawShootingStar(ctx) {
            const tLen = (this.trailLength || 10) * this.size;

            // Outer wide glow trail
            ctx.beginPath();
            const outerGrad = ctx.createLinearGradient(0, 0, -tLen, 0);
            outerGrad.addColorStop(0, "rgba(200, 220, 255, 0.4)");
            outerGrad.addColorStop(0.3, "rgba(180, 200, 255, 0.15)");
            outerGrad.addColorStop(1, "rgba(180, 200, 255, 0)");
            ctx.strokeStyle = outerGrad;
            ctx.lineWidth = this.size * 2.5;
            ctx.lineCap = "round";
            ctx.moveTo(0, 0);
            ctx.lineTo(-tLen, 0);
            ctx.stroke();

            // Inner bright trail core
            ctx.beginPath();
            const innerGrad = ctx.createLinearGradient(0, 0, -tLen * 0.7, 0);
            innerGrad.addColorStop(0, "rgba(255, 255, 255, 1)");
            innerGrad.addColorStop(0.3, "rgba(220, 240, 255, 0.8)");
            innerGrad.addColorStop(1, "rgba(200, 220, 255, 0)");
            ctx.strokeStyle = innerGrad;
            ctx.lineWidth = this.size * 0.6;
            ctx.lineCap = "round";
            ctx.moveTo(0, 0);
            ctx.lineTo(-tLen * 0.7, 0);
            ctx.stroke();

            // Leading head glow
            const headGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size * 2);
            headGrad.addColorStop(0, "rgba(255, 255, 255, 1)");
            headGrad.addColorStop(0.3, "rgba(200, 230, 255, 0.6)");
            headGrad.addColorStop(1, "rgba(200, 230, 255, 0)");
            ctx.beginPath();
            ctx.arc(0, 0, this.size * 2, 0, Math.PI * 2);
            ctx.fillStyle = headGrad;
            ctx.fill();
        }

        drawNebula(ctx) {
            const { r, g, b } = this.nebulaColor || { r: 120, g: 40, b: 160 };
            const s = this.size;

            // Main gas cloud
            const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, s);
            grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.35)`);
            grad.addColorStop(0.3, `rgba(${r}, ${g}, ${b}, 0.18)`);
            grad.addColorStop(0.6, `rgba(${r}, ${g}, ${b}, 0.06)`);
            grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(0, 0, s, 0, Math.PI * 2);
            ctx.fill();

            // Secondary offset lobe for organic shape
            const grad2 = ctx.createRadialGradient(s * 0.3, -s * 0.2, 0, s * 0.3, -s * 0.2, s * 0.65);
            grad2.addColorStop(0, `rgba(${Math.min(r + 40, 255)}, ${Math.min(g + 30, 255)}, ${Math.min(b + 50, 255)}, 0.2)`);
            grad2.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
            ctx.fillStyle = grad2;
            ctx.beginPath();
            ctx.arc(s * 0.3, -s * 0.2, s * 0.65, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");

        // Clean up old ambient particles when mode changes
        particlesRef.current = particlesRef.current.filter(p => {
            if (p.decay > 0) return true; // keep explosion particles
            if (ambientMode === "garden" && ["rose", "planet", "galaxy", "daisy"].includes(p.type)) return true;
            if (ambientMode === "stars" && ["star", "planet", "galaxy", "nebula"].includes(p.type)) return true;
            return false;
        });

        // Pre-populate stars and nebulae immediately if cosmos is selected
        if (ambientMode === "stars") {
            // Nebula clouds first (drawn behind everything)
            const nebulaCount = 5;
            for (let i = 0; i < nebulaCount; i++) {
                const x = Math.random() * canvas.width;
                const y = Math.random() * canvas.height;
                const particle = new FlowerParticle(x, y, "nebula", 1, canvas, true);
                particlesRef.current.push(particle);
            }

            // Dense starfield
            const starCount = 80;
            for (let i = 0; i < starCount; i++) {
                const x = Math.random() * canvas.width;
                const y = Math.random() * canvas.height;
                const particle = new FlowerParticle(x, y, "star", 1, canvas, true);
                particlesRef.current.push(particle);
            }
        }

        // Responsive sizing
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener("resize", resizeCanvas);
        resizeCanvas();

        // Handle ambient particles generation based on active mode
        const spawnAmbient = () => {
            if (!isAmbientRunning) return;
            const particles = particlesRef.current;

            switch (ambientMode) {
                case "garden": {
                    if (Math.random() < 0.12 && particles.filter(p => ["rose", "planet", "galaxy", "daisy"].includes(p.type)).length < 120) {
                        const x = Math.random() * canvas.width;
                        const y = -30;
                        const particle = new FlowerParticle(x, y, currentType, 0.4, canvas, true);

                        particle.vx = (Math.random() - 0.5) * 1.5;
                        particle.vy = Math.random() * 2 + 1;
                        particle.decay = 0; // ambient falls indefinitely until out of bounds
                        particle.gravity = 0.015;

                        particles.push(particle);
                    }
                    break;
                }
                case "stars": {
                    // Replenish stars to maintain dense starfield
                    const currentStars = particles.filter(p => p.type === "star");
                    if (currentStars.length < 80 && Math.random() < 0.2) {
                        const x = Math.random() * canvas.width;
                        const y = Math.random() * canvas.height;
                        const particle = new FlowerParticle(x, y, "star", 1, canvas, true);
                        particles.push(particle);
                    }
                    // Drift 1-3 tiny background planets/galaxies slowly
                    const cosmicAmbientCount = particles.filter(p => ["planet", "galaxy"].includes(p.type) && p.decay === 0).length;
                    if (cosmicAmbientCount < 3 && Math.random() < 0.004) {
                        const x2 = Math.random() * canvas.width;
                        const y2 = canvas.height + 40;
                        const roll = Math.random();
                        let pType = roll < 0.65 ? "planet" : "galaxy";
                        const particle2 = new FlowerParticle(x2, y2, pType, 0.8, canvas, true);
                        particles.push(particle2);
                    }
                    // Shooting stars (slightly more frequent)
                    if (Math.random() < 0.005 && particles.filter(p => p.type === "shooting_star").length < 2) {
                        const x3 = Math.random() * (canvas.width * 0.8) - 50;
                        const y3 = Math.random() * (canvas.height * 0.3) - 50;
                        const particle3 = new FlowerParticle(x3, y3, "shooting_star", 1, canvas, true);
                        particles.push(particle3);
                    }
                    break;
                }
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
    }, [currentType, isAmbientRunning, ambientMode]);

    return <canvas ref={canvasRef} />;
});

FlowerCanvas.displayName = "FlowerCanvas";
export default FlowerCanvas;
