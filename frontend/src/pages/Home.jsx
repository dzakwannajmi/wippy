import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import PixelBlast from "../components/PixelBlast";
import CardSwap, { Card } from "../components/ui/CardSwap";
import LogoLoop from "../components/LogoLoop";

// --- REACT ICONS ---
import {
    IoFlash, IoRocket, IoSparkles, IoTimerOutline, IoCodeSlash,
    IoDesktopOutline, IoTrophyOutline, IoMicOutline, IoMapOutline,
    IoPlay, IoCheckmarkCircleOutline, IoSettingsOutline, IoSparklesOutline
} from "react-icons/io5";
import { FaInstagram, FaGithub, FaDiscord, FaNodeJs, FaNode } from "react-icons/fa";

import { SiReact, SiNextdotjs, SiJavascript, SiTailwindcss, SiVite, SiSocketdotio } from 'react-icons/si';

export default function Home() {
    const navigate = useNavigate();

    // --- TECH STACK LOGOS (Alternating Emerald Colors) ---
    const techLogos = [
        { node: <SiReact size={35} className="text-primary" />, title: "React" },
        { node: <SiNextdotjs size={35} className="text-primary/30" />, title: "Next.js" },
        { node: <SiJavascript size={35} className="text-primary" />, title: "JavaScript" },
        { node: <SiTailwindcss size={35} className="text-primary/30" />, title: "Tailwind CSS" },
        { node: <SiVite size={35} className="text-primary" />, title: "Vite" },
        { node: <SiSocketdotio size={35} className="text-primary/30" />, title: "Socket.io" },
        { node: <FaNodeJs size={35} className="text-primary/30" />, title: "Node.js" },
    ];

    return (
        <div className="relative w-full min-h-screen bg-dark-abyss overflow-x-hidden font-poppins text-font-main">

            {/* --- 1. DYNAMIC BACKGROUND --- */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <PixelBlast
                    variant="square"
                    pixelSize={4}
                    color="#50C878"
                    patternScale={2}
                    patternDensity={1.5}
                    enableRipples={true}
                    speed={0.4}
                    transparent={true}
                    edgeFade={0.4}
                />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(80,200,120,0.1),transparent_70%)]"></div>
            </div>

            {/* --- 2. MAIN CONTENT --- */}
            <div className="relative z-10 flex flex-col items-center">

                {/* --- HERO SECTION --- */}
                <section className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6 pt-20" id="hero">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mb-8 flex items-center gap-3 px-5 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-md"
                    >
                        <IoFlash className="text-primary animate-pulse" size={14} />
                        <span className="text-[10px] text-primary font-bold tracking-[0.3em] uppercase italic">
                            Digital Knowledge War v4.0
                        </span>
                    </motion.div>

                    <h1 className="text-6xl md:text-9xl font-extrabold text-font-main leading-[1] tracking-tighter mb-6 italic drop-shadow-[0_0_30px_rgba(80,200,120,0.2)]">
                        IT'S DANGEROUS TO GO <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-emerald-400 to-secondary">
                            ALONE! TAKE WIPPY.
                        </span>
                    </h1>

                    <p className="max-w-2xl text-slate-400 text-sm md:text-xl mb-12 font-medium leading-relaxed">
                        Challenge your friends in a real-time programming duel arena.
                        Prove who is the fastest at conquering code in this neural-link battlefield.
                    </p>

                    <motion.button
                        whileHover={{ scale: 1.05, boxShadow: "var(--shadow-emerald-strong)" }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate("/entry")}
                        className="flex items-center gap-4 px-16 py-6 bg-primary text-dark-abyss rounded-full font-bold text-2xl italic tracking-tighter shadow-2xl transition-all"
                    >
                        <IoPlay size={30} />
                        LAUNCH MISSION
                    </motion.button>
                </section>



                {/* --- 4. FEATURES SECTION --- */}
                <section className="w-full max-w-6xl px-8 py-16 grid grid-cols-1 md:grid-cols-3 gap-10">
                    {[
                        { title: "REAL-TIME DUEL", desc: "Millisecond synchronization for a battle without latency.", icon: <IoTimerOutline size={35} /> },
                        { title: "TECH STACK FOCUS", desc: "Curated questions focusing on JavaScript, React, and Fullstack engines.", icon: <IoCodeSlash size={35} /> },
                        { title: "EMERALD INTERFACE", desc: "Futuristic UI designed for high-level focus and long training sessions.", icon: <IoDesktopOutline size={35} /> }
                    ].map((feature, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ y: -10 }}
                            className="p-10 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-xl hover:border-primary/40 transition-all group"
                        >
                            <div className="w-16 h-16 bg-primary/10 rounded-2xl mb-6 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-dark-abyss transition-all">
                                {feature.icon}
                            </div>
                            <h3 className="text-2xl font-bold italic mb-4 tracking-tighter text-primary uppercase">{feature.title}</h3>
                            <p className="text-sm text-slate-400 leading-relaxed font-medium">{feature.desc}</p>
                        </motion.div>
                    ))}
                </section>

                {/* --- 5. TECH SHOWCASE (BOXED SECTION) --- */}
                <section className="w-full flex justify-center px-6 py-24">
                    {/* CONTAINER UTAMA (Border luar yang membungkus semua) */}
                    <div className="w-full max-w-6xl border-[1px] border-white/20 rounded-[3rem] bg-white/[0.02] backdrop-blur-sm p-12 md:p-20 flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden group hover:border-white/40 transition-colors duration-700">

                        {/* Dekorasi Cahaya di pojok border (Opsional) */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] -z-10"></div>

                        {/* SISI KIRI: TEXT CONTENT */}
                        <div className="flex-1 text-center md:text-left z-10">
                            <h2 className="text-4xl md:text-6xl font-black text-font-main leading-[1.1] tracking-tighter mb-6">
                                Card stacks have <br />
                                <span className="text-primary">never looked so good</span>
                            </h2>
                            <p className="text-slate-400 text-sm md:text-lg max-w-md mx-auto md:mx-0 font-medium leading-relaxed opacity-80">
                                Just look at it go! <br />
                                WebSocket and Vite technologies work in sync to provide the smoothest experience.
                            </p>
                        </div>

                        {/* SISI KANAN: CARD SWAP AREA */}
                        {/* --- SISI KANAN: CARD SWAP AREA --- */}
                        <div className="flex-1 relative w-full h-[300px] flex items-center justify-center perspective-[1200px] overflow-visible translate-y-24 md:translate-y-50">
                            <CardSwap
                                width={400}
                                height={500}
                                delay={5000}
                                skewAmount={12}
                                cardDistance={65}
                                verticalDistance={75}
                            >
                                {/* Card 1: Reliable */}
                                <Card className="flex flex-col items-start justify-start p-8 border-white/60 bg-black shadow-2xl rounded-[2rem]">
                                    <div className="flex items-center gap-3">
                                        {/* Indikator Titik Tetap Ada */}

                                        <div className="flex items-center gap-2 text-white/90">
                                            <IoCheckmarkCircleOutline size={20} className="text-primary" />
                                            <h4 className="font-medium text-lg uppercase tracking-widest">Reliable</h4>
                                        </div>
                                    </div>
                                </Card>

                                {/* Card 2: Customizable */}
                                <Card className="flex flex-col items-start justify-start p-8 border-white/60 bg-black shadow-2xl rounded-[2rem]">
                                    <div className="flex items-center gap-3">

                                        <div className="flex items-center gap-2 text-white/90">
                                            <IoSettingsOutline size={20} className="text-primary" />
                                            <h4 className="font-medium text-lg uppercase tracking-widest">Customizable</h4>
                                        </div>
                                    </div>
                                </Card>

                                {/* Card 3: Smooth */}
                                <Card className="flex flex-col items-start justify-start p-8 border-white/60 bg-black shadow-2xl rounded-[2rem]">
                                    <div className="flex items-center gap-3">

                                        <div className="flex items-center gap-2 text-white/90">
                                            <IoSparklesOutline size={20} className="text-primary" />
                                            <h4 className="font-medium text-lg uppercase tracking-widest">Smooth</h4>
                                        </div>
                                    </div>
                                </Card>
                            </CardSwap>
                        </div>
                    </div>
                </section>

                {/* --- 6. FUTURE ROADMAP (MISSION LOG VERSION) --- */}
                <section className="w-full max-w-4xl px-8 py-24">
                    <div className="flex flex-col items-center mb-16 text-center">
                        <h2 className="text-4xl md:text-5xl font-bold tracking-tighter uppercase">
                            Mission <span className="text-primary">Roadmap</span>
                        </h2>
                        <p className="text-[10px] text-primary/60 tracking-[0.4em] uppercase mt-2">Quest Log & Expansion Data</p>
                        <div className="h-1 w-24 bg-primary mt-4 rounded-full shadow-emerald"></div>
                    </div>

                    <div className="space-y-8">
                        {[
                            {
                                phase: "LEVEL 01",
                                task: "Global Ranking & Competitive MMR",
                                status: "QUEST ACTIVE",
                                progress: 100,
                                reward: "Exclusive Emerald Rank Badge",
                                icon: <IoTrophyOutline size={22} />
                            },
                            {
                                phase: "LEVEL 02",
                                task: "Voice Chat Integration",
                                status: "SOON",
                                progress: 0,
                                reward: "Communication Hub Unlock",
                                icon: <IoMicOutline size={22} />
                            },
                            {
                                phase: "LEVEL 03",
                                task: "Custom Arena Builder",
                                status: "LOCKED",
                                progress: 0,
                                reward: "Level 10 Architect Title",
                                icon: <IoMapOutline size={22} />
                            },
                        ].map((item, i) => (
                            <div
                                key={i}
                                className="glass-card-roadmap quest-card-hover relative flex flex-col p-8 rounded-[2rem] shadow-2xl overflow-hidden border border-white/5"
                            >
                                {/* Corner Decoration for Gaming HUD Feel */}
                                <div className="absolute top-0 right-0 p-4 opacity-20">
                                    <span className="text-[8px] font-mono tracking-widest uppercase">ID: Arena_Expansion_{i + 1}</span>
                                </div>

                                <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-6">
                                    {/* Phase Icon with Hexagon-like glow */}
                                    <div className="relative shrink-0">
                                        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-[0_0_15px_rgba(80,200,120,0.2)]">
                                            {item.icon}
                                        </div>
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-1">
                                            <span className="text-[10px] font-bold text-primary tracking-[0.2em]">{item.phase}</span>
                                            <span className={`text-[8px] font-bold px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white/40 uppercase`}>
                                                Reward: {item.reward}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-semibold text-white/90 italic tracking-tight uppercase">
                                            {item.task}
                                        </h3>
                                    </div>

                                    {/* Status Badge */}
                                    <div className="shrink-0 pt-2 md:pt-0">
                                        <span className={`text-[9px] font-bold px-4 py-1.5 rounded-lg border tracking-widest transition-all ${item.status === 'QUEST ACTIVE'
                                                ? 'badge-active animate-pulse'
                                                : 'badge-locked'
                                            }`}>
                                            {item.status}
                                        </span>
                                    </div>
                                </div>

                                {/* MISSION PROGRESS BAR */}
                                <div className="w-full space-y-2">
                                    <div className="flex justify-between items-end">
                                        <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest">Expansion Progress</span>
                                        <span className="text-[10px] font-mono text-primary">{item.progress}%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            whileInView={{ width: `${item.progress}%` }}
                                            transition={{ duration: 1.5, ease: "easeOut" }}
                                            className={`h-full rounded-full ${item.progress > 0 ? 'progress-bar-glow' : 'bg-transparent'}`}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* --- 7. TECH STACK LOOP (Tightened Spacing) --- */}
                <section className="w-full py-4 mb-10">
                    <div className="text-center mb-6">
                        {/* CHANGE: Brightened the text color from primary/40 to primary/70 for better visibility */}
                        <p className="text-[10px] font-semibold text-primary/70 tracking-[0.5em] uppercase">
                            Built with Premium Stack
                        </p>
                    </div>
                    <div className="w-full h-[80px] relative overflow-hidden flex items-center">
                        <LogoLoop
                            logos={techLogos}
                            speed={120}
                            direction="left"
                            logoHeight={35}
                            gap={70}
                            hoverSpeed={0}
                            scaleOnHover={true}
                            fadeOut={true}
                            fadeOutColor="#030014"
                            ariaLabel="Technology stack"
                        />
                    </div>
                </section>

                {/* --- 8. FOOTER --- */}
                <footer className="w-full border-t border-white/5 bg-black/40 backdrop-blur-2xl pt-20 pb-12 px-8 flex flex-col items-center mt-20">
                    <div className="flex gap-12 mb-10">
                        <a href="#" className="text-slate-500 hover:text-primary transition-all hover:-translate-y-1"><FaInstagram size={28} /></a>
                        <a href="#" className="text-slate-500 hover:text-primary transition-all hover:-translate-y-1"><FaGithub size={28} /></a>
                        <a href="#" className="text-slate-500 hover:text-primary transition-all hover:-translate-y-1"><FaDiscord size={28} /></a>
                    </div>
                    <div className="text-center">
                        <p className="text-[10px] md:text-[11px] text-primary font-medium tracking-[0.8em] uppercase mb-4 opacity-70 flex items-center justify-center gap-2">
                            Knowledge is the ultimate weapon
                        </p>
                        <p className="text-[8px] md:text-[9px] text-slate-700 font-medium tracking-widest uppercase opacity-40">
                            © 2026 WIPPY ENGINE • EMERALD EDITION • GLOBAL STACK DEPLOYED
                        </p>
                    </div>
                </footer>
            </div>
        </div>
    );
}