"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FlowerCanvas, { FLOWER_CONFIGS } from "@/components/FlowerCanvas";

// Weekdays labels in Spanish
const WEEKDAYS = [
    { name: "Domingo", id: 0 },
    { name: "Lunes", id: 1 },
    { name: "Martes", id: 2 },
    { name: "Miércoles", id: 3 },
    { name: "Jueves", id: 4 },
    { name: "Viernes", id: 5 },
    { name: "Sábado", id: 6 }
];

// Curated daily messages for Malu
const DAILY_MESSAGES = {
    0: { // Domingo
        icon: "🍯",
        title: "Que tengas lindo domingo bombon ",
        body: "Quiero que sepas que quiero pasar mis domingos con vos. Ojalá tuviera palabras para explicar lo que siento por vos, pero prefiero demostrártelo abrazándote fuerte cada vez que te veo. ¡Que tengas un lindo Domingo hermosa! ❤️"
    },
    1: { // Lunes
        icon: "☀️",
        title: "Empezar la semana con tu sonrisa ☀️",
        body: "Sé que los lunes a veces cuestan un poquito, pero pensar en vos hace que todo sea mil veces más fácil. Te mando un beso gigante para arrancar la semana con toda la energía. ¡Te quiero de acá al infinito y más allá! 💋🌹"
    },
    2: { // Martes
        icon: "🌸",
        title: "Una razón para sonreír hoy 🌸",
        body: "Si estás teniendo un día largo, acordate de que hay alguien que no puede dejar de pensar en lo afortunado que es de tenerte en su vida. Sos mi cable a tierra y mi lugar favorito en el mundo. ¡Te adoro bombonazo! 💕"
    },
    3: { // Miércoles
        icon: "✨",
        title: "Mitad de semana... ¡ya falta poco! ✨",
        body: "Mi amor, ya estamos a mitad de camino. Cada día que pasa es un día menos para volver a vernos, llenarte de besos y reírnos de cualquier pavada como siempre. Te extraño y te pienso a cada segundo. ¡Falta poquito! ❤️✨"
    },
    4: { // Jueves
        icon: "💖",
        title: "Un pedacito de mi corazón es tuyo 💖",
        body: "Malu, tenés una magia única que alegra todo a tu alrededor. Gracias por ser tan dulce, tan compañera y tan increíble conmigo. Nunca olvides lo especial que sos para mí. Te amo con locura. 🌻"
    },
    5: { // Viernes
        icon: "🎉",
        title: "¡Llegó el viernes, mi vida! 🎉",
        body: "Se termina la semana y solo puedo pensar en los momentos hermosos que nos quedan por vivir juntos. Sos mi felicidad entera, bombonazo. ¡Disfrutá mucho de tu viernes, te mereces lo mejor! 🥂❤️"
    },
    6: { // Sábado
        icon: "🥂",
        title: "Nuestro día especial 🥂✨",
        body: "Los sábados son para relajar, tomar unos mates y soñar despiertos. Gracias por hacerme tan feliz todos los días de mi vida. Sos la flor más hermosa de mi jardín personal. Te amo hoy y siempre, mi amor. 🌹💋"
    }
};

// 5 Real Polaroid photo memories
const POLAROID_MEMORIES = [
    {
        id: "moto",
        src: "/real_moto.jpg",
        caption: "Nuestras salidas... 🏍️❤️",
        defaultStyle: { left: "3%", top: "14%" },
        rotation: -7
    },
    {
        id: "selfie",
        src: "/real_selfie.jpg",
        caption: "Mi lugar favorito... 🌴✨",
        defaultStyle: { right: "3%", top: "16%" },
        rotation: 6
    },
    {
        id: "flowers",
        src: "/real_yellow_flowers.jpg",
        caption: "La más hermosa de mi jardín... 🌼💛",
        defaultStyle: { left: "18%", top: "25%" },
        rotation: -4
    },
    {
        id: "glasses",
        src: "/real_glasses.jpg",
        caption: "La más facherita... 😎🥂",
        defaultStyle: { right: "16%", top: "29%" },
        rotation: 8
    },
    {
        id: "wine",
        src: "/real_wine.jpg",
        caption: "Nuestras copitas de vino... 🍷🍇",
        defaultStyle: { left: "10%", top: "35%" },
        rotation: -2
    }
];

