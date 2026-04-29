import React from 'react';
import { User, ArrowRight } from 'lucide-react';

interface ProfileScreenProps {
    onUpgradePress: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ onUpgradePress }) => {
    return (
        <div className="pt-32 px-6 flex flex-col items-center text-center">
            <div className="w-24 h-24 bg-surface-lvl2 border-2 border-primary p-1 rounded-full mb-6">
                <div className="w-full h-full bg-surface-lvl1 rounded-full flex items-center justify-center">
                    <User size={48} className="text-primary" />
                </div>
            </div>
            <h2 className="text-3xl font-black italic">ЭЛИТНЫЙ БЕГУН</h2>
            <p className="text-white/40 font-bold uppercase text-xs tracking-widest mt-1 mb-8">
                Блок подготовки к марафону в Чикаго
            </p>

            <div className="w-full grid grid-cols-2 gap-4 mb-8">
                <div className="bg-surface-lvl1 p-4 rounded-soft border border-surface-border text-left">
                    <p className="text-[10px] font-bold text-white/40 tracking-widest uppercase mb-1">
                        ТЕКУЩИЙ РАНГ
                    </p>
                    <p className="font-sans font-black italic text-xl text-primary">ЭЛИТА III</p>
                </div>
                <div className="bg-surface-lvl1 p-4 rounded-soft border border-surface-border text-left">
                    <p className="text-[10px] font-bold text-white/40 tracking-widest uppercase mb-1">
                        ОБЩИЙ КИЛОМЕТРАЖ
                    </p>
                    <p className="font-sans font-black italic text-xl">1,248.5</p>
                </div>
            </div>

            <div className="w-full space-y-2">
                <button
                    onClick={onUpgradePress}
                    className="w-full bg-primary text-black py-4 font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 rounded-soft"
                >
                    ПОВЫСИТЬ ПЛАН <ArrowRight size={14} />
                </button>
                <button className="w-full bg-surface-lvl1 text-white py-4 font-black uppercase tracking-widest text-xs border border-surface-border rounded-soft">
                    НАСТРОЙКИ
                </button>
            </div>
        </div>
    );
};
