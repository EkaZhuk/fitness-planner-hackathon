import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MessageSquare, User, Target, ArrowRight, Plus, Send, Loader2 } from 'lucide-react';
import { Message } from '../../types';

export const CoachScreen: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 1,
            role: 'bot',
            text: 'Доброе утро. Анализирую вчерашний 30-километровый забег. Ваш темп упал на 15с/км после 22-го километра. Частота пульса подскочила до 175 ударов. Нужно пересмотреть стратегию питания для Чикаго.',
            sender: 'Элитный Тренер ИИ',
        },
        {
            id: 2,
            role: 'user',
            text: 'Я чувствовал, что техника ломается. Бёдра опускались.',
        },
        {
            id: 3,
            role: 'bot',
            text: 'Классический признак усталости средней ягодичной мышцы. Ваш каденс упал со 178 до 168. Добавляю две целенаправленные силовые сессии в этот тренировочный блок. Работаем над боковой стабилизацией.',
            sender: 'Элитный Тренер ИИ',
            planUpdate: { title: 'Протокол активации ягодиц', action: 'ПОСМОТРЕТЬ СЕССИЮ' },
        },
        {
            id: 4,
            role: 'user',
            text: 'Это повлияет на мою скоростную тренировку в четверг?',
        },
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMsg: Message = { id: Date.now(), role: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 1000));

            const botMsg: Message = {
                id: Date.now() + 1,
                role: 'bot',
                text: `Отличный вопрос. ${input} Давайте проанализируем ваши тренировочные данные. Основываясь на ваших недавних показателях, я рекомендую поддерживать текущий темп и сосредоточиться на восстановлении. Продолжайте расширять свои границы, но прислушивайтесь к телу.`,
                sender: 'Элитный Тренер ИИ',
            };
            setMessages(prev => [...prev, botMsg]);
        } catch (error) {
            console.error('Coach error:', error);
            setMessages(prev => [
                ...prev,
                {
                    id: Date.now() + 1,
                    role: 'bot',
                    text: 'Соединение с облаком аналитики прервано. Давайте сохраним текущий темп, пока я переподключаюсь.',
                    sender: 'Элитный Тренер ИИ',
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col pt-20 pb-[100px]">
            <div className="px-6 py-4 bg-surface-lvl1 border-b border-surface-border">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-primary flex items-center justify-center rounded-soft text-black">
                        <MessageSquare size={28} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black italic">Элитный Тренер ИИ</h2>
                        <p className="text-white/40 text-xs font-bold uppercase tracking-widest">
                            Специализация: Подготовка к марафону и биомеханика
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="text-center">
          <span className="font-mono text-[10px] font-bold text-white/20 tracking-widest uppercase">
            СЕГОДНЯ, 06:00
          </span>
                </div>

                {messages.map(m => (
                    <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} gap-3`}>
                        {m.role === 'bot' && (
                            <div className="w-8 h-8 bg-surface-lvl2 flex items-center justify-center rounded text-white/40 mt-1 shrink-0">
                                <MessageSquare size={14} />
                            </div>
                        )}
                        <div className="max-w-[80%] space-y-2">
                            <div
                                className={`${
                                    m.role === 'user' ? 'bg-[#333333]' : 'bg-surface-lvl1'
                                } border border-surface-border p-4 rounded-soft`}
                            >
                                <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.text}</p>

                                {m.planUpdate && (
                                    <div className="mt-4 pt-4 border-t border-white/5">
                                        <div className="flex items-center justify-between mb-3">
                      <span className="text-primary text-[10px] font-black tracking-widest uppercase">
                        ОБНОВЛЕНИЕ ПЛАНА
                      </span>
                                            <Target size={14} className="text-primary" />
                                        </div>
                                        <p className="text-xs font-bold mb-4">Добавлено: {m.planUpdate.title}</p>
                                        <button className="w-full py-2 bg-surface-lvl2 border border-white/10 text-white font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 hover:bg-white/10 transition-colors">
                                            {m.planUpdate.action} <ArrowRight size={12} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                        {m.role === 'user' && (
                            <div className="w-8 h-8 bg-primary flex items-center justify-center rounded text-black mt-1 shrink-0 shadow-lg shadow-primary/20">
                                <User size={14} />
                            </div>
                        )}
                    </div>
                ))}

                {isLoading && (
                    <div className="flex justify-start gap-3">
                        <div className="w-8 h-8 bg-surface-lvl2 flex items-center justify-center rounded text-white/40 mt-1 shrink-0">
                            <MessageSquare size={14} />
                        </div>
                        <div className="bg-surface-lvl1 border border-surface-border p-3 rounded-soft flex gap-1">
                            <motion.div
                                animate={{ scale: [1, 1.5, 1] }}
                                transition={{ repeat: Infinity, duration: 1 }}
                                className="w-1.5 h-1.5 bg-primary rounded-full"
                            />
                            <motion.div
                                animate={{ scale: [1, 1.5, 1] }}
                                transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                                className="w-1.5 h-1.5 bg-primary/60 rounded-full"
                            />
                            <motion.div
                                animate={{ scale: [1, 1.5, 1] }}
                                transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                                className="w-1.5 h-1.5 bg-primary/30 rounded-full"
                            />
                        </div>
                    </div>
                )}
            </div>

            <div className="fixed bottom-24 left-6 right-6 z-50">
                <div className="bg-surface-lvl1 border border-primary p-2 flex items-center gap-2 shadow-2xl shadow-black rounded-soft">
                    <button className="w-10 h-10 flex items-center justify-center text-white/40 hover:text-white transition-colors">
                        <Plus size={20} />
                    </button>
                    <input
                        type="text"
                        placeholder="Спросите о темпе, технике или расписании..."
                        className="flex-1 bg-transparent border-none outline-none text-sm placeholder:text-white/20"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleSend()}
                    />
                    <button
                        onClick={handleSend}
                        disabled={isLoading}
                        className="w-12 h-10 bg-primary text-black flex items-center justify-center hover:bg-opacity-90 transition-colors rounded-soft disabled:opacity-50"
                    >
                        {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} fill="black" />}
                    </button>
                </div>
            </div>
        </div>
    );
};
