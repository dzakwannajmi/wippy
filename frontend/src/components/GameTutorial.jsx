/**
 * GameTutorial.jsx
 * Full-screen animated tutorial overlay shown ONCE before the game starts.
 * Auto-advances every 3s, or player can click through manually.
 *
 * Usage in QuizRoom.jsx:
 *   1. Add state: const [showTutorial, setShowTutorial] = useState(false);
 *   2. On "receive_start_game": setShowTutorial(true);
 *   3. Render: <GameTutorial show={showTutorial} onDone={() => setShowTutorial(false)} category={selectedCategory} />
 *
 * The tutorial auto-dismisses after the last slide, then the countdown begins.
 */

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    IoTimerOutline,
    IoFlashOutline,
    IoShieldCheckmarkOutline,
    IoRocketOutline,
    IoChevronForwardOutline,
    IoCheckmarkCircleOutline,
} from "react-icons/io5";
import { SiPhp, SiJavascript, SiReact } from "react-icons/si";

// =============================================
// SLIDE DATA — 4 tutorial cards
// =============================================
const SLIDES = [
    {
        id:          "objective",
        icon:        <IoRocketOutline size={36} />,
        color:       "text-primary",
        border:      "border-primary/30",
        bg:          "bg-primary/10",
        glow:        "rgba(80,200,120,0.25)",
        title:       "Mission Objective",
        description: "Answer as many questions correctly as possible before time runs out. More correct answers = higher rank on the podium.",
        highlight:   null,
    },
    {
        id:          "timer",
        icon:        <IoTimerOutline size={36} />,
        color:       "text-red-400",
        border:      "border-red-400/30",
        bg:          "bg-red-400/10",
        glow:        "rgba(239,68,68,0.2)",
        title:       "10 Seconds Per Question",
        description: "Each question gives you exactly 10 seconds. The clock starts the moment the question appears — don't hesitate!",
        highlight:   "Timer turns red when 3 seconds remain.",
    },
    {
        id:          "speed",
        icon:        <IoFlashOutline size={36} />,
        color:       "text-yellow-400",
        border:      "border-yellow-400/30",
        bg:          "bg-yellow-400/10",
        glow:        "rgba(234,179,8,0.2)",
        title:       "Speed Bonus",
        description: "Answering faster earns bonus points on top of the base 100 pts.",
        highlight:   null,
        table: [
            { time: "Answer in 1–3s", bonus: "+50 pts", color: "text-yellow-400" },
            { time: "Answer in 4–6s", bonus: "+25 pts", color: "text-yellow-400/70" },
            { time: "Answer in 7–10s", bonus: "+0 pts",  color: "text-slate-500" },
        ],
    },
    {
        id:          "combo",
        icon:        <IoShieldCheckmarkOutline size={36} />,
        color:       "text-orange-400",
        border:      "border-orange-400/30",
        bg:          "bg-orange-400/10",
        glow:        "rgba(249,115,22,0.2)",
        title:       "Combo Streak Multiplier",
        description: "Chain correct answers in a row to multiply your score. Miss one and it resets!",
        highlight:   null,
        table: [
            { time: "2 correct in a row",  bonus: "×1.2",  color: "text-primary"      },
            { time: "3 correct in a row",  bonus: "×1.5",  color: "text-yellow-400"   },
            { time: "5+ correct in a row", bonus: "×2.0 🔥", color: "text-orange-400" },
        ],
    },
];

// =============================================
// PROGRESS DOTS — Slide indicator
// =============================================
function ProgressDots({ total, current }) {
    return (
        <div className="flex items-center gap-2">
            {Array.from({ length: total }, (_, i) => (
                <motion.div
                    key={i}
                    animate={{
                        width:      i === current ? 24 : 6,
                        opacity:    i <= current ? 1 : 0.2,
                        background: i === current ? "#50C878" : "#ffffff",
                    }}
                    transition={{ duration: 0.3 }}
                    className="h-1.5 rounded-full"
                />
            ))}
        </div>
    );
}

// =============================================
// AUTO-PROGRESS BAR — Fills over 3s per slide
// =============================================
function AutoProgressBar({ duration, key: barKey, color }) {
    return (
        <div className="w-full h-[2px] bg-white/5 rounded-full overflow-hidden">
            <motion.div
                key={barKey}
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration, ease: "linear" }}
                className="h-full rounded-full"
                style={{ background: color || "#50C878" }}
            />
        </div>
    );
}

// =============================================
// CATEGORY ICON — Shows which category was picked
// =============================================
function CategoryBadge({ category }) {
    const icons = {
        PHP:        <SiPhp        size={14} className="text-[#777BB4]" />,
        JAVASCRIPT: <SiJavascript size={14} className="text-[#F7DF1E]" />,
        REACT:      <SiReact      size={14} className="text-[#61DAFB]" />,
    };
    return (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5">
            {icons[category]}
            <span className="text-[9px] text-white/50 uppercase tracking-widest">{category}</span>
        </div>
    );
}

