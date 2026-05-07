import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import PixelBlast from "../components/PixelBlast";
import {
    IoTrophyOutline,
    IoMedalOutline,
    IoRibbonOutline,
    IoTimerOutline,
    IoLocateOutline,
    IoChevronForward,
} from "react-icons/io5";

export default function Podium() {
    const navigate = useNavigate();
    const location = useLocation();

    const { players, mySocketId, playerName, roomId, category } = location.state || {
        players: [],
        mySocketId: null,
        playerName: "Unknown",
        roomId: "------",
        category: "JAVASCRIPT"
    };

    const [showPodium, setShowPodium] = useState(false);
    const [showPlayers, setShowPlayers] = useState([]);
    const [showStats, setShowStats] = useState(false);

    // Sort players by score
    const sorted = [...players].sort((a, b) => (b.score || 0) - (a.score || 0));
    const top3 = sorted.slice(0, 3);
    const rest = sorted.slice(3);
    const me = sorted.find(p => p.name === playerName) || sorted[0];
    const myRank = sorted.findIndex(p => p.name === playerName) + 1 || 1;
    const myScore = me?.score || 0;
    const myCorrect = me?.correct || 0;
    const totalQ = players[0]?.totalQuestions || 0;
    const accuracy = totalQ > 0 ? (myCorrect / totalQ) * 100 : 0;
    const avgTime = totalQ > 0 ? (me?.totalTime || 0) / totalQ : 0;

    // Animasi masuk bertahap
    useEffect(() => {
        const t1 = setTimeout(() => setShowPodium(true), 500);
        const t2 = setTimeout(() => setShowPlayers(top3.map((_, i) => i)), 1200);
        const t3 = setTimeout(() => setShowStats(true), 2500);
        return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    }, []);

    const podiumConfig = [
        { rank: 1, height: "h-40", color: "from-yellow-500/30 to-yellow-500/5", border: "border-yellow-500/50", shadow: "shadow-[0_0_30px_rgba(234,179,8,0.3)]", icon: <IoTrophyOutline size={28} className="text-yellow-400" />, label: "text-yellow-400", number: "text-yellow-500" },
        { rank: 2, height: "h-28", color: "from-slate-400/30 to-slate-400/5", border: "border-slate-400/50", shadow: "shadow-[0_0_20px_rgba(148,163,184,0.2)]", icon: <IoMedalOutline size={24} className="text-slate-300" />, label: "text-slate-300", number: "text-slate-400" },
        { rank: 3, height: "h-20", color: "from-orange-500/30 to-orange-500/5", border: "border-orange-500/50", shadow: "shadow-[0_0_20px_rgba(249,115,22,0.2)]", icon: <IoRibbonOutline size={22} className="text-orange-400" />, label: "text-orange-400", number: "text-orange-500" },
    ];

    // Urutan animasi: 3rd → 2nd → 1st
    const podiumOrder = [
        top3[2] ? { player: top3[2], config: podiumConfig[2], delay: 0.3 } : null,
        top3[1] ? { player: top3[1], config: podiumConfig[1], delay: 0.6 } : null,
        top3[0] ? { player: top3[0], config: podiumConfig[0], delay: 1.0 } : null,
    ].filter(Boolean);

    const getRankEmoji = (rank) => {
        if (rank === 1) return "🥇";
        if (rank === 2) return "🥈";
        if (rank === 3) return "🥉";
        return `#${rank}`;
    };

    return (
        <div className="min-h-screen bg-dark-abyss text-font-main font-poppins relative overflow-hidden flex flex-col">

            {/* Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <PixelBlast variant="square" pixelSize={4} color="#50C878" speed={0.2} transparent={true} />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(80,200,120,0.08),transparent_70%)]" />
            </div>

            <div className="relative z-10 flex flex-col items-center px-6 py-12 flex-1">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-center mb-16"
                >
                    <p className="text-[9px] text-primary/40 tracking-[0.6em] uppercase mb-3">
                        Arena_{roomId} · {category}
                    </p>
                    <h1 className="text-5xl md:text-7xl font-thin tracking-tighter uppercase text-white">
                        Hall of <span className="text-primary italic">Fame</span>
                    </h1>
                    <div className="h-[1px] w-32 bg-primary/30 mx-auto mt-6" />
                </motion.div>

                {/* Podium */}
                <AnimatePresence>
                    {showPodium && (
                        <div className="flex items-end justify-center gap-4 md:gap-8 mb-16 w-full max-w-2xl">
                            {podiumOrder.map(({ player, config, delay }) => (
                                <motion.div
                                    key={player.id}
                                    initial={{ opacity: 0, y: 60 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{
                                        delay,
                                        type: "spring",
                                        stiffness: 200,
                                        damping: 20
                                    }}
                                    className="flex flex-col items-center gap-4 flex-1"
                                >
                                    {/* Player info di atas podium */}
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: delay + 0.3 }}
                                        className="text-center"
                                    >
                                        {/* Icon rank */}
                                        <div className={`w-14 h-14 rounded-2xl mx-auto mb-3 flex items-center justify-center border bg-gradient-to-b ${config.color} ${config.border} ${config.shadow}`}>
                                            {config.icon}
                                        </div>

                                        {/* Nama player */}
                                        <p className={`text-[11px] font-medium uppercase tracking-wider ${player.id === mySocketId ? 'text-primary' : 'text-white/90'}`}>
                                            {player.name}
                                            {player.name === playerName && <span className="text-primary/60"> (You)</span>}
                                        </p>

                                        {/* Score */}
                                        <p className={`text-2xl font-thin tracking-tighter mt-1 ${config.number}`}>
                                            {(player.score || 0).toLocaleString()}
                                        </p>
                                    </motion.div>

                                    {/* Podium block */}
                                    <motion.div
                                        initial={{ scaleY: 0 }}
                                        animate={{ scaleY: 1 }}
                                        transition={{ delay: delay + 0.1, duration: 0.5, ease: "easeOut" }}
                                        style={{ originY: 1 }}
                                        className={`w-full ${config.height} rounded-t-2xl bg-gradient-to-b ${config.color} border-t border-x ${config.border} ${config.shadow} flex items-start justify-center pt-4`}
                                    >
                                        <span className={`text-3xl font-thin ${config.label}`}>
                                            {config.rank}
                                        </span>
                                    </motion.div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </AnimatePresence>

                {/* Rest of players (4th onwards) */}
                {rest.length > 0 && showStats && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full max-w-lg mb-10"
                    >
                        <p className="text-[9px] text-slate-600 uppercase tracking-[0.4em] mb-4 text-center">
                            Other Operatives
                        </p>
                        <div className="space-y-2">
                            {rest.map((player, i) => (
                                <div
                                    key={player.id}
                                    className={`flex items-center gap-4 px-5 py-3 rounded-2xl border transition-all ${player.name === playerName ? 'bg-primary/10 border-primary/20' : 'bg-white/[0.02] border-white/5'
                                        }`}
                                >
                                    <span className="text-[11px] font-mono text-slate-600 w-6">
                                        {getRankEmoji(i + 4)}
                                    </span>
                                    <span className="text-[11px] font-normal uppercase tracking-wider text-slate-300 flex-1">
                                        {player.name}
                                        {player.id === mySocketId && (
                                            <span className="text-primary/60"> (You)</span>
                                        )}
                                    </span>
                                    <span className="text-[11px] font-mono text-primary">
                                        {(player.score || 0).toLocaleString()}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* My Stats Card */}
                <AnimatePresence>
                    {showStats && (
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="w-full max-w-lg"
                        >
                            {/* Rank badge */}
                            <div className="text-center mb-6">
                                <p className="text-[9px] text-primary/40 uppercase tracking-[0.5em] mb-2">
                                    Your Result
                                </p>
                                <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/5 border border-white/10">
                                    <span className="text-2xl">{getRankEmoji(myRank)}</span>
                                    <span className="text-white font-medium text-sm uppercase tracking-wider">
                                        Rank #{myRank} of {sorted.length}
                                    </span>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="glass-card-roadmap p-8 rounded-[2.5rem] border border-white/10 grid grid-cols-3 gap-6 mb-8">
                                <div className="text-center">
                                    <div className="flex items-center justify-center gap-1 mb-2 text-slate-500">
                                        <IoTrophyOutline size={14} />
                                    </div>
                                    <p className="text-2xl font-thin text-white tracking-tighter">
                                        {myScore.toLocaleString()}
                                    </p>
                                    <p className="text-[8px] text-slate-600 uppercase tracking-widest mt-1">Score</p>
                                </div>
                                <div className="text-center border-x border-white/5">
                                    <div className="flex items-center justify-center gap-1 mb-2 text-slate-500">
                                        <IoLocateOutline size={14} />
                                    </div>
                                    <p className="text-2xl font-thin text-white tracking-tighter">
                                        {accuracy.toFixed(0)}%
                                    </p>
                                    <p className="text-[8px] text-slate-600 uppercase tracking-widest mt-1">Accuracy</p>
                                </div>
                                <div className="text-center">
                                    <div className="flex items-center justify-center gap-1 mb-2 text-slate-500">
                                        <IoTimerOutline size={14} />
                                    </div>
                                    <p className="text-2xl font-thin text-white tracking-tighter">
                                        {avgTime.toFixed(1)}s
                                    </p>
                                    <p className="text-[8px] text-slate-600 uppercase tracking-widest mt-1">Avg Time</p>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="grid grid-cols-2 gap-4">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => navigate("/entry")}
                                    className="w-full bg-primary text-dark-abyss py-5 rounded-2xl font-medium text-[11px] uppercase tracking-[0.3em] transition-all"
                                >
                                    Play Again
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => navigate("/leaderboard")}
                                    className="w-full bg-transparent border border-white/10 text-slate-400 py-5 rounded-2xl font-medium text-[11px] uppercase tracking-[0.3em] transition-all hover:border-white/30 hover:text-white flex items-center justify-center gap-2"
                                >
                                    Leaderboard <IoChevronForward size={14} />
                                </motion.button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}