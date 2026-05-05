// src/pages/RegisterScreen/RegisterScreen.tsx
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Navigation, Mail, Lock, User, Eye, EyeOff, Loader2, Apple } from 'lucide-react';
import { authService } from '../../services/auth.service';

interface RegisterScreenProps {
    onRegisterSuccess: () => void;
    onSwitchToLogin: () => void;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({ onRegisterSuccess, onSwitchToLogin }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            await authService.register({ name, email, password });
            onRegisterSuccess();
        } catch (err) {
            setError('Ошибка регистрации. Попробуйте другой email.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
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
                    <div className="text-center mb-10">
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
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20">
                                <User size={18} />
                            </div>
                            <input
                                type="text"
                                placeholder="ВАШЕ ИМЯ"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-surface-lvl2 border border-surface-border rounded-soft py-3 pl-12 pr-4 text-sm outline-none focus:border-primary transition-colors placeholder:text-white/20 font-mono font-bold"
                                required
                            />
                        </div>

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
        </motion.div>
    );
};