// =============================================
// SINGLE SLIDE CARD
// =============================================
function SlideCard({ slide, isVisible }) {
    return (
        <motion.div
            key={slide.id}
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.97 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-md"
        >
            {/* Icon */}
            <motion.div
                initial={{ scale: 0, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.15, type: "spring", stiffness: 200 }}
                className={`w-20 h-20 mx-auto mb-8 rounded-[1.5rem] flex items-center justify-center border ${slide.bg} ${slide.border} ${slide.color}`}
                style={{ boxShadow: `0 0 40px ${slide.glow}` }}
            >
                {slide.icon}
            </motion.div>

            {/* Title */}
            <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-2xl md:text-3xl font-thin text-white text-center tracking-tight mb-4"
            >
                {slide.title}
            </motion.h2>

            {/* Description */}
            <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="text-[13px] text-slate-400 text-center leading-relaxed font-light mb-6 max-w-sm mx-auto"
            >
                {slide.description}
            </motion.p>

            {/* Highlight pill */}
            {slide.highlight && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex items-center justify-center gap-2 mx-auto w-fit px-4 py-2 rounded-full border border-red-400/20 bg-red-400/10 mb-6"
                >
                    <IoCheckmarkCircleOutline size={13} className="text-red-400" />
                    <span className="text-[11px] text-red-400 font-light">{slide.highlight}</span>
                </motion.div>
            )}

            {/* Table (speed / combo tiers) */}
            {slide.table && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className={`rounded-2xl border ${slide.border} bg-white/[0.03] overflow-hidden`}
                >
                    {slide.table.map((row, i) => (
                        <div
                            key={i}
                            className={`flex items-center justify-between px-5 py-3 ${
                                i < slide.table.length - 1 ? "border-b border-white/5" : ""
                            }`}
                        >
                            <span className="text-[12px] text-slate-400 font-light">{row.time}</span>
                            <span className={`text-[13px] font-mono font-medium ${row.color}`}>{row.bonus}</span>
                        </div>
                    ))}
                </motion.div>
            )}
        </motion.div>
    );
}

// =============================================
// MAIN COMPONENT — GameTutorial
// =============================================
const SLIDE_DURATION = 3.5; // seconds per slide auto-advance

export default function GameTutorial({ show, onDone, category }) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [hasSkipped,   setHasSkipped]   = useState(false);
    const timerRef = useRef(null);

    // Reset when shown
    useEffect(() => {
        if (show) {
            setCurrentSlide(0);
            setHasSkipped(false);
        }
    }, [show]);

    // Auto-advance timer
    useEffect(() => {
        if (!show || hasSkipped) return;

        timerRef.current = setTimeout(() => {
            if (currentSlide < SLIDES.length - 1) {
                setCurrentSlide(prev => prev + 1);
            } else {
                onDone();
            }
        }, SLIDE_DURATION * 1000);

        return () => clearTimeout(timerRef.current);
    }, [show, currentSlide, hasSkipped, onDone]);

    // Manual advance
    const handleNext = () => {
        clearTimeout(timerRef.current);
        if (currentSlide < SLIDES.length - 1) {
            setCurrentSlide(prev => prev + 1);
        } else {
            onDone();
        }
    };

    // Skip all
    const handleSkip = () => {
        clearTimeout(timerRef.current);
        setHasSkipped(true);
        onDone();
    };

    const slide = SLIDES[currentSlide];
    const isLast = currentSlide === SLIDES.length - 1;

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed inset-0 z-50 flex flex-col items-center justify-center font-poppins"
                    style={{ background: "rgba(3, 0, 20, 0.97)", backdropFilter: "blur(20px)" }}
                >
                    {/* Ambient glow that changes per slide */}
                    <motion.div
                        key={`glow-${slide.id}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 pointer-events-none"
                        style={{
                            background: `radial-gradient(ellipse at 50% 60%, ${slide.glow}, transparent 60%)`,
                        }}
                    />

                    {/* ---- TOP BAR ---- */}
                    <div className="absolute top-0 left-0 right-0 px-8 py-6 flex items-center justify-between z-10">
                        {/* Category badge */}
                        {category && <CategoryBadge category={category} />}

                        {/* Skip button */}
                        <button
                            onClick={handleSkip}
                            className="text-[10px] text-slate-500 hover:text-white uppercase tracking-[0.4em] transition-colors"
                        >
                            Skip Tutorial
                        </button>
                    </div>

                    {/* ---- SLIDE CONTENT ---- */}
                    <div className="relative z-10 flex flex-col items-center px-6 w-full">
                        <AnimatePresence mode="wait">
                            <SlideCard key={slide.id} slide={slide} />
                        </AnimatePresence>
                    </div>

                    {/* ---- BOTTOM CONTROLS ---- */}
                    <div className="absolute bottom-0 left-0 right-0 px-8 pb-10 flex flex-col items-center gap-6 z-10">

                        {/* Auto-progress bar */}
                        <div className="w-full max-w-md">
                            <AutoProgressBar
                                key={`bar-${currentSlide}`}
                                duration={SLIDE_DURATION}
                                color={slide.color.replace("text-", "").includes("primary") ? "#50C878" : undefined}
                            />
                        </div>

                        {/* Dots + Next button row */}
                        <div className="w-full max-w-md flex items-center justify-between">
                            <ProgressDots total={SLIDES.length} current={currentSlide} />

                            <motion.button
                                whileHover={{ scale: 1.05, x: 4 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleNext}
                                className={`flex items-center gap-2 px-6 py-3 border text-[10px] uppercase tracking-[0.4em] transition-all rounded-none ${
                                    isLast
                                        ? "border-primary bg-primary/20 text-primary hover:bg-primary hover:text-dark-abyss shadow-[0_0_20px_rgba(80,200,120,0.3)]"
                                        : "border-white/10 text-white/50 hover:text-white hover:border-white/30"
                                }`}
                            >
                                {isLast ? (
                                    <>
                                        <IoRocketOutline size={13} />
                                        Let's Go!
                                    </>
                                ) : (
                                    <>
                                        Next
                                        <IoChevronForwardOutline size={13} />
                                    </>
                                )}
                            </motion.button>
                        </div>

                        {/* Slide label */}
                        <p className="text-[9px] text-white/20 uppercase tracking-[0.4em]">
                            {currentSlide + 1} of {SLIDES.length} · Auto-advancing
                        </p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}