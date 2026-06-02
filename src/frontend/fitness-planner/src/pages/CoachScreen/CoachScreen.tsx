import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { MessageSquare, User, Target, ArrowRight, Plus, Send, Loader2 } from 'lucide-react';
interface Message {
    id: number;
    role: 'user' | 'assistant';
    text: string;
    timestamp?: number;
}
export const CoachScreen: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [isInitialLoad, setIsInitialLoad] = useState(false);


    useEffect(() => {
        loadChatHistory();
    }, []);


    useEffect(() => {
        if (!isInitialLoad && messages.length > 0) {
            saveChatHistory();
        }
        scrollToBottom();
    }, [messages, isInitialLoad]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };


    const loadChatHistory = () => {
        try {
            const savedHistory = localStorage.getItem('coach_chat_history');
            if (savedHistory) {
                const parsedHistory = JSON.parse(savedHistory);
                if (Array.isArray(parsedHistory) && parsedHistory.length > 0) {
                    setMessages(parsedHistory);
                } else {
                    // Если истории нет, показываем приветственное сообщение
                    setMessages([{
                        id: Date.now(),
                        role: 'assistant',
                        text: '🏃‍ Привет! Я твой персональный AI-тренер. Задавай вопросы о беге, тренировках, технике или питании. Я помогу тебе подготовиться к марафону!',
                        timestamp: Date.now()
                    }]);
                }
            } else {
                // Первый запуск - приветственное сообщение
                setMessages([{
                    id: Date.now(),
                    role: 'assistant',
                    text: '🏃‍ Привет! Я твой персональный AI-тренер. Задавай вопросы о беге, тренировках, технике или питании. Я помогу тебе подготовиться к марафону!',
                    timestamp: Date.now()
                }]);
            }
        } catch (error) {
            console.error('Error loading history:', error);
        }
        finally {
            setIsInitialLoad(false);
        }
    };

    // Сохранение истории в localStorage
    const saveChatHistory = () => {
        try {
            // Сохраняем только последние 100 сообщений, чтобы не переполнить хранилище
            const historyToSave = messages.slice(-100);
            localStorage.setItem('coach_chat_history', JSON.stringify(historyToSave));
        } catch (error) {
            console.error('Error saving history:', error);
        }
    };

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        // Добавляем сообщение пользователя
        const userMsg: Message = { id: Date.now(), role: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        const userQuestion = input;
        setInput('');
        setIsLoading(true);

        try {

            const historyToSend = [...messages, userMsg].slice(-20);

            // Запрос к вашему API
            // const response = await fetch('http://82.146.61.208:8000/api/chat', {
                const response = await fetch('http://localhost:8000/api/chat', {

                method: 'POST',
                credentials: 'include',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: userQuestion,
                    history: historyToSend
                })
            });

            if (!response.ok) {
                throw new Error('Ошибка сервера');
            }

            const data = await response.json();

            // Добавляем ответ ассистента
            const assistantMsg: Message = {
                id: Date.now() + 1,
                role: 'assistant',
                text: data.response || 'Извините, я не смог сформулировать ответ.'
            };
            setMessages(prev => [...prev, assistantMsg]);

        } catch (error) {
            console.error('Coach error:', error);

            // Добавляем сообщение об ошибке
            const errorMsg: Message = {
                id: Date.now() + 1,
                role: 'assistant',
                text: 'Извините, в данный момент ответ ассистента недоступен '
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col pt-20">
            <div className="px-6 py-4 bg-surface-lvl1 border-b border-surface-border shrink-0">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-primary flex items-center justify-center rounded-soft text-black">
                        <MessageSquare size={28}/>
                    </div>
                    <div>
                        <h2 className="text-2xl font-black italic">AI Тренер</h2>
                        <p className="text-white/40 text-xs font-bold uppercase tracking-widest">
                            Подготовка к марафону
                        </p>
                    </div>
                </div>
            </div>

            {/* Область сообщений */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 pb-50">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        {msg.role === 'assistant' && (
                            <div className="w-8 h-8 bg-surface-lvl2 flex items-center justify-center rounded text-white/40 mt-1 shrink-0">
                                <MessageSquare size={14}/>
                            </div>
                        )}

                        <div
                            className={`max-w-[70%] p-3 rounded-soft ${
                                msg.role === 'user'
                                    ? 'bg-primary text-black'
                                    : 'bg-surface-lvl1 border border-surface-border'
                            }`}
                        >
                            <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                        </div>

                        {msg.role === 'user' && (
                            <div className="w-8 h-8 bg-primary/20 flex items-center justify-center rounded text-primary mt-1 shrink-0">
                                <User size={14}/>
                            </div>
                        )}
                    </div>
                ))}

                {isLoading && (
                    <div className="flex justify-start gap-3">
                        <div className="w-8 h-8 bg-surface-lvl2 flex items-center justify-center rounded text-white/40 mt-1 shrink-0">
                            <MessageSquare size={14}/>
                        </div>
                        <div className="bg-surface-lvl1 border border-surface-border p-3 rounded-soft flex gap-1">
                            <motion.div
                                animate={{scale: [1, 1.5, 1]}}
                                transition={{repeat: Infinity, duration: 1}}
                                className="w-1.5 h-1.5 bg-primary rounded-full"
                            />
                            <motion.div
                                animate={{scale: [1, 1.5, 1]}}
                                transition={{repeat: Infinity, duration: 1, delay: 0.2}}
                                className="w-1.5 h-1.5 bg-primary/60 rounded-full"
                            />
                            <motion.div
                                animate={{scale: [1, 1.5, 1]}}
                                transition={{repeat: Infinity, duration: 1, delay: 0.4}}
                                className="w-1.5 h-1.5 bg-primary/30 rounded-full"
                            />
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Поле ввода */}
            <div className="shrink-0 p-4 border-t border-surface-border bg-surface-lvl1 pb-28"
                 style={{
                     position: 'fixed',
                     bottom: 0,
                     left: 0,
                     right: 0,
                     zIndex: 50
                 }}>
                <div className="bg-surface-lvl2 border border-primary/30 p-2 flex items-center gap-2 shadow-lg rounded-soft">
                    <button className="w-10 h-10 flex items-center justify-center text-white/40 hover:text-white transition-colors">
                        <Plus size={20}/>
                    </button>
                    <input
                        type="text"
                        placeholder="Спросите о темпе, технике или расписании..."
                        className="flex-1 bg-transparent border-none outline-none text-sm placeholder:text-white/20 py-2"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleSend()}
                    />
                    <button
                        onClick={handleSend}
                        disabled={isLoading}
                        className="w-12 h-10 bg-primary text-black flex items-center justify-center hover:bg-opacity-90 transition-colors rounded-soft disabled:opacity-50"
                    >
                        {isLoading ? <Loader2 size={18} className="animate-spin"/> : <Send size={18} fill="black"/>}
                    </button>
                </div>
            </div>
        </div>
    );
};
