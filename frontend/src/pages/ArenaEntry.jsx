import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import PixelBlast from "../components/PixelBlast";

// --- REACT ICONS ---
import {
    IoPersonOutline,
    IoFingerPrintOutline,
    IoLockClosedOutline,
    IoPlay,
    IoChevronBack,
    IoPulseOutline,
    IoEarthOutline
} from "react-icons/io5";

export default function ArenaEntry() {
    const [name, setName] = useState("");
    const [roomIdInput, setRoomIdInput] = useState("");
    const [roomPassInput, setRoomPassInput] = useState("");
    const navigate = useNavigate();

    const handleCreateRoom = () => {
        if (!name.trim()) return alert("Identify yourself!");
        const newRoomId = Math.random().toString(36).substring(2, 8).toUpperCase();
        const newPassword = Math.floor(1000 + Math.random() * 9000).toString();

        navigate(`/arena?room=${newRoomId}`, {
            state: { playerName: name, isHost: true, roomId: newRoomId, roomPass: newPassword }
        });
    };

    const handleJoinRoom = () => {
        if (!name.trim() || !roomIdInput.trim() || !roomPassInput.trim()) return alert("Complete all credentials!");
        navigate(`/arena?room=${roomIdInput.toUpperCase()}`, {
            state: { playerName: name, isHost: false, roomId: roomIdInput.toUpperCase(), roomPass: roomPassInput }
        });
    };
    return (
        <div className="relative w-full min-h-screen bg-dark-abyss flex items-center justify-center font-poppins text-font-main overflow-hidden">

            {/* --- 1. FIXED BACKGROUND LAYER --- */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <PixelBlast
                    variant="square"
                    pixelSize={4}
                    color="#50C878"
                    patternScale={2}
                    patternDensity={1.5}
                    speed={0.4}
                    transparent={true}
                    edgeFade={0.4}
                />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(80,200,120,0.1),transparent_70%)]"></div>
            </div>

            {/* --- 2. ENTRY HUB CARD --- */}
            <div className="relative z-10 w-full max-w-lg px-6">

                {/* Back Button - Reduced to font-normal */}
                <button
                    onClick={() => navigate("/")}
                    className="group mb-8 flex items-center gap-2 text-[10px] font-normal text-slate-500 hover:text-primary transition-all tracking-[0.4em] uppercase"
                >
                    <IoChevronBack className="group-hover:-translate-x-1 transition-transform" size={14} />
                    Back to Overview
                </button>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card-roadmap p-10 md:p-12 rounded-[3rem] shadow-2xl relative overflow-hidden"
                >
                    {/* HUD Decoration */}
                    <div className="absolute top-0 right-0 p-6 opacity-10">
                        <IoPulseOutline size={40} className="text-primary animate-pulse" />
                    </div>

                    <header className="mb-10 text-center">
                        {/* Title: Reduced from extabold to medium */}
                        <h2 className="text-3xl font-medium italic tracking-tighter uppercase mb-2">
                            Establish <span className="text-primary">Link</span>
                        </h2>
                        <p className="text-[10px] text-primary/50 font-normal tracking-[0.3em] uppercase">Neural Interface Protocol</p>
                    </header>

                    <div className="space-y-8">
                        {/* Nickname Input Wrapper */}
                        <div className="space-y-2">
                            {/* Label: Changed to font-normal */}
                            <label className="text-[9px] font-normal text-primary/70 tracking-widest uppercase ml-2 flex items-center gap-2">
                                <IoPersonOutline size={12} /> Player Data
                            </label>
                            <input
                                type="text"
                                placeholder="ENTER NICKNAME..."
                                className="w-full bg-white/[0.03] border border-white/10 p-5 rounded-2xl text-center outline-none focus:border-primary/40 focus:bg-primary/5 transition-all font-normal tracking-widest text-font-main uppercase placeholder:text-white/5"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        {/* Create Section - Button kept at medium for slight hierarchy */}
                        <motion.button
                            whileHover={{ scale: 1.02, boxShadow: "var(--shadow-emerald-strong)" }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleCreateRoom}
                            className="w-full bg-primary text-dark-abyss py-6 rounded-2xl font-medium text-lg italic tracking-tighter flex items-center justify-center gap-3 transition-all"
                        >
                            <IoPlay size={20} />
                            INITIALIZE NEW ARENA
                        </motion.button>

                        {/* Divider */}
                        <div className="flex items-center gap-4 py-2 opacity-20">
                            <div className="h-[1px] flex-1 bg-white"></div>
                            <span className="text-[8px] font-normal uppercase tracking-[0.4em]">Subsystem Connection</span>
                            <div className="h-[1px] flex-1 bg-white"></div>
                        </div>

                        {/* Join Section */}
                        <div className="space-y-4">
                            <div className="flex gap-4">
                                <div className="flex-1 space-y-2">
                                    <label className="text-[9px] font-normal text-white/30 tracking-widest uppercase ml-2 flex items-center gap-2">
                                        <IoEarthOutline size={12} /> Room ID
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="ARENA-ID"
                                        className="w-full bg-white/[0.03] border border-white/10 p-4 rounded-xl text-center uppercase tracking-widest font-normal text-xs focus:border-primary/40 transition-all placeholder:text-white/5"
                                        value={roomIdInput}
                                        onChange={(e) => setRoomIdInput(e.target.value.toUpperCase())}
                                    />
                                </div>
                                <div className="w-32 space-y-2">
                                    <label className="text-[9px] font-normal text-white/30 tracking-widest uppercase ml-2 flex items-center gap-2">
                                        <IoLockClosedOutline size={12} /> Key
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="CODE"
                                        className="w-full bg-white/[0.03] border border-white/10 p-4 rounded-xl text-center font-normal text-xs focus:border-primary/40 transition-all placeholder:text-white/5"
                                        value={roomPassInput}
                                        onChange={(e) => setRoomPassInput(e.target.value)}
                                    />
                                </div>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                onClick={handleJoinRoom}
                                className="w-full bg-transparent border border-primary/30 text-primary py-4 rounded-xl font-medium uppercase text-[10px] tracking-[0.4em] transition-all hover:bg-primary/10 flex items-center justify-center gap-3"
                            >
                                <IoFingerPrintOutline size={16} />
                                Connect to Station
                            </motion.button>
                        </div>
                    </div>
                </motion.div>

                {/* Footer HUD info */}
                <div className="mt-10 text-center opacity-30">
                    <p className="text-[8px] font-normal tracking-[0.5em] uppercase">
                        Wippy_Engine // Secure_Session_Active // 2026
                    </p>
                </div>
            </div>
        </div>
    );
}