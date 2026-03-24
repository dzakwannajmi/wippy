import { useLocation } from 'react-router-dom';
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

    return (
        <PillNav
            logo={
                <GrCodeSandbox
                    size={28}
                    className="text-primary transition-all duration-500 hover:rotate-[360deg] hover:scale-110 drop-shadow-[0_0_8px_rgba(80,200,120,0.5)]"
                />
            }
            logoAlt="Wippy Arena"
            items={navItems}
            activeHref={location.pathname === '/arena' ? '/arena' : location.pathname + location.hash}

            baseColor="#FAFAFA"
            pillColor="#50C878"
            hoveredPillTextColor="#0B6E4F"

            initialLoadAnimation={true}
            ease="expo.out"
        />
    );
}