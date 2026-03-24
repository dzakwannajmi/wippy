import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';

const PillNav = ({
    logo,
    logoAlt = 'Logo',
    items,
    ease = 'expo.out',
    baseColor = '#94a3b8',
    pillColor = '#a855f7',
    hoveredPillTextColor = '#ffffff',
    initialLoadAnimation = true
}) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();

    const circleRefs = useRef([]);
    const tlRefs = useRef([]);
    const activeTweenRefs = useRef([]);
    const logoImgRef = useRef(null);
    const logoTweenRef = useRef(null);
    const hamburgerRef = useRef(null);
    const mobileMenuRef = useRef(null);
    const navItemsRef = useRef(null);
    const logoRef = useRef(null);

    const activeHref = location.pathname;

    useEffect(() => {
        const layout = () => {
            circleRefs.current.forEach(circle => {
                if (!circle?.parentElement) return;

                const pill = circle.parentElement;
                const rect = pill.getBoundingClientRect();
                const { width: w, height: h } = rect;
                const R = ((w * w) / 4 + h * h) / (2 * h);
                const D = Math.ceil(2 * R) + 2;
                const delta = Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1;
                const originY = D - delta;

                circle.style.width = `${D}px`;
                circle.style.height = `${D}px`;
                circle.style.bottom = `-${delta}px`;

                gsap.set(circle, {
                    xPercent: -50,
                    scale: 0,
                    transformOrigin: `50% ${originY}px`
                });

                const label = pill.querySelector('.pill-label');
                const white = pill.querySelector('.pill-label-hover');

                if (label) gsap.set(label, { y: 0 });
                if (white) gsap.set(white, { y: h + 12, opacity: 0 });

                const index = circleRefs.current.indexOf(circle);
                if (index === -1) return;

                tlRefs.current[index]?.kill();
                const tl = gsap.timeline({ paused: true });

                tl.to(circle, { scale: 1.2, xPercent: -50, duration: 2, ease, overwrite: 'auto' }, 0);

                if (label) {
                    tl.to(label, { y: -(h + 8), duration: 2, ease, overwrite: 'auto' }, 0);
                }

                if (white) {
                    gsap.set(white, { y: Math.ceil(h + 100), opacity: 0 });
                    tl.to(white, { y: 0, opacity: 1, duration: 2, ease, overwrite: 'auto' }, 0);
                }

                tlRefs.current[index] = tl;
            });
        };

        layout();
        const onResize = () => layout();
        window.addEventListener('resize', onResize);

        if (document.fonts?.ready) {
            document.fonts.ready.then(layout).catch(() => { });
        }

        const menu = mobileMenuRef.current;
        if (menu) {
            gsap.set(menu, { visibility: 'hidden', opacity: 0 });
        }

        if (initialLoadAnimation) {
            const logoEl = logoRef.current;
            const navItemsEl = navItemsRef.current;

            if (logoEl) {
                gsap.set(logoEl, { scale: 0 });
                gsap.to(logoEl, { scale: 1, duration: 0.6, delay: 0.2, ease });
            }

            if (navItemsEl) {
                gsap.set(navItemsEl, { opacity: 0, y: -20 });
                gsap.to(navItemsEl, { opacity: 1, y: 0, duration: 0.6, delay: 0.4, ease });
            }
        }

        return () => window.removeEventListener('resize', onResize);
    }, [items, ease, initialLoadAnimation]);

    const handleEnter = i => {
        const tl = tlRefs.current[i];
        if (!tl) return;
        activeTweenRefs.current[i]?.kill();
        activeTweenRefs.current[i] = tl.tweenTo(tl.duration(), {
            duration: 0.6,
            ease: "power3.out",
            overwrite: 'auto'
        });
    };

    const handleLeave = i => {
        const tl = tlRefs.current[i];
        if (!tl) return;
        activeTweenRefs.current[i]?.kill();
        activeTweenRefs.current[i] = tl.tweenTo(0, {
            duration: 0.4,
            ease: "power2.inOut",
            overwrite: 'auto'
        });
    };

    const handleLogoEnter = () => {
        const img = logoImgRef.current;
        if (!img) return;
        logoTweenRef.current?.kill();
        logoTweenRef.current = gsap.to(img, {
            scale: 1.1,
            duration: 0.4,
            ease,
            yoyo: true,
            repeat: 1
        });
    };

    const toggleMobileMenu = () => {
        const newState = !isMobileMenuOpen;
        setIsMobileMenuOpen(newState);
        const menu = mobileMenuRef.current;

        if (menu) {
            if (newState) {
                gsap.set(menu, { visibility: 'visible' });
                gsap.fromTo(menu, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.3, ease });
            } else {
                gsap.to(menu, { opacity: 0, y: 10, duration: 0.2, ease, onComplete: () => gsap.set(menu, { visibility: 'hidden' }) });
            }
        }
    };

    const cssVars = {
        ['--pill-bg']: pillColor,
        ['--text-base']: baseColor,
        ['--text-hover']: hoveredPillTextColor,
        ['--nav-h']: '48px',
    };

    const basePillClasses = 'relative overflow-hidden inline-flex items-center justify-center h-full no-underline rounded-full box-border font-light text-xs uppercase tracking-widest whitespace-nowrap cursor-pointer px-6 transition-colors duration-300';

    const NavItemContent = ({ label, i, isActive }) => (
        <>
            <span
                className="hover-circle absolute left-1/2 bottom-0 rounded-full z-[1] block pointer-events-none shadow-[0_0_20px_#a855f7]"
                style={{
                    background: 'var(--pill-bg)',
                    willChange: 'transform'
                }}
                aria-hidden="true"
                ref={el => { circleRefs.current[i] = el; }}
            />
            <span className="label-stack relative inline-block z-[2]">
                <span
                    className="pill-label relative z-[2] inline-block"
                    style={{ willChange: 'transform' }}
                >
                    {label}
                </span>
                <span
                    className="pill-label-hover absolute left-0 top-0 z-[3] inline-block"
                    style={{
                        color: 'var(--text-hover)',
                        willChange: 'transform, opacity'
                    }}
                    aria-hidden="true"
                >
                    {label}
                </span>
            </span>
            {isActive && (
                <motion.span
                    layoutId="activeIndicator"
                    className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full z-[4] shadow-[0_0_10px_#a855f7]"
                    style={{ background: 'var(--pill-bg)' }}
                />
            )}
        </>
    );

    return (
        <div className="fixed top-6 z-[1000] w-full flex justify-center px-4" style={cssVars}>
            <nav
                className="w-full md:w-max flex items-center justify-between md:justify-start box-border p-1 rounded-full group"
                aria-label="Primary"
                style={{
                    background: 'rgba(3, 0, 20, 0.5)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                }}
            >
                <Link
                    to="/"
                    onMouseEnter={handleLogoEnter}
                    ref={logoRef}
                    className="rounded-full inline-flex items-center justify-center overflow-hidden mr-2 p-2 bg-black/10 hover:bg-black/30 transition-colors"
                    style={{ width: 'var(--nav-h)', height: 'var(--nav-h)' }}
                >
                    {logo}
                </Link>

                <div ref={navItemsRef} className="items-center rounded-full hidden md:flex h-full">
                    <ul role="menubar" className="list-none flex items-stretch m-0 p-0 h-full gap-1">
                        {items.map((item, i) => {
                            const isActive = activeHref === item.href;
                            const pillStyle = {
                                background: 'transparent',
                                color: isActive ? 'var(--text-hover)' : 'var(--text-base)',
                            };

                            return (
                                <li key={item.href} role="none" className="flex h-full">
                                    <Link
                                        role="menuitem"
                                        to={item.href}
                                        className={`${basePillClasses}`}
                                        style={pillStyle}
                                        onMouseEnter={() => handleEnter(i)}
                                        onMouseLeave={() => handleLeave(i)}
                                    >
                                        <NavItemContent label={item.label} i={i} isActive={isActive} />
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>

                <button
                    ref={hamburgerRef}
                    onClick={toggleMobileMenu}
                    className="md:hidden rounded-full border-0 flex flex-col items-center justify-center gap-1 cursor-pointer p-0 bg-black/20"
                    style={{ width: 'var(--nav-h)', height: 'var(--nav-h)' }}
                >
                    <span className="w-4 h-0.5 rounded transition-all bg-white" />
                    <span className="w-4 h-0.5 rounded transition-all bg-white" />
                </button>
            </nav>

            <div
                ref={mobileMenuRef}
                className="md:hidden absolute top-[4em] left-4 right-4 rounded-3xl z-[998] origin-top border border-white/10"
                style={{
                    background: 'rgba(3, 0, 20, 0.9)',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 0 30px rgba(168, 85, 247, 0.2)'
                }}
            >
                <ul className="list-none m-0 p-2 flex flex-col gap-1">
                    {items.map(item => (
                        <li key={item.href}>
                            <Link
                                to={item.href}
                                className="block py-4 px-6 text-sm font-light rounded-2xl transition-all text-slate-300 hover:bg-blue-600/10 hover:text-white"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {item.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default PillNav;