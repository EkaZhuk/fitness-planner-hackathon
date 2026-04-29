import React from 'react';
import { motion } from 'motion/react';
import { X, Zap, Check } from 'lucide-react';

interface SubscriptionScreenProps {
    onClose: () => void;
}

export const SubscriptionScreen: React.FC<SubscriptionScreenProps> = ({ onClose }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed inset-0 bg-background z-[100] overflow-y-auto px-6 pt-20 pb-10"
        >
            <button onClick={onClose} className="absolute top-6 left-6 text-primary">
                <X size={24} />
            </button>

            <div className="text-center mb-10">
                <h2 className="font-sans font-extrabold text-4xl tracking-tight leading-none mb-4">
                    ПОВЫСЬ СВОЙ ТЕМП
                </h2>
                <p className="text-white/60 text-sm leading-relaxed">
                    Выберите план, соответствующий вашим амбициям. Откройте доступ к продвинутой
                    аналитике, персонализированным тренировкам и инсайтам для улучшения личных рекордов.
                </p>
            </div>

            <div className="space-y-4">
                {/* Бесплатный план */}
                <div className="bg-surface-lvl1 border border-surface-border rounded-soft p-6">
          <span className="inline-block bg-surface-lvl2 text-white text-[10px] font-bold px-2 py-0.5 rounded-full mb-3 tracking-widest uppercase">
            БАЗОВЫЙ
          </span>
                    <h3 className="text-2xl font-bold mb-1">Бесплатный</h3>
                    <p className="text-white/60 text-sm mb-4">Базовый трекинг для любителей.</p>
                    <div className="flex items-baseline gap-1 mb-6">
                        <span className="text-3xl font-bold">$0</span>
                        <span className="text-white/40 text-sm">/мес</span>
                    </div>
                    <ul className="space-y-3 mb-8">
                        <li className="flex items-center gap-3 text-sm">
                            <Check size={16} className="text-primary" /> GPS-трекинг забегов
                        </li>
                        <li className="flex items-center gap-3 text-sm">
                            <Check size={16} className="text-primary" /> Базовый темп и дистанция
                        </li>
                        <li className="flex items-center gap-3 text-sm">
                            <Check size={16} className="text-primary" /> Таблицы лидеров сообщества
                        </li>
                    </ul>
                    <button className="w-full py-3 border border-white font-bold uppercase tracking-widest text-xs hover:bg-white hover:text-black transition-colors rounded-soft">
                        Текущий план
                    </button>
                </div>

                {/* Pro план */}
                <div className="bg-surface-lvl1 border-2 border-primary rounded-soft p-6 relative">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-black text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter">
                        ПОПУЛЯРНЫЙ
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                        <Zap size={16} className="text-primary fill-primary" />
                        <span className="text-primary text-[10px] font-bold tracking-widest uppercase">
              ПРО БЕГУН
            </span>
                    </div>
                    <h3 className="text-2xl font-bold mb-1">Элитный бегун</h3>
                    <p className="text-white/60 text-sm mb-4">Продвинутая метрика для серьёзных тренировок.</p>
                    <div className="flex items-baseline gap-1 mb-6">
                        <span className="text-3xl font-bold">$14.99</span>
                        <span className="text-white/40 text-sm">/мес</span>
                    </div>
                    <ul className="space-y-3 mb-8">
                        <li className="flex items-center gap-3 text-sm font-bold">
                            <Check size={16} className="text-primary" /> Всё из Бесплатного
                        </li>
                        <li className="flex items-center gap-3 text-sm">
                            <Check size={16} className="text-primary" /> Продвинутая аналитика (МПК)
                        </li>
                        <li className="flex items-center gap-3 text-sm">
                            <Check size={16} className="text-primary" /> Тренировочные планы от ИИ
                        </li>
                        <li className="flex items-center gap-3 text-sm">
                            <Check size={16} className="text-primary" /> Живое аудио сопровождение
                        </li>
                    </ul>
                    <button className="w-full py-3 bg-primary text-black font-black uppercase tracking-widest text-xs hover:bg-opacity-90 transition-colors shadow-lg shadow-primary/20 rounded-soft">
                        Перейти на Pro
                    </button>
                </div>

                {/* Элитный план */}
                <div className="bg-surface-lvl1 border border-surface-border rounded-soft p-6">
          <span className="inline-block bg-surface-lvl2 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full mb-3 tracking-widest uppercase">
            ПРЕМИУМ
          </span>
                    <h3 className="text-2xl font-bold mb-1">Элитный атлет</h3>
                    <p className="text-white/60 text-sm mb-4">Максимальный пакет производительности.</p>
                    <div className="flex items-baseline gap-1 mb-6">
                        <span className="text-3xl font-bold">$49.99</span>
                        <span className="text-white/40 text-sm">/мес</span>
                    </div>
                    <ul className="space-y-3 mb-8">
                        <li className="flex items-center gap-3 text-sm font-bold">
                            <Check size={16} className="text-primary" /> Всё из Pro
                        </li>
                        <li className="flex items-center gap-3 text-sm">
                            <Check size={16} className="text-primary" /> Анализ с живым тренером 1-на-1
                        </li>
                        <li className="flex items-center gap-3 text-sm">
                            <Check size={16} className="text-primary" /> Видео-анализ техники бега
                        </li>
                        <li className="flex items-center gap-3 text-sm">
                            <Check size={16} className="text-primary" /> Планирование гоночной стратегии
                        </li>
                    </ul>
                    <button className="w-full py-3 border border-primary text-primary font-bold uppercase tracking-widest text-xs hover:bg-primary hover:text-black transition-colors rounded-soft">
                        Стать Элитным
                    </button>
                </div>
            </div>
        </motion.div>
    );
};
