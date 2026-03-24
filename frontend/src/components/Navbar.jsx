import { useLocation } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import PillNav from './ui/PillNav';
import { GrCodeSandbox } from "react-icons/gr";

export default function Navbar() {
    const location = useLocation();

    const navItems = [
        { label: 'ARENA', href: '/entry' },
        { label: 'FEATURES', href: '/#features' },
        { label: 'TECH', href: '/#showcase' },
        { label: 'ROADMAP', href: '/#roadmap' },
    ];

    const formattedItems = navItems.map(item => ({
        ...item,
        label: (
            <HashLink
                smooth
                to={item.href}
                className="w-full h-full flex items-center justify-center no-underline text-inherit"
            >
                {item.label}
            </HashLink>
        )
    }));

    return (
        <PillNav
            logo={
                <GrCodeSandbox
                    size={28}
                    className="text-primary transition-all duration-500 hover:rotate-[360deg] hover:scale-110 drop-shadow-[0_0_8px_rgba(80,200,120,0.5)]"
                />
            }
            logoAlt="Wippy Arena"
            items={formattedItems}
            activeHref={location.pathname + location.hash}
            baseColor="#FAFAFA"
            pillColor="#50C878"
            hoveredPillTextColor="#0B6E4F"
            initialLoadAnimation={true}
            ease="expo.out"
        />
    );
}