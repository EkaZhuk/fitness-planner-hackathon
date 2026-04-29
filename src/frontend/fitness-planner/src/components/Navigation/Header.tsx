import React from 'react';
import { Navigation, Bell } from 'lucide-react';

export const Header: React.FC = () => (
    <header className="fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-md border-b border-surface-border px-6 py-4 flex justify-between items-center z-50">
        <div className="flex items-center gap-2">
            <Navigation className="text-primary fill-primary" size={20} />
            <h1 className="font-sans font-black italic tracking-widest text-[#FF5F00] text-lg uppercase">
                JUST GO
            </h1>
        </div>
        <button className="text-white relative">
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full" />
        </button>
    </header>
);
