import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import PixelBlast from "../components/PixelBlast";

// --- ICONS ---
import {
    IoChevronBackOutline,
    IoTrophyOutline,
    IoFlashOutline,
    IoStatsChartOutline,
    IoShieldCheckmarkOutline
} from "react-icons/io5";

export default function Leaderboard() {
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/leaderboard`);
                const data = await response.json();

                const sortedData = Array.isArray(data)
                    ? data.sort((a, b) => b.score - a.score)
                    : [];

                setPlayers(sortedData);
                setLoading(false);
            } catch (error) {
                console.error("Gagal mengambil data:", error);
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, []);

    return (
        <div className="min-h-screen bg-dark-abyss text-font-main font-poppins p-6 flex flex-col items-center relative overflow-hidden">

            {/* --- 1. BACKGROUND DYNAMIC --- */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <PixelBlast variant="square" pixelSize={4} color="#50C878" speed={0.2} transparent={true} />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(80,200,120,0.15),transparent_70%)]"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="z-10 w-full max-w-3xl"
            >
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-12 mt-12 gap-6">
                    <button
                        onClick={() => navigate("/")}
                        className="group text-slate-500 hover:text-primary transition-all flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.3em]"
                    >
                        <IoChevronBackOutline className="group-hover:-translate-x-1 transition-transform" size={14} />
                        Escape Arena
                    </button>

                    <div className="text-center md:text-right">
                        <h1 className="text-4xl font-medium tracking-tighter italic uppercase text-white">
                            Hall of <span className="text-primary">Fame</span>
                        </h1>
                        <p className="text-[9px] text-primary/40 font-normal uppercase tracking-[0.5em] mt-1">Top Arena Legends Detected</p>
                    </div>
                </div>

                {/* Main Leaderboard Table */}
                <div className="glass-card-roadmap border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl backdrop-blur-3xl">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/[0.02] text-slate-500 text-[9px] uppercase tracking-[0.3em] font-medium border-b border-white/5">
                                <th className="p-8">Rank</th>
                                <th className="p-8">Operator</th>
                                <th className="p-8 text-right">Score</th>
                                <th className="p-8 text-right hidden md:table-cell">Efficiency</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="p-32 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <IoStatsChartOutline className="text-primary animate-pulse" size={32} />
                                            <p className="text-[10px] text-primary/60 font-normal tracking-[0.4em] uppercase">Decrypting Records...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : players.length > 0 ? (
                                players.map((player, index) => (
                                    <tr key={index} className="hover:bg-primary/[0.02] transition-colors group">
                                        <td className="p-8">
                                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-mono text-xs border ${index === 0 ? "border-yellow-500/50 bg-yellow-500/10 text-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.2)]" :
                                                    index === 1 ? "border-slate-300/50 bg-slate-300/10 text-slate-300" :
                                                        index === 2 ? "border-orange-500/50 bg-orange-500/10 text-orange-500" :
                                                            "border-white/5 bg-white/5 text-slate-600"
                                                }`}>
                                                {index + 1}
                                            </div>
                                        </td>
                                        <td className="p-8">
                                            <div className="flex items-center gap-4">
                                                <div className="flex flex-col">
                                                    <p className="font-medium text-white text-sm uppercase tracking-wider group-hover:text-primary transition-colors">
                                                        {player.player_name}
                                                    </p>
                                                    <div className="flex items-center gap-3 mt-1 opacity-40 group-hover:opacity-100 transition-opacity">
                                                        <span className="text-[8px] font-normal uppercase tracking-widest flex items-center gap-1">
                                                            <IoShieldCheckmarkOutline size={10} /> Accuracy: {parseFloat(player.accuracy || 0).toFixed(1)}%
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-8 text-right">
                                            <p className="font-medium text-lg text-white tracking-tighter group-hover:text-primary transition-colors">
                                                {parseInt(player.score).toLocaleString()}
                                            </p>
                                        </td>
                                        <td className="p-8 text-right hidden md:table-cell">
                                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-white/5 border border-white/5">
                                                <IoFlashOutline size={12} className="text-primary/50" />
                                                <span className="text-[10px] font-mono text-slate-400">{parseFloat(player.avg_time || 0).toFixed(2)}s</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="p-32 text-center text-slate-600 font-normal uppercase text-[10px] tracking-[0.5em]">
                                        Zero Legends Detected in this Sector.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer Action */}
                <button
                    onClick={() => navigate("/")}
                    className="w-full mt-10 bg-transparent border border-white/5 hover:border-primary/30 hover:bg-primary/5 text-slate-500 hover:text-primary py-6 rounded-2xl font-medium transition-all uppercase tracking-[0.4em] text-[10px] group"
                >
                    <span className="group-hover:tracking-[0.6em] transition-all">Return to Mission Control</span>
                </button>
            </motion.div>

            {/* HUD Technical Line */}
            <div className="absolute bottom-8 w-full text-center opacity-10 flex items-center justify-center gap-4">
                <div className="h-[1px] w-20 bg-white"></div>
                <p className="text-[8px] font-mono uppercase tracking-[1em]">Persistent_Data_Stream_v4.0</p>
                <div className="h-[1px] w-20 bg-white"></div>
            </div>
        </div>
    );
}