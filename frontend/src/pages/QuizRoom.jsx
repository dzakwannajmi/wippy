import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { io } from "socket.io-client";
import { motion, AnimatePresence } from "framer-motion";
import WaitingArena from "../components/WaitingArena";
import PixelBlast from "../components/PixelBlast";
import FireStreakOverlay from "../components/FireStreakOverlay";
import GameTutorial from "../components/GameTutorial";

import { SiPhp, SiJavascript, SiReact } from 'react-icons/si';
import {
    IoFingerPrintOutline,
    IoAnalyticsOutline,
    IoTimerOutline,
    IoPowerOutline,
    IoPulseOutline,
    IoRadioOutline,
    IoCheckmarkCircleOutline,
    IoCloseCircleOutline,
} from "react-icons/io5";

const CATEGORIES = ["PHP", "JAVASCRIPT", "REACT"];

export default function QuizRoom() {
    const [showTutorial, setShowTutorial] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    const socket = useMemo(() => {
        const url = import.meta.env.VITE_SOCKET_URL || "http://localhost:3001";
        console.log("🔌 Connecting to:", url);
        return io(url);
    }, []);

    const { playerName, isHost, roomId, roomPass } = location.state || {
        playerName: "Guest_Operator",
        isHost: false,
        roomId: "------",
        roomPass: "0"
    };

    // =============================================
    // STATE — All hooks must be inside the component
    // =============================================
    const [gamePhase, setGamePhase] = useState("waiting");
    const [players, setPlayers] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [questionIndex, setQuestionIndex] = useState(0);
    const [totalQuestions, setTotalQuestions] = useState(0);
    const [timeLeft, setTimeLeft] = useState(10);
    const [countdown, setCountdown] = useState(null);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [answerResult, setAnswerResult] = useState(null);
    const [hasAnswered, setHasAnswered] = useState(false);
    const [combo, setCombo] = useState(0);
    const [comboMultiplier, setComboMultiplier] = useState(1);
    const [speedBonus, setSpeedBonus] = useState(0);
    const [showComboPopup, setShowComboPopup] = useState(false);
    const [myScore, setMyScore] = useState(0);

    // ✅ FIX 1: useState must be inside the component — moved here from module level
    const [showFireOverlay, setShowFireOverlay] = useState(false);

    // =============================================
    // EFFECT — Socket disconnect cleanup
    // =============================================
    useEffect(() => {
        return () => socket.disconnect();
    }, [socket]);

    // =============================================
    // EFFECT — Socket event listeners
    // =============================================
    useEffect(() => {
        let hasJoined = false;

        if (!hasJoined) {
            hasJoined = true;
            if (isHost) {
                socket.emit("create_room", { roomId, roomPass, hostName: playerName });
            } else {
                socket.emit("join_room", { roomId, roomPass, playerName }, (res) => {
                    if (res?.status === "error") {
                        alert(res.message);
                        navigate("/");
                    }
                });
            }
        }

        socket.on("update_players", (playersList) => setPlayers(playersList));
        socket.on("receive_start_game", (category) => {
            setSelectedCategory(category);
            setShowTutorial(true);
        });

        socket.on("countdown", (count) => {
            setGamePhase("countdown");
            setCountdown(count);
        });

        socket.on("next_question", (data) => {
            setCurrentQuestion(data);
            setQuestionIndex(data.index);
            setTotalQuestions(data.total);
            setSelectedAnswer(null);
            setAnswerResult(null);
            setHasAnswered(false);
            setGamePhase("playing");
        });

        socket.on("timer_tick", (time) => setTimeLeft(time));

        socket.on("answer_result", (result) => {
            setAnswerResult(result);
            setMyScore(result.totalScore);

            // ✅ FIX 2: setCombo called only once (was called twice before)
            setCombo(result.combo);
            setComboMultiplier(result.comboMultiplier);
            setSpeedBonus(result.speedBonus);
            setGamePhase("answer_reveal");

            // Show combo popup if combo >= 2
            if (result.combo >= 2) {
                setShowComboPopup(true);
                setTimeout(() => setShowComboPopup(false), 1500);
            }

            // Trigger full-screen fire overlay on every combo milestone (5, 10, 15...)
            if (result.isCorrect && result.combo > 0 && result.combo % 5 === 0) {
                setShowFireOverlay(true);
                setTimeout(() => setShowFireOverlay(false), 2500);
            }

            setTimeout(() => setGamePhase("playing"), 1500);
        });

        socket.on("game_over", (data) => {
            setGamePhase("game_over");
            setTimeout(() => {
                navigate("/podium", {
                    state: {
                        players: data.players,
                        mySocketId: socket.id,
                        playerName,
                        roomId,
                        category: data.category,
                    }
                });
            }, 1500);
        });

        socket.on("room_terminated", (msg) => {
            alert(msg);
            navigate("/");
        });

        return () => {
            socket.off("update_players");
            socket.off("receive_start_game");
            socket.off("countdown");
            socket.off("next_question");
            socket.off("timer_tick");
            socket.off("answer_result");
            socket.off("game_over");
            socket.off("room_terminated");
        };
    }, []);

    // =============================================
    // HANDLERS
    // =============================================
    const handleAnswer = useCallback((index) => {
        if (hasAnswered || gamePhase !== "playing") return;
        setHasAnswered(true);
        setSelectedAnswer(index);
        const timeUsed = 10 - timeLeft;
        socket.emit("submit_answer", { roomId, answerIndex: index, timeUsed });
    }, [hasAnswered, gamePhase, timeLeft, socket, roomId]);

    // Returns Tailwind classes for each answer button based on game state
    const getButtonStyle = (index) => {
        if (gamePhase === "answer_reveal" && answerResult) {
            if (index === answerResult.correctAnswer) {
                return "border-green-500/80 bg-green-500/20 text-white shadow-[0_0_20px_rgba(34,197,94,0.3)]";
            }
            if (index === selectedAnswer && !answerResult.isCorrect) {
                return "border-red-500/80 bg-red-500/20 text-white shadow-[0_0_20px_rgba(239,68,68,0.3)]";
            }
            return "border-white/5 bg-white/[0.02] opacity-40";
        }
        if (index === selectedAnswer) return "border-primary/80 bg-primary/20 text-white";
        return "border-white/5 bg-white/[0.03] hover:border-primary/40 hover:bg-primary/5";
    };

    // Returns tech stack icon component by category name
    const getTechIcon = (tech, size = 32) => {
        switch (tech) {
            case 'PHP': return <SiPhp size={size} className="text-[#777BB4]" />;
            case 'JAVASCRIPT': return <SiJavascript size={size} className="text-[#F7DF1E]" />;
            case 'REACT': return <SiReact size={size} className="text-[#61DAFB]" />;
            default: return null;
        }
    };

    const progress = totalQuestions > 0 ? ((questionIndex + 1) / totalQuestions) * 100 : 0;
    const isWaiting = gamePhase === "waiting";

    // =============================================
    // RENDER: COUNTDOWN SCREEN
    // =============================================
    if (gamePhase === "countdown") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-dark-abyss relative overflow-hidden">
                <div className="fixed inset-0 z-0 pointer-events-none">
                    <PixelBlast variant="square" pixelSize={4} color="#50C878" speed={0.4} transparent={true} />
                </div>
                <motion.div
                    key={countdown}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 1.5, opacity: 0 }}
                    className="z-10 text-center"
                >
                    <p className="text-[11px] text-primary/50 tracking-[0.6em] uppercase mb-6">
                        Game Dimulai Dalam
                    </p>
                    <div className="text-[10rem] font-thin text-primary leading-none tracking-tighter drop-shadow-[0_0_40px_rgba(80,200,120,0.5)]">
                        {countdown}
                    </div>
                    <p className="text-slate-500 text-[10px] tracking-[0.4em] uppercase mt-6">
                        Kategori: {selectedCategory}
                    </p>
                </motion.div>
            </div>
        );
    }

    // =============================================
    // RENDER: GAME OVER SCREEN
    // =============================================
    if (gamePhase === "game_over") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-dark-abyss">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                >
                    <p className="text-primary text-[11px] tracking-[0.6em] uppercase mb-4">Game Over</p>
                    <h1 className="text-6xl font-thin text-white tracking-tighter mb-4">{myScore}</h1>
                    <p className="text-slate-500 text-xs tracking-widest uppercase">Menghitung hasil...</p>
                </motion.div>
            </div>
        );
    }

    // =============================================
    // RENDER: MAIN GAME
    // =============================================
    return (
        <div className="min-h-screen flex flex-col bg-dark-abyss text-font-main font-poppins relative overflow-hidden">

            {/* Background layer */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <PixelBlast variant="square" pixelSize={4} color="#50C878" speed={0.4} transparent={true} />
                <div className="absolute inset-0 bg-arena-grid opacity-10" />
            </div>

            {/* =============================================
                HEADER
            ============================================= */}
            <header className="relative z-30 w-full border-b border-white/5 bg-black/60 backdrop-blur-2xl px-8 py-5 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                        <IoRadioOutline size={20} className="animate-pulse" />
                    </div>
                    <div>
                        <h2 className="text-[9px] font-normal text-primary/50 tracking-[0.4em] uppercase">Frequency_Sync</h2>
                        <p className="text-xs font-medium tracking-widest uppercase">Node_{roomId}</p>
                    </div>
                </div>
                <div className="flex items-center gap-8">
                    <div className="hidden md:flex flex-col items-end">
                        <p className="text-[8px] font-normal text-slate-500 uppercase tracking-widest">Access_Protocol</p>
                        <p className="text-xs font-mono text-primary tracking-tighter">{roomPass}</p>
                    </div>
                    <button onClick={() => navigate("/")} className="group p-2 hover:bg-red-500/10 rounded-xl transition-all">
                        <IoPowerOutline size={22} className="text-red-500/40 group-hover:text-red-500 transition-colors" />
                    </button>
                </div>
            </header>

            <main className="relative z-10 flex-1 flex flex-col lg:flex-row gap-8 p-8 max-w-7xl mx-auto w-full">

                {/* =============================================
                    SIDEBAR — Player info + live scoreboard
                ============================================= */}
                <aside className="w-full lg:w-80 flex flex-col gap-8">

                    {/* Player identity + score + combo card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-card-roadmap p-8 rounded-[2.5rem] border border-white/5 relative overflow-hidden"
                    >
                        <div className="absolute -top-4 -right-4 opacity-5 text-primary">
                            <IoPulseOutline size={100} />
                        </div>

                        {/* Player name */}
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                                <IoFingerPrintOutline size={22} />
                            </div>
                            <div>
                                <h3 className="text-sm font-medium tracking-tight uppercase italic">{playerName}</h3>
                                <p className="text-[8px] font-normal text-primary/40 tracking-widest uppercase">Identity_Verified</p>
                            </div>
                        </div>

                        {/* ✅ FIX 3: Score shown only once. Second duplicate block removed. */}
                        <div className="space-y-4 pt-6 border-t border-white/5">
                            <div className="flex justify-between items-center text-[10px]">
                                <span className="text-slate-500 uppercase tracking-widest">Network_Score</span>
                                <span className="font-mono text-primary text-lg">{myScore}</span>
                            </div>

                            {/* Combo streak badge — only visible when combo >= 2 */}
                            {combo >= 2 && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className={`flex items-center justify-between px-4 py-2 rounded-xl border ${combo >= 5 ? 'bg-orange-500/20 border-orange-500/40' :
                                        combo >= 3 ? 'bg-yellow-500/20 border-yellow-500/40' :
                                            'bg-primary/10 border-primary/20'
                                        }`}
                                >
                                    <span className="text-[9px] uppercase tracking-widest text-slate-400">Combo</span>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-sm font-bold ${combo >= 5 ? 'text-orange-400' :
                                            combo >= 3 ? 'text-yellow-400' :
                                                'text-primary'
                                            }`}>
                                            x{combo}
                                        </span>
                                        <span className="text-[8px] font-mono text-white/40">
                                            {combo >= 5 ? '🔥 ON FIRE' :
                                                combo >= 3 ? '⚡ HOT' :
                                                    '✨ STREAK'}
                                        </span>
                                    </div>
                                </motion.div>
                            )}

                            {/* Multiplier display — only visible when active */}
                            {comboMultiplier > 1 && (
                                <div className="flex justify-between items-center text-[10px]">
                                    <span className="text-slate-500 uppercase tracking-widest">Multiplier</span>
                                    <span className={`font-mono font-bold ${comboMultiplier >= 2 ? 'text-orange-400' :
                                        comboMultiplier >= 1.5 ? 'text-yellow-400' :
                                            'text-primary'
                                        }`}>
                                        {comboMultiplier}x
                                    </span>
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {/* Live leaderboard */}
                    <div className="glass-card-roadmap p-8 rounded-[2.5rem] border border-white/5 flex-1 shadow-2xl overflow-hidden">
                        <h4 className="text-[9px] font-normal text-slate-400 uppercase tracking-[0.4em] mb-6 flex items-center gap-2">
                            <IoAnalyticsOutline size={16} className="text-primary/60" /> Live_Telemetry
                        </h4>
                        <div className="space-y-4">
                            {[...players]
                                .sort((a, b) => (b.score || 0) - (a.score || 0))
                                .map((p, i) => (
                                    <div
                                        key={p.id}
                                        className={`flex justify-between items-center px-4 py-3 rounded-2xl border transition-all ${p.id === socket.id
                                            ? 'bg-primary/10 border-primary/20'
                                            : 'bg-white/[0.02] border-white/5 hover:border-primary/20'
                                            }`}
                                    >
                                        <span className="text-[10px] font-mono text-slate-600">0{i + 1}</span>
                                        <span className="text-[10px] font-normal uppercase flex-1 ml-4 truncate text-slate-300">
                                            {p.name} {p.id === socket.id && "(You)"}
                                        </span>
                                        <span className="text-[10px] font-mono text-primary">{p.score || 0}</span>
                                    </div>
                                ))}
                        </div>
                    </div>
                </aside>

                {/* =============================================
                    MAIN CONTENT — Waiting room + quiz area
                ============================================= */}
                <section className="flex-1 flex flex-col gap-8">

                    {/* WAITING ROOM */}
                    {isWaiting && (
                        <div className="flex-1 flex flex-col items-center justify-center">
                            {isHost && (
                                <div className="text-center mb-12 w-full max-w-2xl">
                                    <p className="text-[10px] text-primary/40 tracking-[0.6em] uppercase mb-6">
                                        Core_Selector
                                    </p>
                                    <div className="grid grid-cols-3 gap-4">
                                        {CATEGORIES.map((tech) => (
                                            <motion.div
                                                key={tech}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => setSelectedCategory(tech)}
                                                className={`cursor-pointer p-6 rounded-[2rem] border transition-all flex flex-col items-center gap-3 ${selectedCategory === tech
                                                    ? 'border-primary bg-primary/10 shadow-[0_0_25px_rgba(80,200,120,0.2)]'
                                                    : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.05]'
                                                    }`}
                                            >
                                                {getTechIcon(tech, 28)}
                                                <h3 className="font-medium tracking-[0.15em] uppercase text-[10px]">{tech}</h3>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <WaitingArena
                                roomId={roomId}
                                roomPass={roomPass}
                                players={players}
                                isHost={isHost}
                                socketId={socket.id}
                                onStart={() => {
                                    if (!selectedCategory) return alert("Pilih kategori dulu!");
                                    socket.emit("start_game", { roomId, category: selectedCategory });
                                }}
                                onCancel={() => {
                                    socket.emit("cancel_room", roomId);
                                    navigate("/");
                                }}
                            />
                        </div>
                    )}

                    {/* QUIZ PLAYING */}
                    {(gamePhase === "playing" || gamePhase === "answer_reveal") && currentQuestion && (
                        <div className="flex-1 flex flex-col gap-8">

                            {/* Timer + progress bar */}
                            <div className="flex justify-between items-end px-6">
                                <div className="flex items-center gap-4">
                                    <div className={`p-4 rounded-2xl border transition-all ${timeLeft <= 3
                                        ? 'bg-red-500/10 text-red-500 border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.2)]'
                                        : 'bg-primary/5 text-primary border-primary/10'
                                        }`}>
                                        <IoTimerOutline size={24} className={timeLeft <= 3 ? 'animate-ping' : ''} />
                                    </div>
                                    <div>
                                        <p className={`text-[9px] tracking-[0.4em] uppercase font-normal ${timeLeft <= 3 ? 'text-red-500/40' : 'text-primary/40'}`}>
                                            Extraction_Time
                                        </p>
                                        <p className="text-3xl font-mono leading-none tracking-tighter">{timeLeft}s</p>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <p className="text-slate-600 text-[9px] tracking-[0.3em] uppercase mb-2">
                                        Sync_Progress {questionIndex + 1}/{totalQuestions}
                                    </p>
                                    <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden">
                                        <motion.div
                                            className="h-full bg-primary shadow-[0_0_10px_#50C878]"
                                            animate={{ width: `${progress}%` }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Question card */}
                            <div className="glass-card-roadmap flex-1 rounded-[3.5rem] p-12 md:p-16 border border-white/10 relative overflow-hidden flex flex-col shadow-[0_0_60px_rgba(0,0,0,0.5)]">

                                {/* Timer bar across top of card */}
                                <div className="absolute top-0 left-0 w-full h-[2px] bg-white/5">
                                    <motion.div
                                        className={`h-full ${timeLeft <= 3 ? 'bg-red-500 shadow-[0_0_10px_#ef4444]' : 'bg-primary shadow-[0_0_10px_#50C878]'}`}
                                        animate={{ width: `${(timeLeft / 10) * 100}%` }}
                                        transition={{ duration: 1, ease: "linear" }}
                                    />
                                </div>

                                {/* Score breakdown popup — appears bottom-right on correct answer */}
                                <AnimatePresence>
                                    {gamePhase === "answer_reveal" && answerResult?.isCorrect && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20, scale: 0.9 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="absolute bottom-8 right-8 flex flex-col items-end gap-1 z-20"
                                        >
                                            {/* Base score */}
                                            <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-white/5 border border-white/10">
                                                <span className="text-[9px] text-slate-500 uppercase">Base</span>
                                                <span className="text-[11px] font-mono text-white">+100</span>
                                            </div>

                                            {/* Speed bonus */}
                                            {speedBonus > 0 && (
                                                <motion.div
                                                    initial={{ opacity: 0, x: 10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: 0.1 }}
                                                    className="flex items-center gap-2 px-3 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20"
                                                >
                                                    <span className="text-[9px] text-blue-400 uppercase">Speed</span>
                                                    <span className="text-[11px] font-mono text-blue-400">+{speedBonus}</span>
                                                </motion.div>
                                            )}

                                            {/* Combo bonus */}
                                            {answerResult.comboBonus > 0 && (
                                                <motion.div
                                                    initial={{ opacity: 0, x: 10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: 0.2 }}
                                                    className={`flex items-center gap-2 px-3 py-1 rounded-lg border ${combo >= 5
                                                        ? 'bg-orange-500/10 border-orange-500/20'
                                                        : 'bg-yellow-500/10 border-yellow-500/20'
                                                        }`}
                                                >
                                                    <span className={`text-[9px] uppercase ${combo >= 5 ? 'text-orange-400' : 'text-yellow-400'}`}>
                                                        Combo x{combo}
                                                    </span>
                                                    <span className={`text-[11px] font-mono ${combo >= 5 ? 'text-orange-400' : 'text-yellow-400'}`}>
                                                        +{answerResult.comboBonus}
                                                    </span>
                                                </motion.div>
                                            )}

                                            {/* Total gained */}
                                            <motion.div
                                                initial={{ opacity: 0, x: 10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.3 }}
                                                className="flex items-center gap-2 px-3 py-1 rounded-lg bg-primary/10 border border-primary/20"
                                            >
                                                <span className="text-[9px] text-primary uppercase">Total</span>
                                                <span className="text-[13px] font-mono font-bold text-primary">
                                                    +{answerResult.gainedScore}
                                                </span>
                                            </motion.div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Combo popup — center screen for combo streak */}
                                <AnimatePresence>
                                    {showComboPopup && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.5, y: 20 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 1.5, y: -20 }}
                                            className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none"
                                        >
                                            <div className={`text-center px-8 py-6 rounded-3xl border backdrop-blur-xl ${combo >= 5 ? 'bg-orange-500/20 border-orange-500/40 shadow-[0_0_40px_rgba(249,115,22,0.4)]' :
                                                combo >= 3 ? 'bg-yellow-500/20 border-yellow-500/40 shadow-[0_0_40px_rgba(234,179,8,0.4)]' :
                                                    'bg-primary/20 border-primary/40 shadow-[0_0_40px_rgba(80,200,120,0.4)]'
                                                }`}>
                                                <p className="text-[9px] uppercase tracking-[0.4em] text-white/50 mb-1">
                                                    Combo Streak
                                                </p>
                                                <p className={`text-5xl font-black tracking-tighter ${combo >= 5 ? 'text-orange-400' :
                                                    combo >= 3 ? 'text-yellow-400' :
                                                        'text-primary'
                                                    }`}>
                                                    x{combo}
                                                </p>
                                                <p className={`text-[10px] uppercase tracking-widest mt-1 ${combo >= 5 ? 'text-orange-400' :
                                                    combo >= 3 ? 'text-yellow-400' :
                                                        'text-primary'
                                                    }`}>
                                                    {combo >= 5 ? '🔥 ON FIRE!' :
                                                        combo >= 3 ? '⚡ HOT STREAK!' :
                                                            '✨ NICE COMBO!'}
                                                </p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Decorative tech icon watermark */}
                                <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                                    {getTechIcon(selectedCategory, 200)}
                                </div>

                                {/* Question text */}
                                <div className="flex-1 flex flex-col items-center justify-center relative">
                                    <motion.h1
                                        key={questionIndex}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-2xl md:text-3xl font-normal text-center italic tracking-tight leading-relaxed max-w-3xl text-white/90"
                                    >
                                        {currentQuestion.question}
                                    </motion.h1>
                                </div>

                                {/* Answer options grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-12">
                                    {currentQuestion.options.map((opt, i) => (
                                        <motion.button
                                            key={i}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            whileHover={!hasAnswered ? { x: 8 } : {}}
                                            whileTap={!hasAnswered ? { scale: 0.98 } : {}}
                                            onClick={() => handleAnswer(i)}
                                            disabled={hasAnswered}
                                            className={`group p-6 rounded-3xl border transition-all text-left flex items-center gap-5 ${getButtonStyle(i)} ${hasAnswered ? 'cursor-default' : 'cursor-pointer'}`}
                                        >
                                            {/* Option letter badge */}
                                            <span className={`w-10 h-10 rounded-xl flex items-center justify-center text-[11px] font-mono border transition-all flex-shrink-0 ${i === answerResult?.correctAnswer && gamePhase === "answer_reveal"
                                                ? 'bg-green-500/20 border-green-500/40 text-green-400'
                                                : i === selectedAnswer && answerResult && !answerResult.isCorrect && gamePhase === "answer_reveal"
                                                    ? 'bg-red-500/20 border-red-500/40 text-red-400'
                                                    : 'bg-white/5 border-white/10 text-slate-600 group-hover:text-primary group-hover:bg-primary/10 group-hover:border-primary/20'
                                                }`}>
                                                {String.fromCharCode(65 + i)}
                                            </span>

                                            <span className="font-normal text-[15px] tracking-wide text-slate-400 group-hover:text-white transition-colors">
                                                {opt}
                                            </span>

                                            {/* Correct/wrong icon on reveal */}
                                            {gamePhase === "answer_reveal" && i === answerResult?.correctAnswer && (
                                                <IoCheckmarkCircleOutline size={20} className="text-green-400 ml-auto flex-shrink-0" />
                                            )}
                                            {gamePhase === "answer_reveal" && i === selectedAnswer && !answerResult?.isCorrect && (
                                                <IoCloseCircleOutline size={20} className="text-red-400 ml-auto flex-shrink-0" />
                                            )}
                                        </motion.button>
                                    ))}
                                </div>

                                {/* Waiting for other players indicator */}
                                {hasAnswered && gamePhase === "playing" && (
                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="text-center text-[10px] text-primary/40 uppercase tracking-[0.4em] mt-8 animate-pulse"
                                    >
                                        Menunggu pemain lain...
                                    </motion.p>
                                )}
                            </div>
                        </div>
                    )}
                </section>
            </main>

            {/* Tutorial overlay — shown once at game start */}
            <GameTutorial
                show={showTutorial}
                onDone={() => setShowTutorial(false)}
                category={selectedCategory}
            />

            {/* Fire streak full-screen overlay — triggers on combo milestones */}
            <FireStreakOverlay combo={combo} show={showFireOverlay} />
        </div>
    );
}