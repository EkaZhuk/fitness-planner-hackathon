import React from 'react';
import { motion } from 'motion/react';
import { Dumbbell, Calendar, MessageSquare, User } from 'lucide-react';
import { ScreenType } from '../../types';

interface NavBarProps {
    active: ScreenType;
    onChange: (s: ScreenType) => void;
}

export const NavBar: React.FC<NavBarProps> = ({ active, onChange }) => {
    const items = [
        { id: 'run', label: 'БЕГ', icon: Dumbbell },
        { id: 'schedule', label: 'РАСПИСАНИЕ', icon: Calendar },
        { id: 'coach', label: 'AI ТРЕНЕР', icon: MessageSquare },
        { id: 'profile', label: 'ПРОФИЛЬ', icon: User },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-surface-lvl1 border-t border-surface-border px-6 py-4 flex justify-between items-center z-50">
            {items.map(({ id, label, icon: Icon }) => (
                <button
                    key={id}
                    onClick={() => onChange(id as ScreenType)}
                    className={`flex flex-col items-center gap-1 transition-colors ${
                        active === id ? 'text-primary' : 'text-white/40'
                    }`}
                >
                    <Icon size={24} strokeWidth={active === id ? 2.5 : 2} />
                    <span className="font-mono text-[10px] font-bold tracking-wider">{label}</span>
                    {active === id && (
                        <motion.div
                            layoutId="nav-indicator"
                            className="absolute -top-[17px] w-12 h-[2px] bg-primary"
                        />
                    )}
                </button>
            ))}
        </nav>
    );
};
