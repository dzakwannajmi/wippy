import { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { io } from "socket.io-client";
import { motion, AnimatePresence } from "framer-motion";
import WaitingArena from "../components/WaitingArena";
import PixelBlast from "../components/PixelBlast";

import { SiPhp, SiJavascript, SiReact } from 'react-icons/si';

import {
    IoFingerPrintOutline,
    IoAnalyticsOutline,
    IoTimerOutline,
    IoPowerOutline,
    IoShieldCheckmarkOutline,
    IoPulseOutline,
    IoRadioOutline
} from "react-icons/io5";

import { QUESTION_BANK } from "../../question";

export default function QuizRoom() {
    const navigate = useNavigate();
    const location = useLocation();

    // ✅ Socket dipindah ke dalam component + useMemo agar env terbaca
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

    const [isWaiting, setIsWaiting] = useState(true);
    const [players, setPlayers] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [timeLeft, setTimeLeft] = useState(10);
    const [score, setScore] = useState(0);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [totalTime, setTotalTime] = useState(0);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [questions, setQuestions] = useState([]);

    // ✅ Cleanup socket saat component unmount
    useEffect(() => {
        return () => {
            socket.disconnect();
        };
    }, [socket]);

    useEffect(() => {
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

        socket.on("update_players", (playersList) => setPlayers(playersList));
        socket.on("receive_start_game", (category) => {
            setQuestions(QUESTION_BANK[category] || []);
            setSelectedCategory(category);
            setIsWaiting(false);
        });
        socket.on("room_terminated", (msg) => {
            alert(msg);
            navigate("/");
        });

        return () => {
            socket.off("update_players");
            socket.off("receive_start_game");
            socket.off("room_terminated");
        };
    }, [roomId, playerName, isHost, roomPass, navigate, socket]);

    useEffect(() => {
        if (isWaiting || questions.length === 0) return;
        if (timeLeft === 0) {
            handleNext();
            return;
        }
        const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
        return () => clearTimeout(timer);
    }, [timeLeft, isWaiting, questions]);

    const handleNext = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(prev => prev + 1);
            setTimeLeft(10);
        } else {
            const avgTime = totalTime / questions.length;
            const accuracy = (correctAnswers / questions.length) * 100;
            navigate("/result", {
                state: { score, accuracy, avgTime, playerName, roomId }
            });
        }
    };

    const handleAnswer = (index) => {
        const correct = questions[currentQuestion].answer;
        const timeUsed = 10 - timeLeft;
        setTotalTime(prev => prev + timeUsed);

        let newScore = score;
        if (index === correct) {
            const gainedScore = 100 + (timeLeft * 10);
            newScore = score + gainedScore;
            setScore(newScore);
            setCorrectAnswers(prev => prev + 1);
            socket.emit("update_score", { roomId, score: newScore });
        }
        handleNext();
    };

    const getTechIcon = (tech, active) => {
        const size = 32;
        switch (tech) {
            case 'PHP':
                return <SiPhp size={size} className={active ? "text-[#777BB4]" : "text-slate-500"} />;
            case 'JAVASCRIPT':
                return <SiJavascript size={size} className={active ? "text-[#F7DF1E]" : "text-slate-500"} />;
            case 'REACT':
                return <SiReact size={size} className={active ? "text-[#61DAFB] animate-spin-slow" : "text-slate-500"} />;
            default:
                return null;
        }
    };

    const TopicSelector = () => (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-8">
            {Object.keys(QUESTION_BANK).map((tech) => (
                <motion.div
                    key={tech}
                    whileHover={{ scale: 1.05, borderColor: '#50C878' }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedCategory(tech)}
                    className={`cursor-pointer p-8 rounded-[2.5rem] border transition-all flex flex-col items-center gap-4 backdrop-blur-md ${selectedCategory === tech
                        ? 'border-primary bg-primary/10 shadow-[0_0_25px_rgba(80,200,120,0.2)]'
                        : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.05]'
                        }`}
                >
                    <div className={`p-4 rounded-2xl ${selectedCategory === tech ? 'bg-white/10' : 'bg-white/5'}`}>
                        {getTechIcon(tech, selectedCategory === tech)}
                    </div>
                    <h3 className="font-medium tracking-[0.2em] uppercase text-xs">{tech}</h3>
                </motion.div>
            ))}
        </div>
    );

    const q = questions[currentQuestion];
    const progress = questions.length > 0 ? ((currentQuestion + 1) / questions.length) * 100 : 0;

    return (
        <div className="min-h-screen flex flex-col bg-dark-abyss text-font-main font-poppins relative overflow-hidden">
            <div className="fixed inset-0 z-0 pointer-events-none">
                <PixelBlast variant="square" pixelSize={4} color="#50C878" speed={0.4} transparent={true} />
                <div className="absolute inset-0 bg-arena-grid opacity-10"></div>
            </div>

            <header className="relative z-30 w-full border-b border-white/5 bg-black/60 backdrop-blur-2xl px-8 py-5 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary drop-shadow-[0_0_8px_rgba(80,200,120,0.4)]">
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
                <aside className="w-full lg:w-80 flex flex-col gap-8">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card-roadmap p-8 rounded-[2.5rem] border border-white/5 relative overflow-hidden">
                        <div className="absolute -top-4 -right-4 opacity-5 text-primary">
                            <IoPulseOutline size={100} />
                        </div>
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-[0_0_15px_rgba(80,200,120,0.2)]">
                                <IoFingerPrintOutline size={22} />
                            </div>
                            <div>
                                <h3 className="text-sm font-medium tracking-tight uppercase italic">{playerName}</h3>
                                <p className="text-[8px] font-normal text-primary/40 tracking-widest uppercase">Identity_Verified</p>
                            </div>
                        </div>
                        <div className="space-y-4 pt-6 border-t border-white/5">
                            <div className="flex justify-between items-center text-[10px]">
                                <span className="text-slate-500 uppercase tracking-widest">Network_Score</span>
                                <span className="font-mono text-primary">{score}</span>
                            </div>
                        </div>
                    </motion.div>

                    <div className="glass-card-roadmap p-8 rounded-[2.5rem] border border-white/5 flex-1 shadow-2xl overflow-hidden">
                        <h4 className="text-[9px] font-normal text-slate-400 uppercase tracking-[0.4em] mb-6 flex items-center gap-2">
                            <IoAnalyticsOutline size={16} className="text-primary/60" /> Live_Telemetry
                        </h4>
                        <div className="space-y-4">
                            {players.sort((a, b) => (b.score || 0) - (a.score || 0)).map((p, i) => (
                                <div key={p.id} className="flex justify-between items-center bg-white/[0.02] px-4 py-3 rounded-2xl border border-white/5 transition-all hover:border-primary/20">
                                    <span className="text-[10px] font-mono text-slate-600">0{i + 1}</span>
                                    <span className="text-[10px] font-normal uppercase flex-1 ml-4 truncate text-slate-300">{p.name}</span>
                                    <span className="text-[10px] font-mono text-primary">{p.score || 0}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>

                <section className="flex-1 flex flex-col gap-8">
                    {isWaiting ? (
                        <div className="flex-1 flex flex-col items-center justify-center">
                            {isHost && (
                                <div className="text-center mb-12">
                                    <p className="text-[10px] text-primary/40 tracking-[0.6em] uppercase mb-4">Core_Selector</p>
                                    <TopicSelector />
                                </div>
                            )}
                            <WaitingArena
                                roomId={roomId} roomPass={roomPass} players={players}
                                isHost={isHost} socketId={socket.id}
                                onStart={() => {
                                    if (!selectedCategory) return alert("Select Core Sector!");
                                    socket.emit("start_game", { roomId, category: selectedCategory });
                                }}
                                onCancel={() => socket.emit("cancel_room", roomId)}
                            />
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col gap-8 animate-in fade-in zoom-in duration-700">
                            <div className="flex justify-between items-end px-6">
                                <div className="flex items-center gap-4">
                                    <div className="p-4 bg-red-500/5 text-red-500 rounded-2xl border border-red-500/10 shadow-[0_0_15px_rgba(239,68,68,0.1)]">
                                        <IoTimerOutline size={24} className={timeLeft <= 3 ? 'animate-ping' : ''} />
                                    </div>
                                    <div>
                                        <p className="text-red-500/40 text-[9px] tracking-[0.4em] uppercase font-normal">Extraction_Time</p>
                                        <p className="text-3xl font-mono leading-none tracking-tighter">{timeLeft}s</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-slate-600 text-[9px] tracking-[0.3em] uppercase mb-2">Sync_Progress {currentQuestion + 1}/{questions.length}</p>
                                    <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden">
                                        <motion.div className="h-full bg-primary shadow-[0_0_10px_#50C878]" animate={{ width: `${progress}%` }} />
                                    </div>
                                </div>
                            </div>

                            <div className="glass-card-roadmap flex-1 rounded-[3.5rem] p-16 border border-white/10 relative overflow-hidden flex flex-col shadow-[0_0_60px_rgba(0,0,0,0.5)]">
                                <div className="absolute top-0 left-0 w-full h-[1px] bg-white/5">
                                    <motion.div
                                        className={`h-full shadow-[0_0_10px_currentColor] ${timeLeft <= 3 ? 'bg-red-500 text-red-500' : 'bg-primary text-primary'}`}
                                        animate={{ width: `${(timeLeft / 10) * 100}%` }}
                                        transition={{ duration: 1, ease: "linear" }}
                                    />
                                </div>

                                <div className="flex-1 flex flex-col items-center justify-center relative">
                                    <div className="absolute opacity-5 pointer-events-none">
                                        {selectedCategory === 'PHP' && <SiPhp size={200} />}
                                        {selectedCategory === 'JAVASCRIPT' && <SiJavascript size={200} />}
                                        {selectedCategory === 'REACT' && <SiReact size={200} className="animate-spin-slow" />}
                                    </div>

                                    <h1 className="relative z-10 text-2xl md:text-3xl font-normal text-center italic tracking-tight leading-relaxed max-w-3xl text-white/90">
                                        {q?.question}
                                    </h1>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-12">
                                    {q?.options.map((opt, i) => (
                                        <motion.button
                                            key={i}
                                            whileHover={{ x: 8, backgroundColor: "rgba(80,200,120,0.08)", borderColor: "rgba(80,200,120,0.4)" }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => handleAnswer(i)}
                                            className="group p-6 rounded-3xl bg-white/[0.03] border border-white/5 transition-all text-left flex items-center gap-5"
                                        >
                                            <span className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[11px] font-mono text-slate-600 group-hover:text-primary group-hover:bg-primary/10 transition-all border border-transparent group-hover:border-primary/20">
                                                {String.fromCharCode(65 + i)}
                                            </span>
                                            <span className="font-normal text-[15px] tracking-wide text-slate-400 group-hover:text-white transition-colors">{opt}</span>
                                        </motion.button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}