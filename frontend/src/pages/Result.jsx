import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import PixelBlast from "../components/PixelBlast";

// --- ICONS ---
import {
    IoTrophyOutline,
    IoTimerOutline,
    IoLocateOutline,
    IoPersonOutline,
    IoCloudUploadOutline,
    IoChevronForward,
    IoSkullOutline
} from "react-icons/io5";

export default function Result() {
    const location = useLocation();
    const navigate = useNavigate();

    const { score, accuracy, avgTime, playerName, roomId } = location.state || {
        score: 0,
        accuracy: 0,
        avgTime: 0,
        playerName: "Unknown_Agent",
        roomId: "------"
    };

    const [saveStatus, setSaveStatus] = useState("Initializing...");
    const hasSaved = useRef(false);

    useEffect(() => {
        const saveScoreToDB = async () => {
            if (hasSaved.current) return;
            hasSaved.current = true;
            setSaveStatus("Syncing Telemetry...");

            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/save-score`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ playerName, score, accuracy, avgTime, roomId }),
                });

                const data = await response.json();
                if (data.status === "success") {
                    setSaveStatus("Authenticated ✅");
                } else {
                    setSaveStatus("Sync Failed ❌");
                }
            } catch (error) {
                setSaveStatus("Offline 🔌");
                hasSaved.current = false;
            }
        };

        if (location.state) saveScoreToDB();
    }, [location.state, score, accuracy, avgTime, playerName, roomId]);

    const getFeedback = () => {
        if (accuracy >= 80) return { text: "UNSTOPPABLE! ARENA LEGEND!", icon: <IoTrophyOutline className="text-primary" /> };
        if (accuracy >= 50) return { text: "GREAT WORK! MISSION COMPLETE!", icon: <IoTrophyOutline className="text-primary/60" /> };
        return { text: "MISSION FAILED! RE-TRAINING REQUIRED!", icon: <IoSkullOutline className="text-red-500/50" /> };
    };

    const feedback = getFeedback();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-dark-abyss text-font-main font-poppins p-6 relative overflow-hidden">

            {/* --- 1. BACKGROUND --- */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <PixelBlast variant="square" pixelSize={4} color="#50C878" speed={0.2} transparent={true} />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(80,200,120,0.1),transparent_70%)]"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="z-10 w-full max-w-xl text-center"
            >
                {/* Status Indicator */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md">
                    <IoCloudUploadOutline size={14} className={saveStatus.includes('✅') ? "text-primary" : "text-slate-500 animate-pulse"} />
                    <span className="text-[9px] font-medium uppercase tracking-[0.3em] text-slate-400">{saveStatus}</span>
                </div>

                {/* Feedback Header */}
                <div className="mb-10">
                    <div className="mb-4 inline-flex items-center justify-center w-20 h-20 rounded-[2rem] bg-primary/10 border border-primary/20 shadow-emerald-sm">
                        {feedback.icon}
                    </div>
                    <h1 className="text-4xl font-medium tracking-tighter uppercase italic mb-2">
                        Mission <span className="text-primary">Debrief</span>
                    </h1>
                    <p className="text-slate-500 text-[10px] font-normal uppercase tracking-[0.4em]">
                        {feedback.text}
                    </p>
                </div>

                {/* Main HUD Card */}
                <div className="glass-card-roadmap p-12 rounded-[3.5rem] border border-white/10 shadow-2xl mb-10 relative overflow-hidden">
                    {/* Decorative Corner Label */}
                    <div className="absolute top-8 right-10 text-[8px] font-mono text-white/10 tracking-widest uppercase">
                        Ref_ID: {Math.random().toString(36).substring(7).toUpperCase()}
                    </div>

                    <div className="mb-12">
                        <p className="text-[10px] text-primary/60 uppercase tracking-[0.5em] mb-4 font-normal">Score Accumulated</p>
                        <h2 className="text-8xl font-medium text-transparent bg-clip-text bg-gradient-to-b from-white to-primary/40 leading-none tracking-tighter">
                            {score}
                        </h2>
                    </div>

                    <div className="grid grid-cols-2 gap-6 pt-10 border-t border-white/5">
                        <div className="text-left">
                            <div className="flex items-center gap-2 mb-2 text-slate-500">
                                <IoLocateOutline size={14} />
                                <span className="text-[9px] uppercase font-medium tracking-widest">Accuracy</span>
                            </div>
                            <p className="text-2xl font-medium text-white tracking-tighter">{accuracy?.toFixed(1)}%</p>
                        </div>
                        <div className="text-left">
                            <div className="flex items-center gap-2 mb-2 text-slate-500">
                                <IoTimerOutline size={14} />
                                <span className="text-[9px] uppercase font-medium tracking-widest">Efficiency</span>
                            </div>
                            <p className="text-2xl font-medium text-white tracking-tighter">{avgTime?.toFixed(2)}s</p>
                        </div>
                    </div>

                    <div className="mt-12 flex justify-between items-center px-2 opacity-40">
                        <div className="text-left">
                            <p className="text-[8px] font-normal uppercase tracking-widest flex items-center gap-2">
                                <IoPersonOutline /> Operator
                            </p>
                            <p className="text-xs font-medium text-white">{playerName}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-[8px] font-normal uppercase tracking-widest">Sector_Link</p>
                            <p className="text-xs font-medium text-white">#{roomId}</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <motion.button
                        whileHover={{ scale: 1.02, backgroundColor: "rgba(80,200,120,1)", color: "#030014" }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate("/entry")}
                        className="w-full bg-primary text-dark-abyss py-5 rounded-2xl font-medium text-[11px] uppercase tracking-[0.3em] shadow-2xl transition-all"
                    >
                        Re-Initialize Link
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.02, borderColor: "rgba(255,255,255,0.4)", color: "#fff" }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate("/leaderboard")}
                        className="w-full bg-transparent border border-white/10 py-5 rounded-2xl font-medium text-[11px] uppercase tracking-[0.3em] text-slate-400 transition-all flex items-center justify-center gap-2"
                    >
                        Hall of Fame <IoChevronForward size={14} />
                    </motion.button>
                </div>
            </motion.div>

            <footer className="absolute bottom-8 w-full text-center">
                <p className="text-white/10 text-[9px] uppercase tracking-[0.6em] font-normal">
                    Wippy_Engine // Persistent_Memory_Active
                </p>
            </footer>
        </div>
    );
}