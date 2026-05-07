/**
 * FireStreakOverlay.jsx
 * Full-screen TikTok-style fire animation that triggers on combo milestones.
 * Usage: <FireStreakOverlay combo={combo} show={showFireOverlay} />
 *
 * Milestones: every 5 correct answers (5, 10, 15, 20...)
 * Animation auto-dismisses after 2.5s.
 */

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// =============================================
// CONSTANTS
// =============================================

// Fire colors from bottom (hot white) to top (dark smoke)
const FIRE_COLORS = [
    "#ffffff", // white-hot core
    "#fff7e6", // bright white-yellow
    "#ffe066", // yellow
    "#ffb833", // orange-yellow
    "#ff7a00", // deep orange
    "#ff4500", // red-orange
    "#cc2200", // dark red
    "#8b0000", // deep red
];

// Labels per milestone tier
function getMilestoneLabel(combo) {
    if (combo >= 20) return "LEGENDARY";
    if (combo >= 15) return "UNSTOPPABLE";
    if (combo >= 10) return "ON FIRE";
    return "HEATED UP";
}

// Color theme per milestone tier
function getFireTheme(combo) {
    if (combo >= 20) return { primary: "#ff00ff", glow: "rgba(255,0,255,0.6)", particle: "#ff66ff" };
    if (combo >= 15) return { primary: "#ff3300", glow: "rgba(255,51,0,0.7)",  particle: "#ff7a00" };
    if (combo >= 10) return { primary: "#ff6600", glow: "rgba(255,102,0,0.6)", particle: "#ffbb00" };
    return            { primary: "#ff9900", glow: "rgba(255,153,0,0.5)",        particle: "#ffdd00" };
}

// =============================================
// FIRE PARTICLE — Individual animated ember
// =============================================
function FireParticle({ index, total, combo }) {
    const theme = getFireTheme(combo);

    // Spread particles evenly across bottom of screen
    const spreadZone  = 100 / total;
    const baseX       = spreadZone * index + spreadZone * 0.5;
    const offsetX     = (Math.random() - 0.5) * spreadZone * 1.2;
    const startX      = baseX + offsetX;

    // Random physics per particle
    const duration    = 1.2 + Math.random() * 1.4;
    const delay       = Math.random() * 0.6;
    const sway        = (Math.random() - 0.5) * 30; // horizontal drift
    const size        = 18 + Math.random() * 40;     // px size
    const colorIndex  = Math.floor(Math.random() * FIRE_COLORS.length);

    return (
        <motion.div
            initial={{
                x:       `${startX}vw`,
                y:       "100vh",
                opacity: 0,
                scale:   0.4,
                rotate:  (Math.random() - 0.5) * 20,
            }}
            animate={{
                x:       `calc(${startX}vw + ${sway}px)`,
                y:       [
                    "100vh",
                    "70vh",
                    "40vh",
                    "10vh",
                    "-10vh",
                ],
                opacity: [0, 0.9, 0.8, 0.5, 0],
                scale:   [0.4, 1.2, 1.0, 0.7, 0.2],
                rotate:  [(Math.random() - 0.5) * 20, (Math.random() - 0.5) * 40],
            }}
            transition={{
                duration,
                delay,
                ease:    "easeOut",
                repeat:  Infinity,
                repeatDelay: Math.random() * 0.4,
            }}
            style={{
                position: "fixed",
                bottom:   0,
                left:     0,
                width:    size,
                height:   size * 1.4,
                zIndex:   9998,
                pointerEvents: "none",
            }}
        >
            {/* Flame shape using clip-path teardrop */}
            <div style={{
                width:    "100%",
                height:   "100%",
                background: `radial-gradient(ellipse at 50% 70%, ${FIRE_COLORS[colorIndex]}, ${theme.primary} 50%, transparent 80%)`,
                clipPath: "polygon(50% 0%, 80% 40%, 100% 70%, 80% 100%, 20% 100%, 0% 70%, 20% 40%)",
                filter:   `blur(${size * 0.06}px)`,
            }} />
        </motion.div>
    );
}

// =============================================
// HEAT WAVE — Rising heat distortion lines
// =============================================
function HeatWave({ index }) {
    const x        = 5 + (index / 8) * 90; // spread across width
    const duration = 1.8 + Math.random() * 1.2;
    const delay    = Math.random() * 0.8;
    const width    = 2 + Math.random() * 4;

    return (
        <motion.div
            initial={{ y: "100vh", opacity: 0, scaleX: 0.5 }}
            animate={{
                y:       [
                    "100vh",
                    "60vh",
                    "30vh",
                    "0vh",
                    "-10vh",
                ],
                opacity: [0, 0.3, 0.2, 0.1, 0],
                scaleX:  [0.5, 1, 0.8, 0.4, 0],
            }}
            transition={{
                duration,
                delay,
                ease:   "easeOut",
                repeat: Infinity,
                repeatDelay: Math.random() * 0.6,
            }}
            style={{
                position:     "fixed",
                bottom:       0,
                left:         `${x}%`,
                width:        width,
                height:       "35vh",
                background:   "linear-gradient(to top, rgba(255,150,0,0.4), transparent)",
                borderRadius: "50%",
                zIndex:       9997,
                pointerEvents: "none",
            }}
        />
    );
}

