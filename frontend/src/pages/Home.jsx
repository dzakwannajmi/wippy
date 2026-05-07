import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import PixelBlast from "../components/PixelBlast";
import CardSwap, { Card } from "../components/ui/CardSwap";
import LogoLoop from "../components/LogoLoop";
import MagicBento from "../components/MagicBento";
import ScrollFloat from "../components/ScrollFloat";
import Footer from "../components/Footer";

// --- REACT ICONS ---
import {
    IoPlay, IoCheckmarkCircleOutline, IoSettingsOutline, IoSparklesOutline,
    IoTrophyOutline, IoMicOutline, IoMapOutline,
    IoPersonAddOutline, IoGameControllerOutline, IoRocketOutline,
    IoShieldCheckmarkOutline, IoTimerOutline, IoStarOutline,
    IoChevronForwardOutline,
} from "react-icons/io5";
import { FaInstagram, FaGithub, FaDiscord, FaNodeJs } from "react-icons/fa";
import { SiReact, SiNextdotjs, SiJavascript, SiTailwindcss, SiVite, SiSocketdotio } from 'react-icons/si';

export default function Home() {
    const navigate = useNavigate();

    // =============================================
    // ANIMATION VARIANTS — Used for scroll-triggered sections
    // =============================================
    const sectionVariants = {
        hidden:  { opacity: 0, y: 30, filter: "blur(10px)" },
        visible: {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            transition: { duration: 1, ease: [0.22, 1, 0.36, 1] }
        }
    };

    const cardVariants = {
        hidden:  { opacity: 0, y: 20 },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            transition: { delay: i * 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }
        })
    };

    // =============================================
    // TECH STACK LOGOS — Used in LogoLoop marquee
    // =============================================
    const techLogos = [
        { node: <SiReact      size={35} className="text-primary"     />, title: "React"      },
        { node: <SiNextdotjs  size={35} className="text-primary/30"  />, title: "Next.js"    },
        { node: <SiJavascript size={35} className="text-primary"     />, title: "JavaScript" },
        { node: <SiTailwindcss size={35} className="text-primary/30" />, title: "Tailwind"   },
        { node: <SiVite       size={35} className="text-primary"     />, title: "Vite"       },
        { node: <SiSocketdotio size={35} className="text-primary/30" />, title: "Socket.io"  },
        { node: <FaNodeJs     size={35} className="text-primary/30"  />, title: "Node.js"    },
    ];

    // =============================================
    // HOW TO PLAY STEPS — Tutorial section data
    // =============================================
    const howToPlaySteps = [
        {
            step:        "01",
            icon:        <IoPersonAddOutline size={28} />,
            title:       "Create or Join Arena",
            description: "Enter your nickname and create a new room as Host, or join an existing room using a Room ID and password from your friend.",
            color:       "text-primary",
            border:      "border-primary/20",
            bg:          "bg-primary/5",
        },
        {
            step:        "02",
            icon:        <IoGameControllerOutline size={28} />,
            title:       "Select Category",
            description: "Host picks the quiz category — PHP, JavaScript, or React. Each category has 20 shuffled questions so every game feels fresh.",
            color:       "text-blue-400",
            border:      "border-blue-400/20",
            bg:          "bg-blue-400/5",
        },
        {
            step:        "03",
            icon:        <IoTimerOutline size={28} />,
            title:       "Answer Fast & Score High",
            description: "You have 10 seconds per question. Answer correctly and quickly to earn bonus points. The faster you answer, the higher your score!",
            color:       "text-yellow-400",
            border:      "border-yellow-400/20",
            bg:          "bg-yellow-400/5",
        },
        {
            step:        "04",
            icon:        <IoTrophyOutline size={28} />,
            title:       "Claim the Podium",
            description: "After all questions are done, the podium reveals the top 3 legends. Your score and accuracy are saved to the Global Hall of Fame.",
            color:       "text-orange-400",
            border:      "border-orange-400/20",
            bg:          "bg-orange-400/5",
        },
    ];

    // =============================================
    // GAME RULES — Quick reference cards
    // =============================================
    const gameRules = [
        {
            icon:  <IoTimerOutline size={20} />,
            title: "10s Per Question",
            desc:  "Each question has a 10-second countdown timer synced across all players.",
            color: "text-red-400",
        },
        {
            icon:  <IoStarOutline size={20} />,
            title: "Speed Bonus",
            desc:  "Base 100 pts + time bonus. Answer in 1s = 190 pts. Answer in 9s = 110 pts.",
            color: "text-yellow-400",
        },
        {
            icon:  <IoShieldCheckmarkOutline size={20} />,
            title: "Server Validated",
            desc:  "All answers and scores are validated server-side. No cheating possible.",
            color: "text-primary",
        },
        {
            icon:  <IoRocketOutline size={20} />,
            title: "Real-Time Battle",
            desc:  "All players in the same room compete simultaneously with live scoreboard.",
            color: "text-blue-400",
        },
    ];

    return (
        <div className="relative w-full min-h-screen bg-dark-abyss overflow-x-hidden font-poppins text-font-main">

            {/* =============================================
                BACKGROUND — Fixed pixel animation layer
            ============================================= */}
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
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(80,200,120,0.1),transparent_70%)]" />
            </div>

            <div className="relative z-10 flex flex-col items-center">

                {/* =============================================
                    HERO SECTION — Main landing screen
                ============================================= */}
                <motion.section
                    id="hero"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={sectionVariants}
                    className="min-h-[100vh] flex flex-col items-center justify-center text-center px-6 relative"
                >
                    {/* Live indicator badge */}
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 mb-10"
                    >
                        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_#50C878]" />
                        <span className="text-[9px] text-primary/70 uppercase tracking-[0.4em] font-medium">
                            Real-Time Quiz Battle · Live
                        </span>
                    </motion.div>

                    {/* Main headline */}
                    <div className="mb-12 flex flex-col items-center">
                        <h1 className="text-5xl md:text-[6rem] font-thin text-white leading-tight tracking-[0.1em] uppercase">
                            It's dangerous <br />
                            <span className="text-white/30 italic">to go alone</span>
                        </h1>
                        <h2 className="text-5xl md:text-8xl font-extralight tracking-[0.25em] text-primary mt-2">
                            TAKE WIPPY.
                        </h2>
                    </div>

                    {/* Subtitle */}
                    <p className="max-w-md text-slate-500 text-[10px] md:text-xs mb-10 font-light leading-relaxed tracking-[0.2em] uppercase opacity-70">
                        Enter the arena. <br />
                        Connect and dominate the real-time battlefield.
                    </p>

                    {/* Quick stats */}
                    <div className="flex items-center gap-8 mb-12 opacity-50">
                        <div className="text-center">
                            <p className="text-xl font-thin text-white tracking-tighter">3</p>
                            <p className="text-[8px] text-slate-500 uppercase tracking-widest">Categories</p>
                        </div>
                        <div className="w-[1px] h-8 bg-white/10" />
                        <div className="text-center">
                            <p className="text-xl font-thin text-white tracking-tighter">60</p>
                            <p className="text-[8px] text-slate-500 uppercase tracking-widest">Questions</p>
                        </div>
                        <div className="w-[1px] h-8 bg-white/10" />
                        <div className="text-center">
                            <p className="text-xl font-thin text-white tracking-tighter">10s</p>
                            <p className="text-[8px] text-slate-500 uppercase tracking-widest">Per Question</p>
                        </div>
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row items-center gap-4">
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

                        {/* Scroll hint to tutorial */}
                        <a
                            href="#how-to-play"
                            className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors text-[10px] uppercase tracking-[0.3em]"
                        >
                            How to play
                            <IoChevronForwardOutline size={12} />
                        </a>
                    </div>
                </motion.section>

                {/* =============================================
                    HOW TO PLAY SECTION — Step-by-step tutorial
                ============================================= */}
                <motion.section
                    id="how-to-play"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ amount: 0.2 }}
                    variants={sectionVariants}
                    className="w-full max-w-6xl px-6 py-24"
                >
                    {/* Section header */}
                    <div className="text-center mb-16">
                        <p className="text-[9px] text-primary/50 tracking-[0.6em] uppercase mb-4">
                            Mission Briefing
                        </p>
                        <h2 className="text-4xl md:text-5xl font-thin tracking-tighter uppercase text-white">
                            How to <span className="text-primary italic">Play</span>
                        </h2>
                        <div className="h-[1px] w-24 bg-primary/30 mx-auto mt-6" />
                    </div>

                    {/* Step cards grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
                        {howToPlaySteps.map((item, i) => (
                            <motion.div
                                key={i}
                                custom={i}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={cardVariants}
                                className={`relative p-8 rounded-[2rem] border ${item.border} ${item.bg} backdrop-blur-sm overflow-hidden group hover:border-opacity-40 transition-all duration-500`}
                            >
                                {/* Step number — decorative background */}
                                <span className="absolute top-6 right-8 text-[4rem] font-black text-white/[0.03] leading-none select-none">
                                    {item.step}
                                </span>

                                {/* Icon */}
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border ${item.border} bg-white/5 ${item.color}`}>
                                    {item.icon}
                                </div>

                                {/* Step label */}
                                <p className={`text-[9px] uppercase tracking-[0.4em] mb-2 ${item.color} opacity-60`}>
                                    Step {item.step}
                                </p>

                                {/* Title */}
                                <h3 className="text-lg font-medium text-white tracking-tight mb-3">
                                    {item.title}
                                </h3>

                                {/* Description */}
                                <p className="text-[13px] text-slate-400 leading-relaxed font-light">
                                    {item.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Game Rules — Quick reference */}
                    <div className="border border-white/5 rounded-[2rem] p-8 bg-white/[0.02]">
                        <p className="text-[9px] text-slate-500 uppercase tracking-[0.5em] mb-8 text-center">
                            Game Rules
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                            {gameRules.map((rule, i) => (
                                <motion.div
                                    key={i}
                                    custom={i}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true }}
                                    variants={cardVariants}
                                    className="text-center"
                                >
                                    {/* Rule icon */}
                                    <div className={`w-10 h-10 rounded-xl mx-auto mb-4 flex items-center justify-center bg-white/5 border border-white/5 ${rule.color}`}>
                                        {rule.icon}
                                    </div>

                                    {/* Rule title */}
                                    <p className={`text-[11px] font-medium uppercase tracking-wider mb-2 ${rule.color}`}>
                                        {rule.title}
                                    </p>

                                    {/* Rule description */}
                                    <p className="text-[11px] text-slate-500 leading-relaxed font-light">
                                        {rule.desc}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* CTA below tutorial */}
                    <div className="text-center mt-12">
                        <motion.button
                            whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(80,200,120,0.3)" }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate("/entry")}
                            className="inline-flex items-center gap-3 px-10 py-4 bg-primary text-dark-abyss font-medium text-[11px] tracking-[0.4em] uppercase rounded-none transition-all"
                        >
                            <IoRocketOutline size={16} />
                            Start Playing Now
                        </motion.button>
                    </div>
                </motion.section>

                {/* =============================================
                    FEATURES SECTION — Magic Bento grid
                ============================================= */}
                <motion.section
                    id="features"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ amount: 0.2 }}
                    variants={sectionVariants}
                    className="w-full flex flex-col items-center py-24 px-6"
                >
                    {/* Section header with scroll float animation */}
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
                        <div className="h-[1px] w-24 bg-primary/50 mx-auto -mt-4" />
                    </div>

                    {/* Bento grid with interactive cards */}
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

                {/* =============================================
                    TECH SHOWCASE — Card stack animation
                ============================================= */}
                <motion.section
                    id="showcase"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ amount: 0.3 }}
                    variants={sectionVariants}
                    className="w-full flex justify-center px-6 py-24"
                >
                    <div className="w-full max-w-6xl border-[1px] border-white/20 rounded-[3rem] bg-white/[0.02] backdrop-blur-sm p-12 md:p-20 flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden group hover:border-white/40 transition-colors duration-700">

                        {/* Decorative glow */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] -z-10" />

                        {/* Left: text content */}
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

                        {/* Right: animated card stack */}
                        <div className="flex-1 relative w-full h-[300px] flex items-center justify-center perspective-[1200px] overflow-visible translate-y-24 md:translate-y-50">
                            <CardSwap width={400} height={500} delay={5000} skewAmount={12} cardDistance={65} verticalDistance={75}>
                                <Card className="flex flex-col items-start justify-start p-8 border-white/60 bg-black shadow-2xl rounded-[2rem]">
                                    <div className="flex items-center gap-2 text-white/90">
                                        <IoCheckmarkCircleOutline size={20} className="text-primary" />
                                        <h4 className="font-medium text-lg uppercase tracking-widest">Reliable</h4>
                                    </div>
                                </Card>
                                <Card className="flex flex-col items-start justify-start p-8 border-white/60 bg-black shadow-2xl rounded-[2rem]">
                                    <div className="flex items-center gap-2 text-white/90">
                                        <IoSettingsOutline size={20} className="text-primary" />
                                        <h4 className="font-medium text-lg uppercase tracking-widest">Customizable</h4>
                                    </div>
                                </Card>
                                <Card className="flex flex-col items-start justify-start p-8 border-white/60 bg-black shadow-2xl rounded-[2rem]">
                                    <div className="flex items-center gap-2 text-white/90">
                                        <IoSparklesOutline size={20} className="text-primary" />
                                        <h4 className="font-medium text-lg uppercase tracking-widest">Smooth</h4>
                                    </div>
                                </Card>
                            </CardSwap>
                        </div>
                    </div>
                </motion.section>

                {/* =============================================
                    ROADMAP SECTION — Future development plans
                ============================================= */}
                <motion.section
                    id="roadmap"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ amount: 0.3 }}
                    variants={sectionVariants}
                    className="w-full max-w-4xl px-8 py-24"
                >
                    {/* Section header */}
                    <div className="flex flex-col items-center mb-16 text-center">
                        <h2 className="text-4xl md:text-5xl font-bold tracking-tighter uppercase">
                            Mission <span className="text-primary">Roadmap</span>
                        </h2>
                        <p className="text-[10px] text-primary/60 tracking-[0.4em] uppercase mt-2">
                            Quest Log & Expansion Data
                        </p>
                        <div className="h-1 w-24 bg-primary mt-4 rounded-full shadow-[0_0_10px_#50C878]" />
                    </div>

                    {/* Roadmap items */}
                    <div className="space-y-8">
                        {[
                            {
                                phase:    "LEVEL 01",
                                task:     "Global Ranking & Competitive MMR",
                                status:   "QUEST ACTIVE",
                                progress: 100,
                                reward:   "Emerald Badge",
                                icon:     <IoTrophyOutline size={22} />
                            },
                            {
                                phase:    "LEVEL 02",
                                task:     "Voice Chat Integration",
                                status:   "SOON",
                                progress: 0,
                                reward:   "Comms Hub",
                                icon:     <IoMicOutline size={22} />
                            },
                            {
                                phase:    "LEVEL 03",
                                task:     "Custom Arena Builder",
                                status:   "LOCKED",
                                progress: 0,
                                reward:   "Architect Title",
                                icon:     <IoMapOutline size={22} />
                            },
                        ].map((item, i) => (
                            <div
                                key={i}
                                className="relative flex flex-col p-8 rounded-[2rem] shadow-2xl overflow-hidden border border-white/5 bg-white/[0.02] backdrop-blur-md"
                            >
                                <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-6">

                                    {/* Phase icon */}
                                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-[0_0_15px_rgba(80,200,120,0.2)]">
                                        {item.icon}
                                    </div>

                                    {/* Phase info */}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-1">
                                            <span className="text-[10px] font-bold text-primary tracking-[0.2em]">
                                                {item.phase}
                                            </span>
                                            <span className="text-[8px] font-bold px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white/40 uppercase">
                                                Reward: {item.reward}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-semibold text-white/90 italic tracking-tight uppercase">
                                            {item.task}
                                        </h3>
                                    </div>

                                    {/* Status badge */}
                                    <span className={`text-[9px] font-bold px-4 py-1.5 rounded-lg border tracking-widest ${item.status === 'QUEST ACTIVE'
                                        ? 'text-primary border-primary animate-pulse'
                                        : 'text-slate-600 border-slate-800'
                                    }`}>
                                        {item.status}
                                    </span>
                                </div>

                                {/* Progress bar */}
                                <div className="w-full space-y-2">
                                    <div className="flex justify-between items-end">
                                        <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest">Progress</span>
                                        <span className="text-[10px] font-mono text-primary">{item.progress}%</span>
                                    </div>
                                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            whileInView={{ width: `${item.progress}%` }}
                                            transition={{ duration: 1.5 }}
                                            className="h-full bg-primary shadow-[0_0_10px_#50C878]"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.section>

                {/* =============================================
                    TECH STACK LOOP — Infinite marquee
                ============================================= */}
                <section className="w-full py-16">
                    <div className="text-center mb-10">
                        <p className="text-[10px] font-semibold text-primary tracking-[0.5em] uppercase drop-shadow-[0_0_8px_rgba(80,200,120,0.3)]">
                            Built with Premium Stack
                        </p>
                    </div>
                    <div className="w-full h-[80px] relative overflow-hidden flex items-center">
                        <LogoLoop
                            logos={techLogos}
                            speed={120}
                            logoHeight={35}
                            gap={70}
                            fadeOut={true}
                            fadeOutColor="#030014"
                        />
                    </div>
                </section>

            </div>
        </div>
    );
}