import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Navigation, Mail, Lock, User, Eye, EyeOff, Loader2, Apple, Calendar, Weight, Ruler, Activity, Bone } from 'lucide-react';
import { authService } from '../../services/auth.service';
import {RegistrationSlideshow} from "@/src/pages/RegistrationSlideshow/RegistrationSlideshow.tsx";

interface RegisterScreenProps {
    onRegisterSuccess: () => void;
    onSwitchToLogin: () => void;
}

type Gender = 'male' | 'female';
type Level = 'beginner' | 'intermediate' | 'advanced';

export const RegisterScreen: React.FC<RegisterScreenProps> = ({ onRegisterSuccess, onSwitchToLogin }) => {
    const [showSlideshow, setShowSlideshow] = useState(true); // Сначала показываем слайдшоу

    const [showForm, setShowForm] = useState(false);
    const [slideshowCompleted, setSlideshowCompleted] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Основные поля
    const [fullName, setFullName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Дополнительные поля
    const [gender, setGender] = useState<Gender>('male');
    const [age, setAge] = useState<number>(0);
    const [weightKg, setWeightKg] = useState<number>(0);
    const [heightCm, setHeightCm] = useState<number>(0);
    const [level, setLevel] = useState<Level>('beginner');
    const [kneeIssues, setKneeIssues] = useState(false);
    const [backIssues, setBackIssues] = useState(false);

    const [error, setError] = useState('');

    const handleSlideshowComplete = () => {
        setShowSlideshow(false);
        setShowForm(true);
        setSlideshowCompleted(true);
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        setShowSlideshow(true);

        try {
            await authService.register({
                name: username,
                email,
                password: password,
                gender,
                age,
                weight_kg: weightKg,
                height_cm: heightCm,
                level
            });
            onRegisterSuccess();

            // onRegisterSuccess();
        } catch (err) {
            setError('Ошибка регистрации. Попробуйте другой email.');
        } finally {
            setIsLoading(false);
        }
    };


    return (
<>
    {/* Слайдшоу */}
    {showSlideshow && (
        <RegistrationSlideshow onComplete={handleSlideshowComplete} />
    )}
    {!showSlideshow && (

    <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-background overflow-y-auto"
        >
            <div className="min-h-screen flex items-center justify-center px-6 py-20">
                <motion.div
                    initial={{ scale: 0.95, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    className="w-full max-w-md"
                >
                    {/* Логотип */}
                    <div className="text-center mb-8">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.1, type: "spring" }}
                            className="inline-flex items-center justify-center w-20 h-20 bg-primary rounded-soft mb-4 shadow-lg shadow-primary/20"
                        >
                            <Navigation size={32} className="text-black" />
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="font-black italic tracking-widest text-primary text-3xl uppercase"
                        >
                            JUST GO
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-white/40 text-xs font-bold uppercase tracking-widest mt-2"
                        >
                            РЕГИСТРАЦИЯ
                        </motion.p>
                    </div>

                    {/* Форма регистрации */}
                    <form onSubmit={handleSubmit} className="space-y-4">

                        {/* Username */}
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20">
                                <User size={18} />
                            </div>
                            <input
                                type="text"
                                placeholder="USERNAME"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full bg-surface-lvl2 border border-surface-border rounded-soft py-3 pl-12 pr-4 text-sm outline-none focus:border-primary transition-colors placeholder:text-white/20 font-mono font-bold"
                                required
                            />
                        </div>

                        {/* Email */}
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20">
                                <Mail size={18} />
                            </div>
                            <input
                                type="email"
                                placeholder="EMAIL"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-surface-lvl2 border border-surface-border rounded-soft py-3 pl-12 pr-4 text-sm outline-none focus:border-primary transition-colors placeholder:text-white/20 font-mono font-bold"
                                required
                            />
                        </div>

                        {/* Пароль */}
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20">
                                <Lock size={18} />
                            </div>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="ПАРОЛЬ"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-surface-lvl2 border border-surface-border rounded-soft py-3 pl-12 pr-12 text-sm outline-none focus:border-primary transition-colors placeholder:text-white/20 font-mono font-bold"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/40 transition-colors"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>

                        {/* Пол */}
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20">
                                <Activity size={18} />
                            </div>
                            <select
                                value={gender}
                                onChange={(e) => setGender(e.target.value as Gender)}
                                className="w-full bg-surface-lvl2 border border-surface-border rounded-soft py-3 pl-12 pr-4 text-sm outline-none focus:border-primary transition-colors text-white/80 font-mono font-bold appearance-none cursor-pointer"
                            >
                                <option value="male">Мужской</option>
                                <option value="female">Женский</option>
                            </select>
                        </div>

                        {/* Возраст, Вес, Рост в сетке */}
                        <div className="grid grid-cols-3 gap-3">
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20">
                                    <Calendar size={14} />
                                </div>
                                <input
                                    type="number"
                                    placeholder="ВОЗРАСТ"
                                    value={age || ''}
                                    onChange={(e) => setAge(Number(e.target.value))}
                                    className="w-full bg-surface-lvl2 border border-surface-border rounded-soft py-3 pl-9 pr-2 text-sm outline-none focus:border-primary transition-colors placeholder:text-white/20 font-mono font-bold"
                                    min={1}
                                    max={120}
                                    required
                                />
                            </div>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20">
                                    <Weight size={14} />
                                </div>
                                <input
                                    type="number"
                                    placeholder="ВЕС (КГ)"
                                    value={weightKg || ''}
                                    onChange={(e) => setWeightKg(Number(e.target.value))}
                                    className="w-full bg-surface-lvl2 border border-surface-border rounded-soft py-3 pl-9 pr-2 text-sm outline-none focus:border-primary transition-colors placeholder:text-white/20 font-mono font-bold"
                                    min={20}
                                    max={300}
                                    required
                                />
                            </div>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20">
                                    <Ruler size={14} />
                                </div>
                                <input
                                    type="number"
                                    placeholder="РОСТ (СМ)"
                                    value={heightCm || ''}
                                    onChange={(e) => setHeightCm(Number(e.target.value))}
                                    className="w-full bg-surface-lvl2 border border-surface-border rounded-soft py-3 pl-9 pr-2 text-sm outline-none focus:border-primary transition-colors placeholder:text-white/20 font-mono font-bold"
                                    min={50}
                                    max={250}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-white/40 text-xs font-mono font-bold tracking-widest ml-1">
                                УРОВЕНЬ ПОДГОТОВКИ
                                {/* Иконка вопроса */}
                                <div className="group relative cursor-help hover:text-white/80 transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="12" r="10"/>
                                        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                                        <line x1="12" y1="17" x2="12.01" y2="17"/>
                                    </svg>
                                    {/* Всплывающее объяснение (кастомный тултип) */}
                                    <div className="absolute left-0 top-full mt-2 w-87 p-2 bg-gray-900 border border-white/10 rounded-lg text-xs text-white/80 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 pointer-events-none">
                                        Выберите ваш уровень: <br/>
                                        • <strong>Начинающий</strong> — могу пробежать 2–3 км<br/>
                                        • <strong>Средний</strong> — справлюсь 5–10 км<br/>
                                        • <strong>Продвинутый</strong> — спокойно более 15 км
                                    </div>
                                </div>
                            </div>



                            <div className="grid grid-cols-3 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setLevel('beginner')}
                                    className={`p-3 rounded-soft border-2 transition-all ${
                                        level === 'beginner'
                                            ? 'border-primary bg-primary/20 text-primary'
                                            : 'border-surface-border bg-surface-lvl2 text-white/40 hover:border-white/20'
                                    }`}
                                >
                                    <div className="text-center">
                                        <div className="text-xs font-black uppercase tracking-widest">Начинающий</div>
                                    </div>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setLevel('intermediate')}
                                    className={`p-3 rounded-soft border-2 transition-all ${
                                        level === 'intermediate'
                                            ? 'border-primary bg-primary/20 text-primary'
                                            : 'border-surface-border bg-surface-lvl2 text-white/40 hover:border-white/20'
                                    }`}
                                >
                                    <div className="text-center">
                                        <div className="text-xs font-black uppercase tracking-widest">Средний</div>
                                    </div>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setLevel('advanced')}
                                    className={`p-3 rounded-soft border-2 transition-all ${
                                        level === 'advanced'
                                            ? 'border-primary bg-primary/20 text-primary'
                                            : 'border-surface-border bg-surface-lvl2 text-white/40 hover:border-white/20'
                                    }`}
                                >
                                    <div className="text-center">
                                        <div className="text-xs font-black uppercase tracking-widest">Продвинутый</div>
                                    </div>
                                </button>
                            </div>
                        </div>


                        {error && (
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-xs text-red-500 text-center font-mono"
                            >
                                {error}
                            </motion.p>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-primary text-black py-3 rounded-soft font-black uppercase tracking-widest text-sm hover:bg-primary/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-6"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    РЕГИСТРАЦИЯ...
                                </>
                            ) : (
                                'СОЗДАТЬ АККАУНТ'
                            )}
                        </button>
                    </form>

                    {/* Разделитель */}
                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-surface-border"></div>
                        </div>
                        <div className="relative flex justify-center text-xs">
                            <span className="px-3 bg-background text-white/20 font-mono font-bold">ИЛИ</span>
                        </div>
                    </div>

                    {/* Альтернативная регистрация */}
                    <button
                        className="w-full bg-surface-lvl1 border border-surface-border py-3 rounded-soft flex items-center justify-center gap-3 hover:bg-surface-lvl2 transition-colors group"
                    >
                        <Apple size={18} className="text-white/60 group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-black uppercase tracking-widest">Продолжить с Apple</span>
                    </button>

                    {/* Ссылка на вход */}
                    <div className="mt-8 text-center">
                        <p className="text-white/40 text-xs font-mono">
                            Уже есть аккаунт?{' '}
                            <button
                                onClick={onSwitchToLogin}
                                className="text-primary hover:text-primary/80 font-black uppercase tracking-wider"
                            >
                                Войти
                            </button>
                        </p>
                    </div>
                </motion.div>
            </div>
        </motion.div> )}
</>
    );
};