// =============================================
// SCREEN GLOW — Full-screen color overlay
// =============================================
function ScreenGlow({ combo }) {
    const theme = getFireTheme(combo);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{
                opacity: [0, 0.25, 0.15, 0.25, 0.1, 0],
            }}
            transition={{
                duration: 2.4,
                ease:     "easeInOut",
                times:    [0, 0.2, 0.4, 0.6, 0.8, 1],
            }}
            style={{
                position:   "fixed",
                inset:      0,
                background: `radial-gradient(ellipse at 50% 100%, ${theme.glow}, transparent 70%)`,
                zIndex:     9996,
                pointerEvents: "none",
            }}
        />
    );
}

// =============================================
// COMBO TEXT — Centered milestone announcement
// =============================================
function ComboText({ combo }) {
    const theme = getFireTheme(combo);
    const label = getMilestoneLabel(combo);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.3, y: 60 }}
            animate={{
                opacity: [0, 1, 1, 1, 0],
                scale:   [0.3, 1.15, 1.0, 1.0, 0.8],
                y:       [60, 0, 0, 0, -20],
            }}
            transition={{
                duration: 2.4,
                ease:     [0.22, 1, 0.36, 1],
                times:    [0, 0.25, 0.5, 0.75, 1],
            }}
            style={{
                position:       "fixed",
                inset:          0,
                display:        "flex",
                flexDirection:  "column",
                alignItems:     "center",
                justifyContent: "center",
                zIndex:         9999,
                pointerEvents:  "none",
                textAlign:      "center",
            }}
        >
            {/* Combo number */}
            <motion.div
                animate={{
                    textShadow: [
                        `0 0 30px ${theme.primary}, 0 0 60px ${theme.primary}`,
                        `0 0 60px ${theme.primary}, 0 0 120px ${theme.primary}`,
                        `0 0 30px ${theme.primary}, 0 0 60px ${theme.primary}`,
                    ],
                }}
                transition={{ duration: 0.6, repeat: 3, repeatType: "reverse" }}
                style={{
                    fontSize:    "clamp(5rem, 20vw, 11rem)",
                    fontWeight:  900,
                    color:       theme.primary,
                    lineHeight:  1,
                    letterSpacing: "-0.05em",
                    fontFamily:  "'Poppins', sans-serif",
                }}
            >
                ×{combo}
            </motion.div>

            {/* Label */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                style={{
                    fontSize:      "clamp(0.8rem, 3vw, 1.3rem)",
                    fontWeight:    700,
                    color:         "#ffffff",
                    letterSpacing: "0.5em",
                    textTransform: "uppercase",
                    marginTop:     "0.5rem",
                    opacity:       0.9,
                    fontFamily:    "'Poppins', sans-serif",
                }}
            >
                🔥 {label} 🔥
            </motion.div>

            {/* Streak badge */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.35, duration: 0.3 }}
                style={{
                    marginTop:     "1rem",
                    padding:       "6px 20px",
                    borderRadius:  "100px",
                    border:        `1px solid ${theme.primary}`,
                    color:         theme.primary,
                    fontSize:      "clamp(0.55rem, 2vw, 0.75rem)",
                    letterSpacing: "0.4em",
                    textTransform: "uppercase",
                    fontFamily:    "'Poppins', sans-serif",
                    fontWeight:    600,
                    backdropFilter: "blur(4px)",
                    background:    "rgba(0,0,0,0.3)",
                }}
            >
                COMBO STREAK ACTIVE
            </motion.div>
        </motion.div>
    );
}

// =============================================
// MAIN COMPONENT — FireStreakOverlay
// =============================================
export default function FireStreakOverlay({ combo, show }) {
    // Number of particles scales with combo tier
    const particleCount = combo >= 15 ? 32 : combo >= 10 ? 24 : 16;
    const heatWaveCount = 9;

    return (
        <AnimatePresence>
            {show && (
                <>
                    {/* Bottom fire glow base */}
                    <motion.div
                        key="fire-base"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 1, 0.8, 1, 0] }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 2.4 }}
                        style={{
                            position:   "fixed",
                            bottom:     0,
                            left:       0,
                            right:      0,
                            height:     "40vh",
                            background: "linear-gradient(to top, rgba(255,80,0,0.5) 0%, rgba(255,150,0,0.2) 40%, transparent 100%)",
                            zIndex:     9995,
                            pointerEvents: "none",
                        }}
                    />

                    {/* Screen glow overlay */}
                    <ScreenGlow key="glow" combo={combo} />

                    {/* Heat waves */}
                    {Array.from({ length: heatWaveCount }, (_, i) => (
                        <HeatWave key={`wave-${i}`} index={i} />
                    ))}

                    {/* Fire particles */}
                    {Array.from({ length: particleCount }, (_, i) => (
                        <FireParticle
                            key={`particle-${i}`}
                            index={i}
                            total={particleCount}
                            combo={combo}
                        />
                    ))}

                    {/* Central combo text */}
                    <ComboText key="combo-text" combo={combo} />
                </>
            )}
        </AnimatePresence>
    );
}