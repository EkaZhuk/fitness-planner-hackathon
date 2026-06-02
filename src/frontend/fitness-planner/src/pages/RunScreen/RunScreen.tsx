import React, { useState } from 'react';
import { Timer, TrendingUp, Target, Zap } from 'lucide-react';

export const RunScreen: React.FC = () => {
    const categories = ['ВСЕ', 'СКОРОСТЬ', 'ВЫНОСЛИВОСТЬ'];
    const [activeCat, setActiveCat] = useState('ВСЕ');

    const workouts = [
        {
            title: 'Высокое Поднимание Колен',
            type: 'РАЗМИНКА',
            duration: '15 МИН',
            level: 'ЛЕГКО',
            img: 'https://picsum.photos/seed/drill1/400/300',
        },
        {
            title: 'Темповая тренировка (Пороговая)',
            type: 'ВЫНОСЛИВОСТЬ',
            duration: '60 МИН',
            level: 'СРЕДНЕ',
            color: 'text-primary',
            img: 'https://picsum.photos/seed/drill2/400/300',
        },
        {
            title: 'Флоу для Сгибателей Бедра',
            type: 'МОБИЛЬНОСТЬ',
            duration: '20 МИН',
            level: 'ЛЕГКО',
            img: 'https://picsum.photos/seed/drill3/400/300',
        },
        {
            title: 'Повторы в гору',
            type: 'СКОРОСТЬ',
            duration: '35 МИН',
            level: 'ТЯЖЕЛО',
            color: 'text-red-500',
            img: 'https://picsum.photos/seed/drill4/400/300',
        },
    ];

    return (
        <div className="pt-24 px-6 pb-24">
            <div className="flex gap-2 mb-6">
        <span className="bg-surface-lvl2 text-white text-[10px] font-bold px-3 py-1 rounded tracking-widest uppercase">
          БИБЛИОТЕКА
        </span>
                <span className="bg-primary/20 text-primary text-[10px] font-bold px-3 py-1 rounded tracking-widest uppercase">
          PRO ДОСТУП
        </span>
            </div>

            <h2 className="text-4xl font-extrabold tracking-tight mb-2">Беговые упражнения и тренировки</h2>
            <p className="text-white/60 text-sm mb-8">
                Тренировки высокой точности для улучшения скорости, выносливости и техники бега.
            </p>

            {/* Категории */}
            <div className="flex gap-2 mb-8">
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setActiveCat(cat)}
                        className={`px-4 py-2 font-mono text-[10px] font-bold tracking-widest transition-colors ${
                            activeCat === cat ? 'bg-primary text-black' : 'bg-surface-lvl2 text-white/60'
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Основное упражнение */}
            <div className="bg-surface-lvl1 border border-surface-border rounded-soft overflow-hidden mb-6 relative min-h-[300px] flex flex-col justify-end p-6">
                <img
                    src="https://picsum.photos/seed/athlete1/800/600"
                    alt="Бегун"
                    className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay"
                    referrerPolicy="no-referrer"
                />
                <div className="relative z-10">
                    <div className="flex gap-2 mb-3">
            <span className="bg-surface-lvl2 text-white text-[10px] font-bold px-2 py-0.5 border border-white/20 uppercase">
              СКОРОСТЬ
            </span>
                        <span className="bg-primary text-black text-[10px] font-black px-2 py-0.5 flex items-center gap-1 uppercase">
              <Zap size={10} fill="black" /> ВЫСОКАЯ
            </span>
                    </div>
                    <h3 className="text-3xl font-black mb-2">400м Повторы на дорожке</h3>
                    <p className="text-white/70 text-sm mb-6 max-w-xs">
                        Высокоинтенсивные интервалы для увеличения МПК и анаэробного порога. Увеличьте темп на
                        прямых.
                    </p>

                    <div className="flex items-center justify-between">
                        <div className="flex gap-4">
                            <div className="flex items-center gap-1.5 text-white/60">
                                <Timer size={14} />
                                <span className="font-mono text-xs font-bold">45 МИН</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-white/60">
                                <TrendingUp size={14} />
                                <span className="font-mono text-xs font-bold">8 ПОВТОРОВ</span>
                            </div>
                        </div>
                        <button className="bg-primary text-black h-10 px-6 font-black uppercase text-xs tracking-widest hover:opacity-90 active:scale-95 transition-all rounded-soft">
                            СТАРТ
                        </button>
                    </div>
                </div>
            </div>

            {/* Прогресс */}
            <div className="bg-surface-lvl1 border border-surface-border rounded-soft p-6 mb-8">
                <div className="flex justify-between items-end mb-2">
                    <h4 className="font-mono text-[10px] font-bold text-white/40 tracking-widest uppercase">
                        НЕДЕЛЬНЫЙ ПРОГРЕСС
                    </h4>
                    <div className="flex items-center gap-1 text-primary">
                        <TrendingUp size={14} />
                        <span className="font-sans font-bold">+2.1</span>
                    </div>
                </div>
                <div className="flex items-baseline gap-1 mb-3">
                    <span className="text-2xl font-black italic">12.4</span>
                    <span className="text-white/40 font-bold">км</span>
                </div>
                <div className="h-1.5 bg-surface-lvl2 overflow-hidden mb-2">
                    <div className="h-full bg-primary w-[65%]" />
                </div>
                <span className="text-[10px] font-bold text-white/40 tracking-widest">
          65% ОТ НЕДЕЛЬНОЙ ЦЕЛИ
        </span>

                <div className="mt-8 pt-6 border-t border-surface-border">
                    <h4 className="font-mono text-[10px] font-bold text-white/40 tracking-widest uppercase mb-4">
                        СЛЕДУЮЩАЯ ТРЕНИРОВКА
                    </h4>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-surface-lvl2 rounded-soft flex items-center justify-center text-primary">
                            <Target size={24} />
                        </div>
                        <div>
                            <p className="font-bold">Динамическая растяжка</p>
                            <p className="text-white/40 text-xs">Мобильность • 10 Мин</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Все тренировки */}
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-black italic">Все тренировки</h3>
                <button className="text-primary font-mono text-[10px] font-bold tracking-widest uppercase hover:underline">
                    ВСЕ
                </button>
            </div>

            <div className="space-y-6">
                {workouts.map((item, i) => (
                    <div key={i} className="bg-surface-lvl1 border border-surface-border rounded-soft overflow-hidden">
                        <div className="aspect-[16/9] relative">
                            <img
                                src={item.img}
                                alt={item.title}
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                            />
                            <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-2 py-1 border border-white/20">
                                <span className="text-[10px] font-bold tracking-widest uppercase">{item.type}</span>
                            </div>
                        </div>
                        <div className="p-4">
                            <h4 className="text-lg font-bold mb-1">{item.title}</h4>
                            <p className="text-white/40 text-xs mb-4">
                                Базовые динамические движения для активации ягодиц и идеальной формы.
                            </p>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-1 text-white/60">
                                    <Timer size={12} />
                                    <span className="text-[10px] font-bold uppercase">{item.duration}</span>
                                </div>
                                <span className={`text-[10px] font-bold uppercase tracking-widest ${item.color || 'text-white/60'}`}>
                  {item.level}
                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
