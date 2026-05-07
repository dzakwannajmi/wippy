/**
 * Footer.jsx
 * Standalone footer component for Wippy Arena.
 * Import and replace the inline <footer> in Home.jsx with: <Footer />
 */

import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaInstagram, FaGithub, FaDiscord } from "react-icons/fa";
import {
    IoPlay,
    IoShieldCheckmarkOutline,
    IoFlashOutline,
    IoTrophyOutline,
    IoCodeSlashOutline,
    IoChevronForwardOutline,
} from "react-icons/io5";

// =============================================
// DATA — Navigation columns
// =============================================
const NAV_LINKS = [
    {
        label: "Arena",
        links: [
            { name: "Enter Battle",  href: "/entry",     icon: <IoPlay size={12} /> },
            { name: "Leaderboard",   href: "/leaderboard", icon: <IoTrophyOutline size={12} /> },
            { name: "How to Play",   href: "/#how-to-play", icon: <IoFlashOutline size={12} /> },
        ],
    },
    {
        label: "Engine",
        links: [
            { name: "React 19",      href: "https://react.dev",         icon: <IoCodeSlashOutline size={12} /> },
            { name: "Socket.io",     href: "https://socket.io",         icon: <IoFlashOutline size={12} /> },
            { name: "Source Code",   href: "https://github.com/dzakwannajmi/wippy", icon: <IoShieldCheckmarkOutline size={12} /> },
        ],
    },
];

const SOCIAL_LINKS = [
    { icon: <FaInstagram size={18} />, href: "#",           label: "Instagram" },
    { icon: <FaGithub    size={18} />, href: "https://github.com/dzakwannajmi/wippy", label: "GitHub" },
    { icon: <FaDiscord   size={18} />, href: "#",           label: "Discord"   },
];

// =============================================
// FOOTER COMPONENT
// =============================================
export default function Footer() {
    const navigate = useNavigate();

    return (
        <footer className="w-full relative overflow-hidden font-poppins">

            {/* Top divider line with glow */}
            <div className="relative h-[1px] w-full">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
            </div>

            {/* Ambient glow behind footer */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-primary/5 blur-[80px] pointer-events-none" />

            <div className="relative z-10 max-w-6xl mx-auto px-8 pt-20 pb-12">

                {/* =============================================
                    TOP SECTION — Brand + Nav + CTA
                ============================================= */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-20">

                    {/* Brand column */}
                    <div className="md:col-span-5 flex flex-col gap-6">
                        {/* Logo wordmark */}
                        <div>
                            <h2 className="text-4xl font-extralight tracking-[0.3em] text-primary uppercase">
                                WIPPY
                            </h2>
                            <p className="text-[9px] text-primary/30 tracking-[0.5em] uppercase mt-1">
                                Emerald Edition · Real-Time Arena
                            </p>
                        </div>

                        {/* Tagline */}
                        <p className="text-slate-500 text-[13px] leading-relaxed max-w-xs font-light">
                            The battlefield where knowledge becomes power. 
                            Compete in real-time quiz battles with players worldwide.
                        </p>

                        {/* CTA Button */}
                        <motion.button
                            whileHover={{
                                scale: 1.03,
                                backgroundColor: "#50C878",
                                color: "#030014",
                                boxShadow: "0 0 30px rgba(80,200,120,0.4)"
                            }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => navigate("/entry")}
                            className="self-start flex items-center gap-3 px-7 py-3 border border-primary/40 text-primary text-[10px] tracking-[0.4em] uppercase transition-all duration-200 rounded-none"
                        >
                            <IoPlay size={13} />
                            ENTER ARENA
                        </motion.button>

                        {/* Live status pill */}
                        <div className="flex items-center gap-2 self-start">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_#50C878]" />
                            <span className="text-[9px] text-primary/40 uppercase tracking-[0.4em]">
                                Servers Online
                            </span>
                        </div>
                    </div>

                    {/* Nav columns */}
                    <div className="md:col-span-4 grid grid-cols-2 gap-10">
                        {NAV_LINKS.map((col) => (
                            <div key={col.label}>
                                <p className="text-[9px] text-white/20 uppercase tracking-[0.5em] mb-6">
                                    {col.label}
                                </p>
                                <ul className="space-y-4">
                                    {col.links.map((link) => (
                                        <li key={link.name}>
                                            <a
                                                href={link.href}
                                                className="group flex items-center gap-2 text-slate-500 hover:text-primary transition-colors text-[12px] tracking-wide"
                                            >
                                                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-primary">
                                                    {link.icon}
                                                </span>
                                                {link.name}
                                                <IoChevronForwardOutline
                                                    size={10}
                                                    className="opacity-0 group-hover:opacity-60 transition-all -translate-x-1 group-hover:translate-x-0 text-primary"
                                                />
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    {/* Social column */}
                    <div className="md:col-span-3 flex flex-col gap-6">
                        <p className="text-[9px] text-white/20 uppercase tracking-[0.5em]">
                            Community
                        </p>

                        <div className="flex flex-col gap-3">
                            {SOCIAL_LINKS.map((s) => (
                                <motion.a
                                    key={s.label}
                                    href={s.href}
                                    aria-label={s.label}
                                    whileHover={{ x: 4 }}
                                    className="group flex items-center gap-4 p-3 rounded-xl border border-white/5 bg-white/[0.02] hover:border-primary/20 hover:bg-primary/5 transition-all"
                                >
                                    <span className="text-slate-500 group-hover:text-primary transition-colors">
                                        {s.icon}
                                    </span>
                                    <span className="text-[11px] text-slate-500 group-hover:text-white transition-colors uppercase tracking-widest">
                                        {s.label}
                                    </span>
                                    <IoChevronForwardOutline
                                        size={11}
                                        className="ml-auto text-slate-700 group-hover:text-primary/60 transition-colors"
                                    />
                                </motion.a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* =============================================
                    STATS BAR — Quick numbers
                ============================================= */}
                <div className="grid grid-cols-3 gap-0 mb-16 border border-white/5 rounded-2xl overflow-hidden">
                    {[
                        { value: "60+",   label: "Questions"  },
                        { value: "3",     label: "Categories" },
                        { value: "10s",   label: "Per Round"  },
                    ].map((stat, i) => (
                        <div
                            key={i}
                            className={`flex flex-col items-center justify-center py-6 bg-white/[0.02] ${
                                i < 2 ? "border-r border-white/5" : ""
                            }`}
                        >
                            <span className="text-2xl font-thin text-primary tracking-tighter">
                                {stat.value}
                            </span>
                            <span className="text-[9px] text-slate-600 uppercase tracking-[0.3em] mt-1">
                                {stat.label}
                            </span>
                        </div>
                    ))}
                </div>

                {/* =============================================
                    BOTTOM BAR — Copyright + tagline
                ============================================= */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-white/[0.04]">

                    {/* Left: copyright */}
                    <p className="text-[9px] text-slate-700 uppercase tracking-widest">
                        © 2026 Wippy Engine — All rights reserved
                    </p>

                    {/* Center: tagline */}
                    <p className="text-[9px] text-primary/30 uppercase tracking-[0.5em] font-light">
                        Knowledge is the ultimate weapon
                    </p>

                    {/* Right: version badge */}
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-white/5 bg-white/[0.02]">
                        <div className="w-1 h-1 rounded-full bg-primary/50" />
                        <span className="text-[8px] text-slate-700 uppercase tracking-[0.3em]">
                            v2.0 · Emerald Stack
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}