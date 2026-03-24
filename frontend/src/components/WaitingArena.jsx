import { motion, AnimatePresence } from "framer-motion";
import { SiPhp, SiJavascript, SiReact } from 'react-icons/si';
import {
    IoShieldCheckmarkOutline,
    IoPersonOutline,
    IoLockClosedOutline,
    IoFingerPrintOutline,
    IoPulseOutline
} from "react-icons/io5";

export default function WaitingArena({ roomId, roomPass, players, isHost, socketId, onStart, onCancel }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-4xl"
        >
            {/* --- 1. ARENA STATUS HUD --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                <div className="bg-white/[0.03] border border-white/10 p-8 rounded-[2.5rem] backdrop-blur-xl flex flex-col items-center group hover:border-primary/30 transition-all">
                    <p className="text-[9px] text-primary/50 font-normal uppercase tracking-[0.4em] mb-3 flex items-center gap-2">
                        <IoFingerPrintOutline size={12} /> Sector Identity
                    </p>
                    <h2 className="text-3xl font-medium tracking-[0.2em] text-white font-mono">#{roomId}</h2>
                </div>

                <div className="bg-white/[0.03] border border-white/10 p-8 rounded-[2.5rem] backdrop-blur-xl flex flex-col items-center group hover:border-primary/30 transition-all">
                    <p className="text-[9px] text-primary/50 font-normal uppercase tracking-[0.4em] mb-3 flex items-center gap-2">
                        <IoLockClosedOutline size={12} /> Sync Key
                    </p>
                    <h2 className="text-3xl font-medium tracking-[0.2em] text-primary font-mono">{roomPass}</h2>
                </div>
            </div>

            {/* --- 2. OPERATIVES GRID --- */}
            <div className="glass-card-roadmap border border-white/5 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden mb-10">
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h3 className="text-lg font-medium italic uppercase tracking-tighter text-white/90">Linked Operatives</h3>
                        <p className="text-[9px] text-slate-500 font-normal uppercase tracking-[0.2em] mt-1">
                            {players.length} / 10 Nodes Connected
                        </p>
                    </div>

                    <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-primary/5 border border-primary/10">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_#50C878]"></div>
                        <span className="text-[8px] font-medium text-primary uppercase tracking-[0.2em]">Signal Stable</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                    <AnimatePresence>
                        {players.map((p) => (
                            <motion.div
                                key={p.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className={`p-5 rounded-[1.5rem] border transition-all duration-500 flex flex-col items-center gap-3 ${p.id === socketId
                                        ? 'bg-primary/10 border-primary/30 shadow-[0_0_20px_rgba(80,200,120,0.1)]'
                                        : 'bg-white/[0.02] border-white/5 hover:border-white/20'
                                    }`}
                            >
                                {/* USER ICON WITH DECORATION */}
                                <div className="relative">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-lg border transition-all ${p.isHost ? 'bg-primary/20 border-primary/40 text-primary shadow-emerald-sm' : 'bg-white/5 border-white/10 text-slate-500'
                                        }`}>
                                        {p.isHost ? <IoShieldCheckmarkOutline size={24} /> : <IoPersonOutline size={24} />}
                                    </div>
                                    {p.id === socketId && (
                                        <div className="absolute -top-1 -right-1">
                                            <IoPulseOutline size={14} className="text-primary animate-pulse" />
                                        </div>
                                    )}
                                </div>

                                <div className="text-center w-full">
                                    <span className="text-[10px] font-medium uppercase tracking-wider truncate block text-slate-200">
                                        {p.name} {p.id === socketId && "(You)"}
                                    </span>
                                    {p.isHost && (
                                        <span className="text-[7px] text-primary font-normal uppercase tracking-[0.3em] mt-1 block italic">
                                            Commander
                                        </span>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>

            {/* --- 3. COMMAND CONTROLS --- */}
            <div className="flex flex-col gap-5">
                {isHost ? (
                    <motion.button
                        whileHover={{ scale: 1.01, letterSpacing: "0.6em" }}
                        whileTap={{ scale: 0.99 }}
                        onClick={onStart}
                        className="w-full bg-primary text-dark-abyss py-6 rounded-2xl font-medium text-[10px] uppercase tracking-[0.5em] transition-all shadow-2xl italic"
                    >
                        Initialize Combat Sequence
                    </motion.button>
                ) : (
                    <div className="w-full bg-white/[0.02] border border-white/5 py-6 rounded-2xl text-center">
                        <p className="text-[9px] text-primary/40 font-normal uppercase tracking-[0.6em] animate-pulse">
                            Awaiting Commander Authorization...
                        </p>
                    </div>
                )}

                <button
                    onClick={onCancel}
                    className="w-full py-4 text-slate-700 hover:text-red-500/80 font-normal text-[9px] uppercase tracking-[0.4em] transition-all"
                >
                    {isHost ? "Terminate Arena Instance" : "Sever Neural Connection"}
                </button>
            </div>
        </motion.div>
    );
}