export default function Home() {
    const [screen, setScreen] = useState("intro"); // "intro" | "garden"
    const [activeTab, setActiveTab] = useState("garden"); // "garden" | "messages" | "moments"
    const [activeFlowerType, setActiveFlowerType] = useState("rose");
    const [isLetterOpen, setIsLetterOpen] = useState(false);
    const [isAmbientRunning, setIsAmbientRunning] = useState(false);
    
    // Daily message features
    const [todayIndex, setTodayIndex] = useState(1); // will fetch dynamically in useEffect
    const [selectedMessage, setSelectedMessage] = useState(null); // Active read modal
    const [shakeDayId, setShakeDayId] = useState(null); // Shake state for locked days
    const [warningModalDay, setWarningModalDay] = useState(null); // Active cheat alert modal

    const canvasRef = useRef(null);

    // Fetch exact day on client mounts
    useEffect(() => {
        const day = new Date().getDay();
        setTodayIndex(day);
    }, []);

    // Navigates from intro screen to garden and triggers welcoming bursts
    const startExperience = () => {
        setScreen("garden");
        setIsAmbientRunning(true);

        // Welcoming burst
        setTimeout(() => {
            if (canvasRef.current) {
                canvasRef.current.spawnBurst(60, activeFlowerType);
            }
        }, 600);

        // Slide up the romantic letter
        setTimeout(() => {
            setIsLetterOpen(true);
        }, 1800);
    };

    // Handles switching the active flower type with custom delays
    const handleSelectFlowerType = (type) => {
        if (type === activeFlowerType) return;
        
        setIsLetterOpen(false);
        setActiveFlowerType(type);

        setTimeout(() => {
            if (canvasRef.current) {
                canvasRef.current.spawnBurst(45, type);
            }
            setTimeout(() => {
                setIsLetterOpen(true);
            }, 500);
        }, 300);
    };

    // Massive bloom explosion handler
    const handleBloomTrigger = () => {
        if (canvasRef.current) {
            canvasRef.current.spawnBurst(100, activeFlowerType);
        }

        setIsLetterOpen(false);

        // Re-reveal the card
        setTimeout(() => {
            if (activeTab === "garden") {
                setIsLetterOpen(true);
            }
        }, 3200);
    };

    // Handles daily box unlock click
    const handleDayClick = (day) => {
        const isUnlocked = day.id <= todayIndex;

        if (isUnlocked) {
            setSelectedMessage(DAILY_MESSAGES[day.id]);
            if (canvasRef.current) {
                canvasRef.current.spawnBurst(30, activeFlowerType);
            }
        } else {
            setShakeDayId(day.id);
            setTimeout(() => setShakeDayId(null), 500);
            setWarningModalDay(day.name);
        }
    };

    const currentConfig = FLOWER_CONFIGS[activeFlowerType];

    return (
        <>
            {/* Visual background elements */}
            <div className="bg-vignette" />
            <FlowerCanvas
                ref={canvasRef}
                currentType={activeFlowerType}
                isAmbientRunning={isAmbientRunning}
            />

            {/* Screen Content Container */}
            <main className="app-container">
                <AnimatePresence mode="wait">
                    {/* STEP 1: WELCOME INTRO */}
                    {screen === "intro" && (
                        <motion.div
                            key="intro-screen"
                            initial={{ opacity: 0, scale: 0.96, y: 15 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.96, y: -25 }}
                            transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
                            className="screen active"
                        >
                            <div className="glass-card intro-card">
                                <motion.div 
                                    className="heart-icon-container"
                                    whileHover={{ scale: 1.05 }}
                                >
                                    <motion.svg
                                        className="heart-pulse"
                                        viewBox="0 0 32 32"
                                        xmlns="http://www.w3.org/2000/svg"
                                        animate={{ scale: [1, 1.2, 1, 1.15, 1, 1] }}
                                        transition={{
                                            repeat: Infinity,
                                            duration: 1.8,
                                            ease: "easeInOut"
                                        }}
                                    >
                                        <path
                                            d="M16 28.5S2 16.5 2 9.5a7.5 7.5 0 0 1 13-5.2A7.5 7.5 0 0 1 30 9.5c0 7-14 19-14 19z"
                                            fill="currentColor"
                                        />
                                    </motion.svg>
                                </motion.div>
                                <h1 className="elegant-title">Hola, Malu...</h1>
                                <p className="subtitle">
                                    He preparado un pequeño detalle interactivo especialmente para vos. ¿Querés verlo?
                                </p>
                                <motion.button
                                    id="start-btn"
                                    className="premium-btn"
                                    onClick={startExperience}
                                    whileHover={{ scale: 1.05, y: -4 }}
                                    whileTap={{ scale: 0.96 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                                >
                                    Hace Florecer 🌸
                                </motion.button>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 2: APP DASHBOARD SCREENS */}
                    {screen === "garden" && (
                        <motion.div 
                            key="app-content" 
                            className="screen active" 
                            style={{ pointerEvents: "none" }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <AnimatePresence mode="wait">
                                
                                {/* TAB A: EL JARDÍN DE FLORES */}
                                {activeTab === "garden" && (
                                    <motion.div
                                        key="garden-tab"
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.98 }}
                                        transition={{ duration: 0.4 }}
                                        className="tab-content"
                                        style={{ pointerEvents: "none" }}
                                    >
                                        {/* Top Controls Overlay */}
                                        <div className="controls-overlay" style={{ pointerEvents: "all" }}>
                                            <div className="selector-title">Elige tus flores favoritas:</div>
                                            <div className="flower-buttons">
                                                {Object.keys(FLOWER_CONFIGS).map((type) => (
                                                    <motion.button
                                                        key={type}
                                                        className={`flower-select-btn ${activeFlowerType === type ? "active" : ""}`}
                                                        onClick={() => handleSelectFlowerType(type)}
                                                        whileHover={{ scale: 1.03 }}
                                                        whileTap={{ scale: 0.97 }}
                                                    >
                                                        {type === "rose" && "Rosas Rojas 🌹"}
                                                        {type === "sakura" && "Cerezos 🌸"}
                                                        {type === "sunflower" && "Girasoles 🌻"}
                                                        {type === "daisy" && "Margaritas 🌼"}
                                                    </motion.button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Center Letter Card */}
                                        <div className="letter-container active" style={{ pointerEvents: "none" }}>
                                            <AnimatePresence>
                                                {isLetterOpen && (
                                                    <motion.div
                                                        initial={{ opacity: 0, scale: 0.8, y: 25, rotate: -2 }}
                                                        animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
                                                        exit={{ opacity: 0, scale: 0.8, y: 25, rotate: 2 }}
                                                        style={{ pointerEvents: "all" }}
                                                        className="glass-card letter-card"
                                                        transition={{
                                                            type: "spring",
                                                            stiffness: 260,
                                                            damping: 22
                                                        }}
                                                    >
                                                        <div
                                                            className="close-card-btn"
                                                            onClick={() => setIsLetterOpen(false)}
                                                        >
                                                            &times;
                                                        </div>
                                                        <div className="scrollable-content">
                                                            <span className="letter-tag">Para Malu</span>
                                                            
                                                            <AnimatePresence mode="wait">
                                                                <motion.div
                                                                    key={activeFlowerType}
                                                                    initial={{ opacity: 0, y: 6 }}
                                                                    animate={{ opacity: 1, y: 0 }}
                                                                    exit={{ opacity: 0, y: -6 }}
                                                                    transition={{ duration: 0.25 }}
                                                                >
                                                                    <h2 className="letter-headline">{currentConfig.title}</h2>
                                                                    <p className="letter-text">{currentConfig.body}</p>
                                                                </motion.div>
                                                            </AnimatePresence>

                                                            <div className="signature">Con amor, Lean ❤️</div>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>

                                        {/* Bottom Action Trigger */}
                                        <div className="center-action" style={{ pointerEvents: "all" }}>
                                            <motion.button
                                                id="bloom-trigger-btn"
                                                className="bloom-btn"
                                                onClick={handleBloomTrigger}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.94 }}
                                                animate={{ y: [0, -8, 0] }}
                                                transition={{
                                                    y: { repeat: Infinity, duration: 3, ease: "easeInOut" },
                                                    type: "spring",
                                                    stiffness: 350,
                                                    damping: 13
                                                }}
                                            >
                                                <span className="bloom-text">¡Enviar Flores! 💐</span>
                                                <span className="bloom-subtext">Haz clic para llenar la pantalla</span>
                                            </motion.button>
                                        </div>
                                    </motion.div>
                                )}

                                {/* TAB B: MENSAJES DIARIOS */}
                                {activeTab === "messages" && (
                                    <motion.div
                                        key="messages-tab"
                                        initial={{ opacity: 0, scale: 0.98, y: 10 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.98, y: 10 }}
                                        transition={{ duration: 0.4 }}
                                        className="tab-content"
                                        style={{ pointerEvents: "all" }}
                                    >
                                        <div className="days-container">
                                            <h2 className="elegant-title" style={{ textAlign: "center", fontSize: "1.9rem" }}>
                                                Tus Mensajitos Diarios 💌
                                            </h2>
                                            <p className="subtitle" style={{ textAlign: "center", marginBottom: "20px" }}>
                                                Un detalle secreto para cada día de la semana. ¿Qué te preparó Lean hoy?
                                            </p>

                                            <div className="days-grid">
                                                {WEEKDAYS.map((day) => {
                                                    const isUnlocked = day.id <= todayIndex;
                                                    const isShaking = shakeDayId === day.id;

                                                    return (
                                                        <motion.div
                                                            key={day.id}
                                                            className={`day-card ${isUnlocked ? "unlocked" : "locked"}`}
                                                            onClick={() => handleDayClick(day)}
                                                            whileHover={{ scale: 1.04 }}
                                                            whileTap={{ scale: 0.96 }}
                                                            animate={isShaking ? { x: [0, -10, 10, -10, 10, -6, 6, 0] } : {}}
                                                            transition={isShaking ? { duration: 0.4 } : {}}
                                                        >
                                                            <span className="day-icon">
                                                                {isUnlocked ? DAILY_MESSAGES[day.id].icon : "🔒"}
                                                            </span>
                                                            <div className="day-name">{day.name}</div>
                                                            <div className={`day-status ${isUnlocked ? "unlocked" : "locked"}`}>
                                                                {isUnlocked ? "Leer 🔓" : "Bloqueado"}
                                                            </div>
                                                        </motion.div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* TAB C: GALERÍA DE MOMENTOS (5 REAL DRAGGABLE POLAROIDS) */}
                                {activeTab === "moments" && (
                                    <motion.div
                                        key="moments-tab"
                                        initial={{ opacity: 0, scale: 0.98, y: 10 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.98, y: 10 }}
                                        transition={{ duration: 0.4 }}
                                        className="tab-content"
                                        style={{ pointerEvents: "all" }}
                                    >
                                        <div className="moments-container">
                                            <div style={{ position: "absolute", top: "-40px", left: "50%", transform: "translateX(-50%)", width: "90%", textAlign: "center" }}>
                                                <h2 className="elegant-title" style={{ fontSize: "1.9rem", marginBottom: "8px" }}>Nuestros Momentos 📸</h2>
                                                <p className="subtitle" style={{ fontSize: "0.85rem", marginBottom: 0 }}>¡Arrastra y desordena las fotitos reales para verlas todas!</p>
                                            </div>

                                            {POLAROID_MEMORIES.map((memory) => (
                                                <motion.div
                                                    key={memory.id}
                                                    className="polaroid-card"
                                                    style={{ 
                                                        ...memory.defaultStyle,
                                                        transformOrigin: "center center"
                                                    }}
                                                    drag
                                                    dragConstraints={{ left: -140, right: 140, top: -140, bottom: 140 }}
                                                    dragElastic={0.6}
                                                    whileHover={{ scale: 1.05, rotate: memory.rotation * 0.5, zIndex: 30 }}
                                                    whileDrag={{ scale: 1.08, zIndex: 50 }}
                                                    initial={{ rotate: memory.rotation - 4, scale: 0.9, opacity: 0 }}
                                                    animate={{ rotate: memory.rotation, scale: 1, opacity: 1 }}
                                                    transition={{ type: "spring", stiffness: 120, damping: 12 }}
                                                >
                                                    <div className="polaroid-img-wrapper">
                                                        <img 
                                                            src={memory.src} 
                                                            className="polaroid-img" 
                                                            alt={memory.caption} 
                                                            draggable="false" 
                                                        />
                                                    </div>
                                                    <div className="polaroid-caption">{memory.caption}</div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* MODAL 1: DAILY MESSAGE UNLOCKED DISPLAY */}
                <AnimatePresence>
                    {selectedMessage && (
                        <div className="modal-backdrop" onClick={() => setSelectedMessage(null)}>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8, y: 30, rotate: -2 }}
                                animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
                                exit={{ opacity: 0, scale: 0.8, y: 30, rotate: 2 }}
                                transition={{ type: "spring", stiffness: 280, damping: 22 }}
                                className="glass-card modal-card"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="close-card-btn" onClick={() => setSelectedMessage(null)}>
                                    &times;
                                </div>
                                <div className="scrollable-content" style={{ maxHeight: "380px" }}>
                                    <span className="letter-tag">Mensaje de Hoy ✨</span>
                                    <h2 className="letter-headline">{selectedMessage.title}</h2>
                                    
                                    <p className="letter-text">
                                        {selectedMessage.body.split(" ").map((word, i) => (
                                            <motion.span
                                                key={i}
                                                initial={{ opacity: 0, y: 5 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: i * 0.05, duration: 0.3 }}
                                                style={{ display: "inline-block", marginRight: "5px" }}
                                            >
                                                {word}
                                            </motion.span>
                                        ))}
                                    </p>

                                    <div className="signature">Para siempre, Lean ❤️</div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* MODAL 2: LOCKED DAY CHEAT ALERT */}
                <AnimatePresence>
                    {warningModalDay && (
                        <div className="modal-backdrop" onClick={() => setWarningModalDay(null)}>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.85, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.85, y: 20 }}
                                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                className="glass-card"
                                style={{ maxWidth: "380px", width: "90%" }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <span className="day-icon" style={{ fontSize: "3rem" }}>🔒❤️</span>
                                <h3 className="letter-headline" style={{ fontSize: "1.4rem", marginTop: "10px" }}>
                                    ¡Epa, no hagas trampa! 😉
                                </h3>
                                <p className="subtitle" style={{ fontSize: "0.95rem", lineHeight: "1.6", marginBottom: "20px" }}>
                                    Este mensajito secreto se desbloquea el <strong>{warningModalDay}</strong>. 
                                    <br /><br />
                                    Tené paciencia, mi amor, ¡falta poquito! Te amo de acá a las estrellas. ✨
                                </p>
                                <motion.button
                                    className="premium-btn"
                                    onClick={() => setWarningModalDay(null)}
                                    style={{ padding: "10px 24px", fontSize: "0.85rem" }}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Entendido, te espero 💋
                                </motion.button>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </main>

            {/* FLOATING GLASS NAVIGATION DOCK - Located at root level to prevent transform inheritance bugs */}
            <AnimatePresence>
                {screen === "garden" && (
                    <motion.nav
                        initial={{ opacity: 0, y: 60, x: "-50%" }}
                        animate={{ opacity: 1, y: 0, x: "-50%" }}
                        exit={{ opacity: 0, y: 60, x: "-50%" }}
                        transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
                        className="nav-dock"
                        style={{ pointerEvents: "all" }}
                    >
                        <motion.button
                            className={`nav-item ${activeTab === "garden" ? "active" : ""}`}
                            onClick={() => {
                                setActiveTab("garden");
                                setIsLetterOpen(true);
                            }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            🌸 El Jardín
                        </motion.button>
                        <motion.button
                            className={`nav-item ${activeTab === "messages" ? "active" : ""}`}
                            onClick={() => {
                                setActiveTab("messages");
                                setIsLetterOpen(false);
                            }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            💌 Mensajitos
                        </motion.button>
                        <motion.button
                            className={`nav-item ${activeTab === "moments" ? "active" : ""}`}
                            onClick={() => {
                                setActiveTab("moments");
                                setIsLetterOpen(false);
                            }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            📸 Momentos
                        </motion.button>
                    </motion.nav>
                )}
            </AnimatePresence>
        </>
    );
}
