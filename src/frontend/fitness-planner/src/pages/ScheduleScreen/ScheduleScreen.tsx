import React from 'react';
import { motion } from 'motion/react';
import { Plus, Timer, Gauge, Navigation } from 'lucide-react';

export const ScheduleScreen: React.FC = () => {
    const days = [
        { day: 'ПН', date: 12, dot: true },
        { day: 'ВТ', date: 13, dot: true, active: true },
        { day: 'СР', date: 14, dot: false, muted: true },
        { day: 'ЧТ', date: 15, dot: true },
        { day: 'ПТ', date: 16, dot: false, muted: true },
        { day: 'СБ', date: 17, dot: true },
        { day: 'ВС', date: 18, dot: false, muted: true },
    ];

    return (
        <div className="pt-24 px-6 pb-24">
            <div className="flex justify-between items-end mb-6">
                <div>
                    <h2 className="text-5xl font-extrabold tracking-tight">РАСПИСАНИЕ БЕГА</h2>
                    <p className="text-white/40 font-bold uppercase text-xs tracking-widest mt-1">
                        Следующие 7 дней
                    </p>
                </div>
                <button className="bg-primary text-black px-4 py-2 flex items-center gap-2 font-black uppercase text-[10px] tracking-widest rounded-soft">
                    <Plus size={16} /> НОВАЯ ТРЕНИРОВКА
                </button>
            </div>

            {/* Календарь */}
            <div className="grid grid-cols-7 gap-2 mb-8">
                {days.map((item, i) => (
                    <div
                        key={i}
                        className={`flex flex-col items-center py-4 rounded-soft border transition-all ${
                            item.active
                                ? 'bg-surface-lvl2 border-primary scale-105'
                                : 'bg-surface-lvl1 border-surface-border'
                        } ${item.muted ? 'opacity-40' : ''}`}
                    >
            <span
                className={`font-mono text-[10px] font-bold tracking-widest mb-2 ${
                    item.active ? 'text-primary' : 'text-white/40'
                }`}
            >
              {item.day}
            </span>
                        <span className={`text-2xl font-black ${item.active ? 'text-white' : 'text-white/80'}`}>
              {item.date}
            </span>
                        {item.dot && (
                            <div className="mt-2 w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_8px_rgba(255,95,0,0.8)]" />
                        )}
                    </div>
                ))}
            </div>

            {/* Запланированные забеги */}
            <div className="space-y-4">
                <div className="bg-surface-lvl1 border-l-4 border-primary rounded-r-soft p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <div className="bg-surface-lvl2 text-white text-[10px] font-bold px-2 py-1 border border-white/10 rounded mb-2 inline-block uppercase tracking-widest">
                                СЕГОДНЯ • 18:00
                            </div>
                            <h3 className="text-3xl font-black">Трековые интервалы</h3>
                        </div>
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                        >
                            <Timer size={32} className="text-primary" />
                        </motion.div>
                    </div>

                    <div className="grid grid-cols-3 gap-6 py-6 border-y border-white/5 mb-4">
                        <div>
                            <p className="text-[10px] font-bold text-white/40 tracking-widest mb-1 uppercase">
                                ДИСТАНЦИЯ
                            </p>
                            <p className="text-2xl font-black italic">
                                8.0 <span className="text-sm font-bold text-white/40">км</span>
                            </p>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-white/40 tracking-widest mb-1 uppercase">
                                ЦЕЛЕВОЙ ТЕМП
                            </p>
                            <p className="text-2xl font-black italic">
                                4:15 <span className="text-sm font-bold text-white/40">/км</span>
                            </p>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-white/40 tracking-widest mb-1 uppercase">
                                ДЛИТЕЛЬНОСТЬ
                            </p>
                            <p className="text-2xl font-black italic">
                                45 <span className="text-sm font-bold text-white/40">мин</span>
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
              Тренировка:
            </span>
                        <div className="flex-1 h-2 bg-surface-lvl2 flex overflow-hidden">
                            <div className="w-[20%] bg-white/10" />
                            <div className="w-[50%] bg-primary" />
                            <div className="w-[30%] bg-white/10" />
                        </div>
                        <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
              Размин/Работа/Замин
            </span>
                    </div>
                </div>

                <div className="bg-surface-lvl1 border border-surface-border rounded-soft p-6 opacity-60">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <div className="bg-surface-lvl2 text-white text-[10px] font-bold px-2 py-1 border border-white/10 rounded mb-2 inline-block uppercase tracking-widest">
                                ЧТ • 6:30
                            </div>
                            <h3 className="text-3xl font-black">Темповая тренировка</h3>
                        </div>
                        <Gauge size={32} className="text-white/20" />
                    </div>
                    <div className="grid grid-cols-3 gap-6 py-6 border-t border-white/5">
                        <div>
                            <p className="text-[10px] font-bold text-white/40 tracking-widest mb-1 uppercase">
                                ДИСТАНЦИЯ
                            </p>
                            <p className="text-2xl font-black italic">
                                10.0 <span className="text-sm font-bold text-white/40">км</span>
                            </p>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-white/40 tracking-widest mb-1 uppercase">
                                ЦЕЛЕВОЙ ТЕМП
                            </p>
                            <p className="text-2xl font-black italic">
                                4:40 <span className="text-sm font-bold text-white/40">/км</span>
                            </p>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-white/40 tracking-widest mb-1 uppercase">
                                ДЛИТЕЛЬНОСТЬ
                            </p>
                            <p className="text-2xl font-black italic">
                                50 <span className="text-sm font-bold text-white/40">мин</span>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-surface-lvl1 border border-surface-border rounded-soft p-6 opacity-60">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <div className="bg-surface-lvl2 text-white text-[10px] font-bold px-2 py-1 border border-white/10 rounded mb-2 inline-block uppercase tracking-widest">
                                СБ • 7:00
                            </div>
                            <h3 className="text-3xl font-black">Длинная тренировка</h3>
                        </div>
                        <Navigation size={32} className="text-white/20" />
                    </div>
                    <div className="grid grid-cols-3 gap-6 py-6 border-t border-white/5">
                        <div>
                            <p className="text-[10px] font-bold text-white/40 tracking-widest mb-1 uppercase">
                                ДИСТАНЦИЯ
                            </p>
                            <p className="text-2xl font-black italic">
                                21.1 <span className="text-sm font-bold text-white/40">км</span>
                            </p>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-white/40 tracking-widest mb-1 uppercase">
                                ЦЕЛЕВОЙ ТЕМП
                            </p>
                            <p className="text-2xl font-black italic">
                                5:15 <span className="text-sm font-bold text-white/40">/км</span>
                            </p>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-white/40 tracking-widest mb-1 uppercase">
                                ДЛИТЕЛЬНОСТЬ
                            </p>
                            <p className="text-2xl font-black italic">
                                110 <span className="text-sm font-bold text-white/40">мин</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
