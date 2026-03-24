import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import PixelBlast from "../components/PixelBlast";
import CardSwap, { Card } from "../components/ui/CardSwap";
import LogoLoop from "../components/LogoLoop";
import MagicBento from "../components/MagicBento";
import ScrollFloat from "../components/ScrollFloat";

// --- REACT ICONS ---
import {
    IoFlash, IoTimerOutline, IoCodeSlash,
    IoDesktopOutline, IoTrophyOutline, IoMicOutline, IoMapOutline,
    IoPlay, IoCheckmarkCircleOutline, IoSettingsOutline, IoSparklesOutline
} from "react-icons/io5";
import { FaInstagram, FaGithub, FaDiscord, FaNodeJs } from "react-icons/fa";
import { SiReact, SiNextdotjs, SiJavascript, SiTailwindcss, SiVite, SiSocketdotio } from 'react-icons/si';

export default function Home() {
    const navigate = useNavigate();

    // --- ANIMATION VARIANTS ---
    const sectionVariants = {
        hidden: { opacity: 0, y: 30, filter: "blur(10px)" },
        visible: { 
            opacity: 1, 
            y: 0, 
            filter: "blur(0px)",
            transition: { duration: 1, ease: [0.22, 1, 0.36, 1] } 
        }
    };

    // --- TECH STACK LOGOS ---
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

            <div className="relative z-10 flex flex-col items-center">

                {/* --- 2. HERO SECTION (MINIMALIST) --- */}
                <motion.section 
                    id="hero"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={sectionVariants}
                    className="min-h-[100vh] flex flex-col items-center justify-center text-center px-6 relative"
                >
                    <div className="mb-12 flex flex-col items-center">
                        <h1 className="text-5xl md:text-[6rem] font-thin text-white leading-tight tracking-[0.1em] uppercase">
                            It's dangerous <br />
                            <span className="text-white/30 italic">to go alone</span>
                        </h1>
                        <h2 className="text-5xl md:text-8xl font-extralight tracking-[0.25em] text-primary mt-2">
                            TAKE WIPPY.
                        </h2>
                    </div>

                    <p className="max-w-md text-slate-500 text-[10px] md:text-xs mb-16 font-light leading-relaxed tracking-[0.2em] uppercase opacity-70">
                        Enter the arena. <br />
                        Connect and dominate the real-time battlefield.
                    </p>

                    <motion.button
                        whileHover={{
                            scale: 1.05,
                            backgroundColor: "#50C878",
                            color: "#030014",
                            boxShadow: "0 0 40px rgba(80,200,120,0.5)"
                        }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate("/entry")}
                        className="flex items-center gap-4 px-12 py-5 border border-primary text-primary rounded-none font-light text-[11px] tracking-[0.6em] transition-all duration-150 ease-out uppercase"
                    >
                        <IoPlay size={16} />
                        INITIALIZE
                    </motion.button>
                </motion.section>

                {/* --- 3. FEATURES SECTION (MAGIC BENTO) --- */}
                <motion.section 
                    id="features"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ amount: 0.2 }}
                    variants={sectionVariants}
                    className="w-full flex flex-col items-center py-32 px-6"
                >
                    <div className="text-center mb-16">
                        <ScrollFloat
                            animationDuration={1}
                            ease='back.out(2)'
                            scrollStart='center bottom+=30%'
                            scrollEnd='bottom center'
                            stagger={0.05}
                            textClassName="font-thin tracking-[0.3em] text-white uppercase"
                        >
                            MISSION CAPABILITIES
                        </ScrollFloat>
                        <div className="h-[1px] w-24 bg-primary/50 mx-auto -mt-4"></div>
                    </div>

                    <div className="w-full flex justify-center">
                        <MagicBento
                            textAutoHide={true}
                            enableStars={true}
                            enableSpotlight={true}
                            enableBorderGlow={true}
                            enableTilt={true}
                            enableMagnetism={true}
                            clickEffect={true}
                            spotlightRadius={500}
                            particleCount={15}
                            glowColor="80, 200, 120"
                            disableAnimations={false}
                        />
                    </div>
                </motion.section>

                {/* --- 4. TECH SHOWCASE (ORIGINAL LAYOUT) --- */}
                <motion.section 
                    id="showcase"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ amount: 0.3 }}
                    variants={sectionVariants}
                    className="w-full flex justify-center px-6 py-24"
                >
                    <div className="w-full max-w-6xl border-[1px] border-white/20 rounded-[3rem] bg-white/[0.02] backdrop-blur-sm p-12 md:p-20 flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden group hover:border-white/40 transition-colors duration-700">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] -z-10"></div>

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

                        <div className="flex-1 relative w-full h-[300px] flex items-center justify-center perspective-[1200px] overflow-visible translate-y-24 md:translate-y-50">
                            <CardSwap width={400} height={500} delay={5000} skewAmount={12} cardDistance={65} verticalDistance={75}>
                                <Card className="flex flex-col items-start justify-start p-8 border-white/60 bg-black shadow-2xl rounded-[2rem]">
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-2 text-white/90">
                                            <IoCheckmarkCircleOutline size={20} className="text-primary" />
                                            <h4 className="font-medium text-lg uppercase tracking-widest">Reliable</h4>
                                        </div>
                                    </div>
                                </Card>
                                <Card className="flex flex-col items-start justify-start p-8 border-white/60 bg-black shadow-2xl rounded-[2rem]">
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-2 text-white/90">
                                            <IoSettingsOutline size={20} className="text-primary" />
                                            <h4 className="font-medium text-lg uppercase tracking-widest">Customizable</h4>
                                        </div>
                                    </div>
                                </Card>
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
                </motion.section>

                {/* --- 5. FUTURE ROADMAP (ORIGINAL LAYOUT) --- */}
                <motion.section 
                    id="roadmap"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ amount: 0.3 }}
                    variants={sectionVariants}
                    className="w-full max-w-4xl px-8 py-24 "
                >
                    <div className="flex flex-col items-center mb-16 text-center " >
                        <h2 className="text-4xl md:text-5xl font-bold tracking-tighter uppercase">
                            Mission <span className="text-primary">Roadmap</span>
                        </h2>
                        <p className="text-[10px] text-primary/60 tracking-[0.4em] uppercase mt-2">Quest Log & Expansion Data</p>
                        <div className="h-1 w-24 bg-primary mt-4 rounded-full shadow-[0_0_10px_#50C878]"></div>
                    </div>

                    <div className="space-y-8 ">
                        {[
                            { phase: "LEVEL 01", task: "Global Ranking & Competitive MMR", status: "QUEST ACTIVE", progress: 100, reward: "Emerald Badge", icon: <IoTrophyOutline size={22} /> },
                            { phase: "LEVEL 02", task: "Voice Chat Integration", status: "SOON", progress: 0, reward: "Comms Hub", icon: <IoMicOutline size={22} /> },
                            { phase: "LEVEL 03", task: "Custom Arena Builder", status: "LOCKED", progress: 0, reward: "Architect Title", icon: <IoMapOutline size={22} /> },
                        ].map((item, i) => (
                            <div key={i} className="relative flex flex-col p-8 rounded-[2rem] shadow-2xl overflow-hidden border border-white/5 bg-white/[0.02] backdrop-blur-md ">
                                <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-6">
                                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-[0_0_15px_rgba(80,200,120,0.2)]">
                                        {item.icon}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-1">
                                            <span className="text-[10px] font-bold text-primary tracking-[0.2em]">{item.phase}</span>
                                            <span className="text-[8px] font-bold px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white/40 uppercase">Reward: {item.reward}</span>
                                        </div>
                                        <h3 className="text-xl font-semibold text-white/90 italic tracking-tight uppercase">{item.task}</h3>
                                    </div>
                                    <span className={`text-[9px] font-bold px-4 py-1.5 rounded-lg border tracking-widest ${item.status === 'QUEST ACTIVE' ? 'text-primary border-primary animate-pulse' : 'text-slate-600 border-slate-800'}`}>
                                        {item.status}
                                    </span>
                                </div>
                                <div className="w-full space-y-2">
                                    <div className="flex justify-between items-end">
                                        <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest">Progress</span>
                                        <span className="text-[10px] font-mono text-primary">{item.progress}%</span>
                                    </div>
                                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                        <motion.div initial={{ width: 0 }} whileInView={{ width: `${item.progress}%` }} transition={{ duration: 1.5 }} className="h-full bg-primary shadow-[0_0_10px_#50C878]" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.section>

                {/* --- 6. TECH STACK LOOP (ORIGINAL) --- */}
                <section className="w-full py-16" >
                    <div className="text-center mb-10">
                        <p className="text-[10px] font-semibold text-primary tracking-[0.5em] uppercase drop-shadow-[0_0_8px_rgba(80,200,120,0.3)]">
                            Built with Premium Stack
                        </p>
                    </div>
                    <div className="w-full h-[80px] relative overflow-hidden flex items-center">
                        <LogoLoop logos={techLogos} speed={120} logoHeight={35} gap={70} fadeOut={true} fadeOutColor="#030014" />
                    </div>
                </section>

                {/* --- 7. FOOTER (ORIGINAL) --- */}
                <footer className="w-full border-t border-white/5 bg-black/40 backdrop-blur-2xl pt-20 pb-12 px-8 flex flex-col items-center">
                    <div className="flex gap-12 mb-10">
                        <a href="#" className="text-slate-500 hover:text-primary transition-all hover:-translate-y-1"><FaInstagram size={28} /></a>
                        <a href="https://github.com/dzakwannajmi/wippy" className="text-slate-500 hover:text-primary transition-all hover:-translate-y-1"><FaGithub size={28} /></a>
                        <a href="#" className="text-slate-500 hover:text-primary transition-all hover:-translate-y-1"><FaDiscord size={28} /></a>
                    </div>
                    <div className="text-center">
                        <p className="text-[10px] text-primary font-medium tracking-[0.8em] uppercase mb-4 opacity-70">Knowledge is the ultimate weapon</p>
                        <p className="text-[8px] text-slate-700 font-medium tracking-widest uppercase opacity-40">© 2026 WIPPY ENGINE • EMERALD EDITION • GLOBAL STACK DEPLOYED</p>
                    </div>
                </footer>
            </div>
        </div>
    );
}