// /**
//  * @license
//  * SPDX-License-Identifier: Apache-2.0
//  */
//
// import React, { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'motion/react';
// import {
//     Dumbbell,
//     Calendar,
//     MessageSquare,
//     User,
//     Bell,
//     Plus,
//     Timer,
//     Gauge,
//     Navigation,
//     Check,
//     Zap,
//     ArrowRight,
//     TrendingUp,
//     Target,
//     ChevronRight,
//     X,
//     Send,
//     Loader2
// } from 'lucide-react';
// // import { GoogleGenAI } from "@google/genai"; // Закомментировано, так как API ключ не настроен
//
// // --- Types ---
//
// type ScreenType = 'run' | 'schedule' | 'coach' | 'profile' | 'subscription';
//
// // --- Shared Components ---
//
// const NavBar = ({ active, onChange }: { active: ScreenType, onChange: (s: ScreenType) => void }) => {
//     const items = [
//         { id: 'run', label: 'RUN', icon: Dumbbell },
//         { id: 'schedule', label: 'SCHEDULE', icon: Calendar },
//         { id: 'coach', label: 'AI COACH', icon: MessageSquare },
//         { id: 'profile', label: 'PROFILE', icon: User },
//     ];
//
//     return (
//         <nav className="fixed bottom-0 left-0 right-0 bg-surface-lvl1 border-t border-surface-border px-6 py-4 flex justify-between items-center z-50">
//             {items.map(({ id, label, icon: Icon }) => (
//                 <button
//                     key={id}
//                     onClick={() => onChange(id as ScreenType)}
//                     className={`flex flex-col items-center gap-1 transition-colors ${active === id ? 'text-primary' : 'text-white/40'}`}
//                 >
//                     <Icon size={24} strokeWidth={active === id ? 2.5 : 2} />
//                     <span className="font-mono text-[10px] font-bold tracking-wider">{label}</span>
//                     {active === id && (
//                         <motion.div
//                             layoutId="nav-indicator"
//                             className="absolute -top-[17px] w-12 h-[2px] bg-primary"
//                         />
//                     )}
//                 </button>
//             ))}
//         </nav>
//     );
// };
//
// const Header = ({ title }: { title: string }) => (
//     <header className="fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-md border-b border-surface-border px-6 py-4 flex justify-between items-center z-50">
//         <div className="flex items-center gap-2">
//             <Navigation className="text-primary fill-primary" size={20} />
//             <h1 className="font-sans font-black italic tracking-widest text-[#FF5F00] text-lg uppercase">
//                 APEX VITALITY
//             </h1>
//         </div>
//         <button className="text-white relative">
//             <Bell size={20} />
//             <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full" />
//         </button>
//     </header>
// );
//
// // --- Screen Components ---
//
// const SubscriptionScreen = ({ onClose }: { onClose: () => void }) => {
//     return (
//         <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: 20 }}
//             className="fixed inset-0 bg-background z-[100] overflow-y-auto px-6 pt-20 pb-10"
//         >
//             <button onClick={onClose} className="absolute top-6 left-6 text-primary">
//                 <X size={24} />
//             </button>
//
//             <div className="text-center mb-10">
//                 <h2 className="font-sans font-extrabold text-4xl tracking-tight leading-none mb-4">ELEVATE YOUR PACE</h2>
//                 <p className="text-white/60 text-sm leading-relaxed">
//                     Choose the plan that matches your ambition. Unlock advanced analytics, personalized coaching, and elite insights to crush your PR.
//                 </p>
//             </div>
//
//             <div className="space-y-4">
//                 {/* Basic Plan */}
//                 <div className="bg-surface-lvl1 border border-surface-border rounded-soft p-6">
//                     <span className="inline-block bg-surface-lvl2 text-white text-[10px] font-bold px-2 py-0.5 rounded-full mb-3 tracking-widest uppercase">BASIC</span>
//                     <h3 className="text-2xl font-bold mb-1">Free</h3>
//                     <p className="text-white/60 text-sm mb-4">Essential tracking for casual runners.</p>
//                     <div className="flex items-baseline gap-1 mb-6">
//                         <span className="text-3xl font-bold">$0</span>
//                         <span className="text-white/40 text-sm">/mo</span>
//                     </div>
//                     <ul className="space-y-3 mb-8">
//                         <li className="flex items-center gap-3 text-sm"><Check size={16} className="text-primary" /> GPS Run Tracking</li>
//                         <li className="flex items-center gap-3 text-sm"><Check size={16} className="text-primary" /> Basic Pace & Distance</li>
//                         <li className="flex items-center gap-3 text-sm"><Check size={16} className="text-primary" /> Community Leaderboards</li>
//                     </ul>
//                     <button className="w-full py-3 border border-white font-bold uppercase tracking-widest text-xs hover:bg-white hover:text-black transition-colors rounded-soft">
//                         Current Plan
//                     </button>
//                 </div>
//
//                 {/* Pro Plan */}
//                 <div className="bg-surface-lvl1 border-2 border-primary rounded-soft p-6 relative">
//                     <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-black text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter">
//                         MOST POPULAR
//                     </div>
//                     <div className="flex items-center gap-2 mb-3">
//                         <Zap size={16} className="text-primary fill-primary" />
//                         <span className="text-primary text-[10px] font-bold tracking-widest uppercase">PRO RUNNER</span>
//                     </div>
//                     <h3 className="text-2xl font-bold mb-1">Elite Runner</h3>
//                     <p className="text-white/60 text-sm mb-4">Advanced metrics for serious training.</p>
//                     <div className="flex items-baseline gap-1 mb-6">
//                         <span className="text-3xl font-bold">$14.99</span>
//                         <span className="text-white/40 text-sm">/mo</span>
//                     </div>
//                     <ul className="space-y-3 mb-8">
//                         <li className="flex items-center gap-3 text-sm font-bold"><Check size={16} className="text-primary" /> Everything in Free</li>
//                         <li className="flex items-center gap-3 text-sm"><Check size={16} className="text-primary" /> Advanced Analytics (VO2 Max)</li>
//                         <li className="flex items-center gap-3 text-sm"><Check size={16} className="text-primary" /> AI-Generated Training Plans</li>
//                         <li className="flex items-center gap-3 text-sm"><Check size={16} className="text-primary" /> Live Audio Coaching</li>
//                     </ul>
//                     <button className="w-full py-3 bg-primary text-black font-black uppercase tracking-widest text-xs hover:bg-opacity-90 transition-colors shadow-lg shadow-primary/20 rounded-soft">
//                         Upgrade to Pro
//                     </button>
//                 </div>
//
//                 {/* Elite Plan */}
//                 <div className="bg-surface-lvl1 border border-surface-border rounded-soft p-6">
//                     <span className="inline-block bg-surface-lvl2 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full mb-3 tracking-widest uppercase">PREMIUM</span>
//                     <h3 className="text-2xl font-bold mb-1">Elite Athlete</h3>
//                     <p className="text-white/60 text-sm mb-4">The ultimate performance package.</p>
//                     <div className="flex items-baseline gap-1 mb-6">
//                         <span className="text-3xl font-bold">$49.99</span>
//                         <span className="text-white/40 text-sm">/mo</span>
//                     </div>
//                     <ul className="space-y-3 mb-8">
//                         <li className="flex items-center gap-3 text-sm font-bold"><Check size={16} className="text-primary" /> Everything in Pro</li>
//                         <li className="flex items-center gap-3 text-sm"><Check size={16} className="text-primary" /> 1-on-1 Human Coach Analysis</li>
//                         <li className="flex items-center gap-3 text-sm"><Check size={16} className="text-primary" /> Video Gait Analysis</li>
//                         <li className="flex items-center gap-3 text-sm"><Check size={16} className="text-primary" /> Race Strategy Planning</li>
//                     </ul>
//                     <button className="w-full py-3 border border-primary text-primary font-bold uppercase tracking-widest text-xs hover:bg-primary hover:text-black transition-colors rounded-soft">
//                         Go Elite
//                     </button>
//                 </div>
//             </div>
//         </motion.div>
//     );
// };
//
// const RunScreen = () => {
//     const categories = ['ALL', 'SPEED WORK', 'ENDURANCE'];
//     const [activeCat, setActiveCat] = useState('ALL');
//
//     return (
//         <div className="pt-24 px-6 pb-24">
//             <div className="flex gap-2 mb-6">
//                 <span className="bg-surface-lvl2 text-white text-[10px] font-bold px-3 py-1 rounded tracking-widest uppercase">LIBRARY</span>
//                 <span className="bg-primary/20 text-primary text-[10px] font-bold px-3 py-1 rounded tracking-widest uppercase">PRO ACCESS</span>
//             </div>
//
//             <h2 className="text-4xl font-extrabold tracking-tight mb-2">Running Drills & Workouts</h2>
//             <p className="text-white/60 text-sm mb-8">Precision-engineered routines to enhance speed, build endurance, and refine your running mechanics.</p>
//
//             {/* Categories */}
//             <div className="flex gap-2 mb-8">
//                 {categories.map(cat => (
//                     <button
//                         key={cat}
//                         onClick={() => setActiveCat(cat)}
//                         className={`px-4 py-2 font-mono text-[10px] font-bold tracking-widest transition-colors ${activeCat === cat ? 'bg-primary text-black' : 'bg-surface-lvl2 text-white/60'}`}
//                     >
//                         {cat}
//                     </button>
//                 ))}
//             </div>
//
//             {/* Main Drills */}
//             <div className="bg-surface-lvl1 border border-surface-border rounded-soft overflow-hidden mb-6 relative min-h-[300px] flex flex-col justify-end p-6">
//                 <img
//                     src="https://picsum.photos/seed/athlete1/800/600"
//                     alt="Runner"
//                     className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay"
//                     referrerPolicy="no-referrer"
//                 />
//                 <div className="relative z-10">
//                     <div className="flex gap-2 mb-3">
//                         <span className="bg-surface-lvl2 text-white text-[10px] font-bold px-2 py-0.5 border border-white/20 uppercase">SPEED</span>
//                         <span className="bg-primary text-black text-[10px] font-black px-2 py-0.5 flex items-center gap-1 uppercase">
//               <Zap size={10} fill="black" /> HIGH
//              </span>
//                     </div>
//                     <h3 className="text-3xl font-black mb-2">400m Track Repeats</h3>
//                     <p className="text-white/70 text-sm mb-6 max-w-xs">High-intensity intervals designed to increase your VO2 max and anaerobic threshold. Push your pace on the straights.</p>
//
//                     <div className="flex items-center justify-between">
//                         <div className="flex gap-4">
//                             <div className="flex items-center gap-1.5 text-white/60">
//                                 <Timer size={14} />
//                                 <span className="font-mono text-xs font-bold">45 MIN</span>
//                             </div>
//                             <div className="flex items-center gap-1.5 text-white/60">
//                                 <TrendingUp size={14} />
//                                 <span className="font-mono text-xs font-bold">8 ROUNDS</span>
//                             </div>
//                         </div>
//                         <button className="bg-primary text-black h-10 px-6 font-black uppercase text-xs tracking-widest hover:opacity-90 active:scale-95 transition-all rounded-soft">
//                             START
//                         </button>
//                     </div>
//                 </div>
//             </div>
//
//             {/* Progress */}
//             <div className="bg-surface-lvl1 border border-surface-border rounded-soft p-6 mb-8">
//                 <div className="flex justify-between items-end mb-2">
//                     <h4 className="font-mono text-[10px] font-bold text-white/40 tracking-widest uppercase">WEEKLY PROGRESS</h4>
//                     <div className="flex items-center gap-1 text-primary">
//                         <TrendingUp size={14} />
//                         <span className="font-sans font-bold">+2.1</span>
//                     </div>
//                 </div>
//                 <div className="flex items-baseline gap-1 mb-3">
//                     <span className="text-2xl font-black italic">12.4</span>
//                     <span className="text-white/40 font-bold">mi</span>
//                 </div>
//                 <div className="h-1.5 bg-surface-lvl2 overflow-hidden mb-2">
//                     <div className="h-full bg-primary w-[65%]" />
//                 </div>
//                 <span className="text-[10px] font-bold text-white/40 tracking-widest">65% OF WEEKLY GOAL</span>
//
//                 <div className="mt-8 pt-6 border-t border-surface-border">
//                     <h4 className="font-mono text-[10px] font-bold text-white/40 tracking-widest uppercase mb-4">NEXT DRILL</h4>
//                     <div className="flex items-center gap-4">
//                         <div className="w-12 h-12 bg-surface-lvl2 rounded-soft flex items-center justify-center text-primary">
//                             <Target size={24} />
//                         </div>
//                         <div>
//                             <p className="font-bold">Dynamic Stretching</p>
//                             <p className="text-white/40 text-xs">Mobility • 10 Min</p>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//
//             {/* All Workouts */}
//             <div className="flex justify-between items-center mb-6">
//                 <h3 className="text-2xl font-black italic">All Workouts</h3>
//                 <button className="text-primary font-mono text-[10px] font-bold tracking-widest uppercase hover:underline">VIEW ALL</button>
//             </div>
//
//             <div className="space-y-6">
//                 {[
//                     { title: 'A-Skips & High Knees', type: 'WARM-UP', duration: '15 MIN', level: 'EASY', img: 'https://picsum.photos/seed/drill1/400/300' },
//                     { title: 'Tempo Run (Threshold)', type: 'ENDURANCE', duration: '60 MIN', level: 'MEDIUM', color: 'text-primary', img: 'https://picsum.photos/seed/drill2/400/300' },
//                     { title: 'Hip Flexor Flow', type: 'MOBILITY', duration: '20 MIN', level: 'EASY', img: 'https://picsum.photos/seed/drill3/400/300' },
//                     { title: 'Hill Repeats', type: 'SPEED', duration: '35 MIN', level: 'HARD', color: 'text-red-500', img: 'https://picsum.photos/seed/drill4/400/300' },
//                 ].map((item, i) => (
//                     <div key={i} className="bg-surface-lvl1 border border-surface-border rounded-soft overflow-hidden">
//                         <div className="aspect-[16/9] relative">
//                             <img src={item.img} alt={item.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
//                             <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-2 py-1 border border-white/20">
//                                 <span className="text-[10px] font-bold tracking-widest uppercase">{item.type}</span>
//                             </div>
//                         </div>
//                         <div className="p-4">
//                             <h4 className="text-lg font-bold mb-1">{item.title}</h4>
//                             <p className="text-white/40 text-xs mb-4">Essential dynamic movements to activate glutes and perfect form.</p>
//                             <div className="flex justify-between items-center">
//                                 <div className="flex items-center gap-1 text-white/60">
//                                     <Timer size={12} />
//                                     <span className="text-[10px] font-bold uppercase">{item.duration}</span>
//                                 </div>
//                                 <span className={`text-[10px] font-bold uppercase tracking-widest ${item.color || 'text-white/60'}`}>{item.level}</span>
//                             </div>
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// };
//
// const ScheduleScreen = () => {
//     const days = [
//         { day: 'MON', date: 12, dot: true },
//         { day: 'TUE', date: 13, dot: true, active: true },
//         { day: 'WED', date: 14, dot: false, muted: true },
//         { day: 'THU', date: 15, dot: true },
//         { day: 'FRI', date: 16, dot: false, muted: true },
//         { day: 'SAT', date: 17, dot: true },
//         { day: 'SUN', date: 18, dot: false, muted: true },
//     ];
//
//     return (
//         <div className="pt-24 px-6 pb-24">
//             <div className="flex justify-between items-end mb-6">
//                 <div>
//                     <h2 className="text-5xl font-extrabold tracking-tight">RUN SCHEDULE</h2>
//                     <p className="text-white/40 font-bold uppercase text-xs tracking-widest mt-1">Next 7 Days</p>
//                 </div>
//                 <button className="bg-primary text-black px-4 py-2 flex items-center gap-2 font-black uppercase text-[10px] tracking-widest rounded-soft">
//                     <Plus size={16} /> NEW RUN
//                 </button>
//             </div>
//
//             {/* Calendar */}
//             <div className="grid grid-cols-7 gap-2 mb-8">
//                 {days.map((item, i) => (
//                     <div
//                         key={i}
//                         className={`flex flex-col items-center py-4 rounded-soft border transition-all ${item.active ? 'bg-surface-lvl2 border-primary scale-105' : 'bg-surface-lvl1 border-surface-border'} ${item.muted ? 'opacity-40' : ''}`}
//                     >
//                         <span className={`font-mono text-[10px] font-bold tracking-widest mb-2 ${item.active ? 'text-primary' : 'text-white/40'}`}>{item.day}</span>
//                         <span className={`text-2xl font-black ${item.active ? 'text-white' : 'text-white/80'}`}>{item.date}</span>
//                         {item.dot && <div className="mt-2 w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_8px_rgba(255,95,0,0.8)]" />}
//                     </div>
//                 ))}
//             </div>
//
//             {/* Planned Runs */}
//             <div className="space-y-4">
//                 {/* Track Intervals */}
//                 <div className="bg-surface-lvl1 border-l-4 border-primary rounded-r-soft p-6">
//                     <div className="flex justify-between items-start mb-4">
//                         <div>
//                             <div className="bg-surface-lvl2 text-white text-[10px] font-bold px-2 py-1 border border-white/10 rounded mb-2 inline-block uppercase tracking-widest">TODAY • 6:00 PM</div>
//                             <h3 className="text-3xl font-black">Track Intervals</h3>
//                         </div>
//                         <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }}>
//                             <Timer size={32} className="text-primary" />
//                         </motion.div>
//                     </div>
//
//                     <div className="grid grid-cols-3 gap-6 py-6 border-y border-white/5 mb-4">
//                         <div>
//                             <p className="text-[10px] font-bold text-white/40 tracking-widest mb-1 uppercase">DISTANCE</p>
//                             <p className="text-2xl font-black italic">8.0 <span className="text-sm font-bold text-white/40">km</span></p>
//                         </div>
//                         <div>
//                             <p className="text-[10px] font-bold text-white/40 tracking-widest mb-1 uppercase">TARGET PACE</p>
//                             <p className="text-2xl font-black italic">4:15 <span className="text-sm font-bold text-white/40">/km</span></p>
//                         </div>
//                         <div>
//                             <p className="text-[10px] font-bold text-white/40 tracking-widest mb-1 uppercase">DURATION</p>
//                             <p className="text-2xl font-black italic">45 <span className="text-sm font-bold text-white/40">min</span></p>
//                         </div>
//                     </div>
//
//                     <div className="flex items-center gap-3">
//                         <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Workout:</span>
//                         <div className="flex-1 h-2 bg-surface-lvl2 flex overflow-hidden">
//                             <div className="w-[20%] bg-white/10" />
//                             <div className="w-[50%] bg-primary" />
//                             <div className="w-[30%] bg-white/10" />
//                         </div>
//                         <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Warm/Work/Cool</span>
//                     </div>
//                 </div>
//
//                 {/* Tempo Run */}
//                 <div className="bg-surface-lvl1 border border-surface-border rounded-soft p-6 opacity-60">
//                     <div className="flex justify-between items-start mb-4">
//                         <div>
//                             <div className="bg-surface-lvl2 text-white text-[10px] font-bold px-2 py-1 border border-white/10 rounded mb-2 inline-block uppercase tracking-widest">THU • 6:30 AM</div>
//                             <h3 className="text-3xl font-black">Tempo Run</h3>
//                         </div>
//                         <Gauge size={32} className="text-white/20" />
//                     </div>
//                     <div className="grid grid-cols-3 gap-6 py-6 border-t border-white/5">
//                         <div>
//                             <p className="text-[10px] font-bold text-white/40 tracking-widest mb-1 uppercase">DISTANCE</p>
//                             <p className="text-2xl font-black italic">10.0 <span className="text-sm font-bold text-white/40">km</span></p>
//                         </div>
//                         <div>
//                             <p className="text-[10px] font-bold text-white/40 tracking-widest mb-1 uppercase">TARGET PACE</p>
//                             <p className="text-2xl font-black italic">4:40 <span className="text-sm font-bold text-white/40">/km</span></p>
//                         </div>
//                         <div>
//                             <p className="text-[10px] font-bold text-white/40 tracking-widest mb-1 uppercase">DURATION</p>
//                             <p className="text-2xl font-black italic">50 <span className="text-sm font-bold text-white/40">min</span></p>
//                         </div>
//                     </div>
//                 </div>
//
//                 {/* Weekend Long Run */}
//                 <div className="bg-surface-lvl1 border border-surface-border rounded-soft p-6 opacity-60">
//                     <div className="flex justify-between items-start mb-4">
//                         <div>
//                             <div className="bg-surface-lvl2 text-white text-[10px] font-bold px-2 py-1 border border-white/10 rounded mb-2 inline-block uppercase tracking-widest">SAT • 7:00 AM</div>
//                             <h3 className="text-3xl font-black">Weekend Long Run</h3>
//                         </div>
//                         <Navigation size={32} className="text-white/20" />
//                     </div>
//                     <div className="grid grid-cols-3 gap-6 py-6 border-t border-white/5">
//                         <div>
//                             <p className="text-[10px] font-bold text-white/40 tracking-widest mb-1 uppercase">DISTANCE</p>
//                             <p className="text-2xl font-black italic">21.1 <span className="text-sm font-bold text-white/40">km</span></p>
//                         </div>
//                         <div>
//                             <p className="text-[10px] font-bold text-white/40 tracking-widest mb-1 uppercase">TARGET PACE</p>
//                             <p className="text-2xl font-black italic">5:15 <span className="text-sm font-bold text-white/40">/km</span></p>
//                         </div>
//                         <div>
//                             <p className="text-[10px] font-bold text-white/40 tracking-widest mb-1 uppercase">DURATION</p>
//                             <p className="text-2xl font-black italic">110 <span className="text-sm font-bold text-white/40">min</span></p>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };
//
// const CoachScreen = () => {
//     const [messages, setMessages] = useState([
//         { id: 1, role: 'bot', text: "Morning. Analyzing yesterday's 18-miler. Your pace dropped by 15s/mile after mile 14. Heart rate spiked to 175bpm. We need to look at your fueling strategy for Chicago.", sender: 'Elite Coach AI' },
//         { id: 2, role: 'user', text: "I felt my form breaking down. Hips dropped." },
//         { id: 3, role: 'bot', text: "Classic sign of glute medius fatigue. Your cadence also dropped from 178 to 168. I'm injecting two focused strength sessions into this week's block. We target lateral stability.", sender: 'Elite Coach AI',
//             planUpdate: { title: "Glute Activation Protocol", action: "VIEW SESSION" }
//         },
//         { id: 4, role: 'user', text: "Will that impact my speedwork on Thursday?" },
//     ]);
//     const [input, setInput] = useState('');
//     const [isLoading, setIsLoading] = useState(false);
//
//     const handleSend = async () => {
//         if (!input.trim() || isLoading) return;
//
//         const userMsg = { id: Date.now(), role: 'user', text: input };
//         setMessages(prev => [...prev, userMsg]);
//         setInput('');
//         setIsLoading(true);
//
//         try {
//             // Симуляция ответа AI (так как API ключ не настроен)
//             await new Promise(resolve => setTimeout(resolve, 1000));
//
//             const botMsg = {
//                 id: Date.now() + 1,
//                 role: 'bot',
//                 text: `Great question. ${input} Let me analyze your training data. Based on your recent performance metrics, I recommend maintaining your current pace and focusing on recovery. Keep pushing your limits, but listen to your body.`,
//                 sender: 'Elite Coach AI'
//             };
//             setMessages(prev => [...prev, botMsg]);
//         } catch (error) {
//             console.error("Coach error:", error);
//             setMessages(prev => [...prev, { id: Date.now() + 1, role: 'bot', text: "Connection to analytics cloud interrupted. Let's maintain pace while I reconnect.", sender: 'Elite Coach AI' }]);
//         } finally {
//             setIsLoading(false);
//         }
//     };
//
//     return (
//         <div className="min-h-screen flex flex-col pt-20 pb-[100px]">
//             {/* Coach Header */}
//             <div className="px-6 py-4 bg-surface-lvl1 border-b border-surface-border">
//                 <div className="flex items-center gap-4">
//                     <div className="w-14 h-14 bg-primary flex items-center justify-center rounded-soft text-black">
//                         <MessageSquare size={28} />
//                     </div>
//                     <div>
//                         <h2 className="text-2xl font-black italic">Elite Coach AI</h2>
//                         <p className="text-white/40 text-xs font-bold uppercase tracking-widest">Specialty: Marathon Prep & Biomechanics</p>
//                     </div>
//                 </div>
//             </div>
//
//             {/* Chat Area */}
//             <div className="flex-1 overflow-y-auto p-6 space-y-6">
//                 <div className="text-center">
//                     <span className="font-mono text-[10px] font-bold text-white/20 tracking-widest uppercase">TODAY, 06:00 AM</span>
//                 </div>
//
//                 {messages.map((m) => (
//                     <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} gap-3`}>
//                         {m.role === 'bot' && (
//                             <div className="w-8 h-8 bg-surface-lvl2 flex items-center justify-center rounded text-white/40 mt-1 shrink-0">
//                                 <MessageSquare size={14} />
//                             </div>
//                         )}
//                         <div className="max-w-[80%] space-y-2">
//                             <div className={`${m.role === 'user' ? 'bg-[#333333]' : 'bg-surface-lvl1'} border border-surface-border p-4 rounded-soft`}>
//                                 <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.text}</p>
//
//                                 {m.planUpdate && (
//                                     <div className="mt-4 pt-4 border-t border-white/5">
//                                         <div className="flex items-center justify-between mb-3">
//                                             <span className="text-primary text-[10px] font-black tracking-widest uppercase">PLAN UPDATE</span>
//                                             <Target size={14} className="text-primary" />
//                                         </div>
//                                         <p className="text-xs font-bold mb-4">Added: {m.planUpdate.title}</p>
//                                         <button className="w-full py-2 bg-surface-lvl2 border border-white/10 text-white font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 hover:bg-white/10 transition-colors">
//                                             {m.planUpdate.action} <ArrowRight size={12} />
//                                         </button>
//                                     </div>
//                                 )}
//                             </div>
//                         </div>
//                         {m.role === 'user' && (
//                             <div className="w-8 h-8 bg-primary flex items-center justify-center rounded text-black mt-1 shrink-0 shadow-lg shadow-primary/20">
//                                 <User size={14} />
//                             </div>
//                         )}
//                     </div>
//                 ))}
//
//                 {isLoading && (
//                     <div className="flex justify-start gap-3">
//                         <div className="w-8 h-8 bg-surface-lvl2 flex items-center justify-center rounded text-white/40 mt-1 shrink-0">
//                             <MessageSquare size={14} />
//                         </div>
//                         <div className="bg-surface-lvl1 border border-surface-border p-3 rounded-soft flex gap-1">
//                             <motion.div
//                                 animate={{ scale: [1, 1.5, 1] }}
//                                 transition={{ repeat: Infinity, duration: 1 }}
//                                 className="w-1.5 h-1.5 bg-primary rounded-full"
//                             />
//                             <motion.div
//                                 animate={{ scale: [1, 1.5, 1] }}
//                                 transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
//                                 className="w-1.5 h-1.5 bg-primary/60 rounded-full"
//                             />
//                             <motion.div
//                                 animate={{ scale: [1, 1.5, 1] }}
//                                 transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
//                                 className="w-1.5 h-1.5 bg-primary/30 rounded-full"
//                             />
//                         </div>
//                     </div>
//                 )}
//             </div>
//
//             {/* Input Area */}
//             <div className="fixed bottom-24 left-6 right-6 z-50">
//                 <div className="bg-surface-lvl1 border border-primary p-2 flex items-center gap-2 shadow-2xl shadow-black rounded-soft">
//                     <button className="w-10 h-10 flex items-center justify-center text-white/40 hover:text-white transition-colors">
//                         <Plus size={20} />
//                     </button>
//                     <input
//                         type="text"
//                         placeholder="Ask about pace, form, or schedule..."
//                         className="flex-1 bg-transparent border-none outline-none text-sm placeholder:text-white/20"
//                         value={input}
//                         onChange={(e) => setInput(e.target.value)}
//                         onKeyDown={(e) => e.key === 'Enter' && handleSend()}
//                     />
//                     <button
//                         onClick={handleSend}
//                         disabled={isLoading}
//                         className="w-12 h-10 bg-primary text-black flex items-center justify-center hover:bg-opacity-90 transition-colors rounded-soft disabled:opacity-50"
//                     >
//                         {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} fill="black" />}
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };
//
// // --- Main App ---
//
// export default function App() {
//     const [currentScreen, setCurrentScreen] = useState<ScreenType>('run');
//     const [showSubscription, setShowSubscription] = useState(false);
//
//     return (
//         <div className="min-h-screen bg-background selection:bg-primary selection:text-black">
//             <Header title="Apex Vitality" />
//
//             <main className="max-w-md mx-auto">
//                 <AnimatePresence mode="wait">
//                     {currentScreen === 'run' && (
//                         <motion.div
//                             key="run"
//                             initial={{ opacity: 0, x: -20 }}
//                             animate={{ opacity: 1, x: 0 }}
//                             exit={{ opacity: 0, x: 20 }}
//                         >
//                             <RunScreen />
//                         </motion.div>
//                     )}
//                     {currentScreen === 'schedule' && (
//                         <motion.div
//                             key="schedule"
//                             initial={{ opacity: 0, x: -20 }}
//                             animate={{ opacity: 1, x: 0 }}
//                             exit={{ opacity: 0, x: 20 }}
//                         >
//                             <ScheduleScreen />
//                         </motion.div>
//                     )}
//                     {currentScreen === 'coach' && (
//                         <motion.div
//                             key="coach"
//                             initial={{ opacity: 0, x: -20 }}
//                             animate={{ opacity: 1, x: 0 }}
//                             exit={{ opacity: 0, x: 20 }}
//                         >
//                             <CoachScreen />
//                         </motion.div>
//                     )}
//                     {currentScreen === 'profile' && (
//                         <motion.div
//                             key="profile"
//                             initial={{ opacity: 0, scale: 0.95 }}
//                             animate={{ opacity: 1, scale: 1 }}
//                             className="pt-32 px-6 flex flex-col items-center text-center"
//                         >
//                             <div className="w-24 h-24 bg-surface-lvl2 border-2 border-primary p-1 rounded-full mb-6">
//                                 <div className="w-full h-full bg-surface-lvl1 rounded-full flex items-center justify-center">
//                                     <User size={48} className="text-primary" />
//                                 </div>
//                             </div>
//                             <h2 className="text-3xl font-black italic">ELITE RUNNER</h2>
//                             <p className="text-white/40 font-bold uppercase text-xs tracking-widest mt-1 mb-8">Chicago Marathon Prep Block</p>
//
//                             <div className="w-full grid grid-cols-2 gap-4 mb-8">
//                                 <div className="bg-surface-lvl1 p-4 rounded-soft border border-surface-border text-left">
//                                     <p className="text-[10px] font-bold text-white/40 tracking-widest uppercase mb-1">CURRENT RANK</p>
//                                     <p className="font-sans font-black italic text-xl text-primary">ELITE III</p>
//                                 </div>
//                                 <div className="bg-surface-lvl1 p-4 rounded-soft border border-surface-border text-left">
//                                     <p className="text-[10px] font-bold text-white/40 tracking-widest uppercase mb-1">TOTAL MILES</p>
//                                     <p className="font-sans font-black italic text-xl">1,248.5</p>
//                                 </div>
//                             </div>
//
//                             <div className="w-full space-y-2">
//                                 <button
//                                     onClick={() => setShowSubscription(true)}
//                                     className="w-full bg-primary text-black py-4 font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 rounded-soft"
//                                 >
//                                     UPGRADE PLAN <ArrowRight size={14} />
//                                 </button>
//                                 <button className="w-full bg-surface-lvl1 text-white py-4 font-black uppercase tracking-widest text-xs border border-surface-border rounded-soft">
//                                     SETTINGS
//                                 </button>
//                             </div>
//                         </motion.div>
//                     )}
//                 </AnimatePresence>
//             </main>
//
//             <AnimatePresence>
//                 {showSubscription && (
//                     <SubscriptionScreen onClose={() => setShowSubscription(false)} />
//                 )}
//             </AnimatePresence>
//
//             <NavBar active={currentScreen} onChange={setCurrentScreen} />
//         </div>
//     );
// }
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
    Dumbbell,
    Calendar,
    MessageSquare,
    User,
    Bell,
    Plus,
    Timer,
    Gauge,
    Navigation,
    Check,
    Zap,
    ArrowRight,
    TrendingUp,
    Target,
    ChevronRight,
    X,
    Send,
    Loader2
} from 'lucide-react';
// import { GoogleGenAI } from "@google/genai"; // Закомментировано, так как API ключ не настроен

// --- Types ---

type ScreenType = 'run' | 'schedule' | 'coach' | 'profile' | 'subscription';

// --- Shared Components ---

const NavBar = ({ active, onChange }: { active: ScreenType, onChange: (s: ScreenType) => void }) => {
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
                    className={`flex flex-col items-center gap-1 transition-colors ${active === id ? 'text-primary' : 'text-white/40'}`}
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

const Header = ({ title }: { title: string }) => (
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

// --- Screen Components ---

const SubscriptionScreen = ({ onClose }: { onClose: () => void }) => {
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
                <h2 className="font-sans font-extrabold text-4xl tracking-tight leading-none mb-4">ПОВЫСЬ СВОЙ ТЕМП</h2>
                <p className="text-white/60 text-sm leading-relaxed">
                    Выберите план, соответствующий вашим амбициям. Откройте доступ к продвинутой аналитике, персонализированным тренировкам и инсайтам для улучшения личных рекордов.
                </p>
            </div>

            <div className="space-y-4">
                {/* Базовый план */}
                <div className="bg-surface-lvl1 border border-surface-border rounded-soft p-6">
                    <span className="inline-block bg-surface-lvl2 text-white text-[10px] font-bold px-2 py-0.5 rounded-full mb-3 tracking-widest uppercase">БАЗОВЫЙ</span>
                    <h3 className="text-2xl font-bold mb-1">Бесплатный</h3>
                    <p className="text-white/60 text-sm mb-4">Базовый трекинг для любителей.</p>
                    <div className="flex items-baseline gap-1 mb-6">
                        <span className="text-3xl font-bold">$0</span>
                        <span className="text-white/40 text-sm">/мес</span>
                    </div>
                    <ul className="space-y-3 mb-8">
                        <li className="flex items-center gap-3 text-sm"><Check size={16} className="text-primary" /> GPS-трекинг забегов</li>
                        <li className="flex items-center gap-3 text-sm"><Check size={16} className="text-primary" /> Базовый темп и дистанция</li>
                        <li className="flex items-center gap-3 text-sm"><Check size={16} className="text-primary" /> Таблицы лидеров сообщества</li>
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
                        <span className="text-primary text-[10px] font-bold tracking-widest uppercase">ПРО БЕГУН</span>
                    </div>
                    <h3 className="text-2xl font-bold mb-1">Элитный бегун</h3>
                    <p className="text-white/60 text-sm mb-4">Продвинутая метрика для серьёзных тренировок.</p>
                    <div className="flex items-baseline gap-1 mb-6">
                        <span className="text-3xl font-bold">$14.99</span>
                        <span className="text-white/40 text-sm">/мес</span>
                    </div>
                    <ul className="space-y-3 mb-8">
                        <li className="flex items-center gap-3 text-sm font-bold"><Check size={16} className="text-primary" /> Всё из Бесплатного</li>
                        <li className="flex items-center gap-3 text-sm"><Check size={16} className="text-primary" /> Продвинутая аналитика (МПК)</li>
                        <li className="flex items-center gap-3 text-sm"><Check size={16} className="text-primary" /> Тренировочные планы от ИИ</li>
                        <li className="flex items-center gap-3 text-sm"><Check size={16} className="text-primary" /> Живое аудио сопровождение</li>
                    </ul>
                    <button className="w-full py-3 bg-primary text-black font-black uppercase tracking-widest text-xs hover:bg-opacity-90 transition-colors shadow-lg shadow-primary/20 rounded-soft">
                        Перейти на Pro
                    </button>
                </div>

                {/* Элитный план */}
                <div className="bg-surface-lvl1 border border-surface-border rounded-soft p-6">
                    <span className="inline-block bg-surface-lvl2 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full mb-3 tracking-widest uppercase">ПРЕМИУМ</span>
                    <h3 className="text-2xl font-bold mb-1">Элитный атлет</h3>
                    <p className="text-white/60 text-sm mb-4">Максимальный пакет производительности.</p>
                    <div className="flex items-baseline gap-1 mb-6">
                        <span className="text-3xl font-bold">$49.99</span>
                        <span className="text-white/40 text-sm">/мес</span>
                    </div>
                    <ul className="space-y-3 mb-8">
                        <li className="flex items-center gap-3 text-sm font-bold"><Check size={16} className="text-primary" /> Всё из Pro</li>
                        <li className="flex items-center gap-3 text-sm"><Check size={16} className="text-primary" /> Анализ с живым тренером 1-на-1</li>
                        <li className="flex items-center gap-3 text-sm"><Check size={16} className="text-primary" /> Видео-анализ техники бега</li>
                        <li className="flex items-center gap-3 text-sm"><Check size={16} className="text-primary" /> Планирование гоночной стратегии</li>
                    </ul>
                    <button className="w-full py-3 border border-primary text-primary font-bold uppercase tracking-widest text-xs hover:bg-primary hover:text-black transition-colors rounded-soft">
                        Стать Элитным
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

const RunScreen = () => {
    const categories = ['ВСЕ', 'СКОРОСТЬ', 'ВЫНОСЛИВОСТЬ'];
    const [activeCat, setActiveCat] = useState('ВСЕ');

    return (
        <div className="pt-24 px-6 pb-24">
            <div className="flex gap-2 mb-6">
                <span className="bg-surface-lvl2 text-white text-[10px] font-bold px-3 py-1 rounded tracking-widest uppercase">БИБЛИОТЕКА</span>
                <span className="bg-primary/20 text-primary text-[10px] font-bold px-3 py-1 rounded tracking-widest uppercase">PRO ДОСТУП</span>
            </div>

            <h2 className="text-4xl font-extrabold tracking-tight mb-2">Беговые упражнения и тренировки</h2>
            <p className="text-white/60 text-sm mb-8">Тренировки высокой точности для улучшения скорости, выносливости и техники бега.</p>

            {/* Категории */}
            <div className="flex gap-2 mb-8">
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setActiveCat(cat)}
                        className={`px-4 py-2 font-mono text-[10px] font-bold tracking-widest transition-colors ${activeCat === cat ? 'bg-primary text-black' : 'bg-surface-lvl2 text-white/60'}`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Основные упражнения */}
            <div className="bg-surface-lvl1 border border-surface-border rounded-soft overflow-hidden mb-6 relative min-h-[300px] flex flex-col justify-end p-6">
                <img
                    src="https://picsum.photos/seed/athlete1/800/600"
                    alt="Бегун"
                    className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay"
                    referrerPolicy="no-referrer"
                />
                <div className="relative z-10">
                    <div className="flex gap-2 mb-3">
                        <span className="bg-surface-lvl2 text-white text-[10px] font-bold px-2 py-0.5 border border-white/20 uppercase">СКОРОСТЬ</span>
                        <span className="bg-primary text-black text-[10px] font-black px-2 py-0.5 flex items-center gap-1 uppercase">
              <Zap size={10} fill="black" /> ВЫСОКАЯ
             </span>
                    </div>
                    <h3 className="text-3xl font-black mb-2">400м Повторы на дорожке</h3>
                    <p className="text-white/70 text-sm mb-6 max-w-xs">Высокоинтенсивные интервалы для увеличения МПК и анаэробного порога. Увеличьте темп на прямых.</p>

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
                    <h4 className="font-mono text-[10px] font-bold text-white/40 tracking-widest uppercase">НЕДЕЛЬНЫЙ ПРОГРЕСС</h4>
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
                <span className="text-[10px] font-bold text-white/40 tracking-widest">65% ОТ НЕДЕЛЬНОЙ ЦЕЛИ</span>

                <div className="mt-8 pt-6 border-t border-surface-border">
                    <h4 className="font-mono text-[10px] font-bold text-white/40 tracking-widest uppercase mb-4">СЛЕДУЮЩАЯ ТРЕНИРОВКА</h4>
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
                <button className="text-primary font-mono text-[10px] font-bold tracking-widest uppercase hover:underline">ВСЕ</button>
            </div>

            <div className="space-y-6">
                {[
                    { title: 'Высокое Поднимание Колен', type: 'РАЗМИНКА', duration: '15 МИН', level: 'ЛЕГКО', img: 'https://picsum.photos/seed/drill1/400/300' },
                    { title: 'Темповая тренировка (Пороговая)', type: 'ВЫНОСЛИВОСТЬ', duration: '60 МИН', level: 'СРЕДНЕ', color: 'text-primary', img: 'https://picsum.photos/seed/drill2/400/300' },
                    { title: 'Флоу для Сгибателей Бедра', type: 'МОБИЛЬНОСТЬ', duration: '20 МИН', level: 'ЛЕГКО', img: 'https://picsum.photos/seed/drill3/400/300' },
                    { title: 'Повторы в гору', type: 'СКОРОСТЬ', duration: '35 МИН', level: 'ТЯЖЕЛО', color: 'text-red-500', img: 'https://picsum.photos/seed/drill4/400/300' },
                ].map((item, i) => (
                    <div key={i} className="bg-surface-lvl1 border border-surface-border rounded-soft overflow-hidden">
                        <div className="aspect-[16/9] relative">
                            <img src={item.img} alt={item.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-2 py-1 border border-white/20">
                                <span className="text-[10px] font-bold tracking-widest uppercase">{item.type}</span>
                            </div>
                        </div>
                        <div className="p-4">
                            <h4 className="text-lg font-bold mb-1">{item.title}</h4>
                            <p className="text-white/40 text-xs mb-4">Базовые динамические движения для активации ягодиц и идеальной формы.</p>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-1 text-white/60">
                                    <Timer size={12} />
                                    <span className="text-[10px] font-bold uppercase">{item.duration}</span>
                                </div>
                                <span className={`text-[10px] font-bold uppercase tracking-widest ${item.color || 'text-white/60'}`}>{item.level}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const ScheduleScreen = () => {
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
                    <p className="text-white/40 font-bold uppercase text-xs tracking-widest mt-1">Следующие 7 дней</p>
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
                        className={`flex flex-col items-center py-4 rounded-soft border transition-all ${item.active ? 'bg-surface-lvl2 border-primary scale-105' : 'bg-surface-lvl1 border-surface-border'} ${item.muted ? 'opacity-40' : ''}`}
                    >
                        <span className={`font-mono text-[10px] font-bold tracking-widest mb-2 ${item.active ? 'text-primary' : 'text-white/40'}`}>{item.day}</span>
                        <span className={`text-2xl font-black ${item.active ? 'text-white' : 'text-white/80'}`}>{item.date}</span>
                        {item.dot && <div className="mt-2 w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_8px_rgba(255,95,0,0.8)]" />}
                    </div>
                ))}
            </div>

            {/* Запланированные забеги */}
            <div className="space-y-4">
                {/* Трековые интервалы */}
                <div className="bg-surface-lvl1 border-l-4 border-primary rounded-r-soft p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <div className="bg-surface-lvl2 text-white text-[10px] font-bold px-2 py-1 border border-white/10 rounded mb-2 inline-block uppercase tracking-widest">СЕГОДНЯ • 18:00</div>
                            <h3 className="text-3xl font-black">Трековые интервалы</h3>
                        </div>
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }}>
                            <Timer size={32} className="text-primary" />
                        </motion.div>
                    </div>

                    <div className="grid grid-cols-3 gap-6 py-6 border-y border-white/5 mb-4">
                        <div>
                            <p className="text-[10px] font-bold text-white/40 tracking-widest mb-1 uppercase">ДИСТАНЦИЯ</p>
                            <p className="text-2xl font-black italic">8.0 <span className="text-sm font-bold text-white/40">км</span></p>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-white/40 tracking-widest mb-1 uppercase">ЦЕЛЕВОЙ ТЕМП</p>
                            <p className="text-2xl font-black italic">4:15 <span className="text-sm font-bold text-white/40">/км</span></p>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-white/40 tracking-widest mb-1 uppercase">ДЛИТЕЛЬНОСТЬ</p>
                            <p className="text-2xl font-black italic">45 <span className="text-sm font-bold text-white/40">мин</span></p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Тренировка:</span>
                        <div className="flex-1 h-2 bg-surface-lvl2 flex overflow-hidden">
                            <div className="w-[20%] bg-white/10" />
                            <div className="w-[50%] bg-primary" />
                            <div className="w-[30%] bg-white/10" />
                        </div>
                        <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Размин/Работа/Замин</span>
                    </div>
                </div>

                {/* Темповая тренировка */}
                <div className="bg-surface-lvl1 border border-surface-border rounded-soft p-6 opacity-60">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <div className="bg-surface-lvl2 text-white text-[10px] font-bold px-2 py-1 border border-white/10 rounded mb-2 inline-block uppercase tracking-widest">ЧТ • 6:30</div>
                            <h3 className="text-3xl font-black">Темповая тренировка</h3>
                        </div>
                        <Gauge size={32} className="text-white/20" />
                    </div>
                    <div className="grid grid-cols-3 gap-6 py-6 border-t border-white/5">
                        <div>
                            <p className="text-[10px] font-bold text-white/40 tracking-widest mb-1 uppercase">ДИСТАНЦИЯ</p>
                            <p className="text-2xl font-black italic">10.0 <span className="text-sm font-bold text-white/40">км</span></p>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-white/40 tracking-widest mb-1 uppercase">ЦЕЛЕВОЙ ТЕМП</p>
                            <p className="text-2xl font-black italic">4:40 <span className="text-sm font-bold text-white/40">/км</span></p>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-white/40 tracking-widest mb-1 uppercase">ДЛИТЕЛЬНОСТЬ</p>
                            <p className="text-2xl font-black italic">50 <span className="text-sm font-bold text-white/40">мин</span></p>
                        </div>
                    </div>
                </div>

                {/* Длинная выходная тренировка */}
                <div className="bg-surface-lvl1 border border-surface-border rounded-soft p-6 opacity-60">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <div className="bg-surface-lvl2 text-white text-[10px] font-bold px-2 py-1 border border-white/10 rounded mb-2 inline-block uppercase tracking-widest">СБ • 7:00</div>
                            <h3 className="text-3xl font-black">Длинная тренировка</h3>
                        </div>
                        <Navigation size={32} className="text-white/20" />
                    </div>
                    <div className="grid grid-cols-3 gap-6 py-6 border-t border-white/5">
                        <div>
                            <p className="text-[10px] font-bold text-white/40 tracking-widest mb-1 uppercase">ДИСТАНЦИЯ</p>
                            <p className="text-2xl font-black italic">21.1 <span className="text-sm font-bold text-white/40">км</span></p>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-white/40 tracking-widest mb-1 uppercase">ЦЕЛЕВОЙ ТЕМП</p>
                            <p className="text-2xl font-black italic">5:15 <span className="text-sm font-bold text-white/40">/км</span></p>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-white/40 tracking-widest mb-1 uppercase">ДЛИТЕЛЬНОСТЬ</p>
                            <p className="text-2xl font-black italic">110 <span className="text-sm font-bold text-white/40">мин</span></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const CoachScreen = () => {
    const [messages, setMessages] = useState([
        { id: 1, role: 'bot', text: "Доброе утро. Анализирую вчерашний 30-километровый забег. Ваш темп упал на 15с/км после 22-го километра. Частота пульса подскочила до 175 ударов. Нужно пересмотреть стратегию питания для Чикаго.", sender: 'Элитный Тренер ИИ' },
        { id: 2, role: 'user', text: "Я чувствовал, что техника ломается. Бёдра опускались." },
        { id: 3, role: 'bot', text: "Классический признак усталости средней ягодичной мышцы. Ваш каденс упал со 178 до 168. Добавляю две целенаправленные силовые сессии в этот тренировочный блок. Работаем над боковой стабилизацией.", sender: 'Элитный Тренер ИИ',
            planUpdate: { title: "Протокол активации ягодиц", action: "ПОСМОТРЕТЬ СЕССИЮ" }
        },
        { id: 4, role: 'user', text: "Это повлияет на мою скоростную тренировку в четверг?" },
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMsg = { id: Date.now(), role: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            // Симуляция ответа AI (так как API ключ не настроен)
            await new Promise(resolve => setTimeout(resolve, 1000));

            const botMsg = {
                id: Date.now() + 1,
                role: 'bot',
                text: `Отличный вопрос. ${input} Давайте проанализируем ваши тренировочные данные. Основываясь на ваших недавних показателях, я рекомендую поддерживать текущий темп и сосредоточиться на восстановлении. Продолжайте расширять свои границы, но прислушивайтесь к телу.`,
                sender: 'Элитный Тренер ИИ'
            };
            setMessages(prev => [...prev, botMsg]);
        } catch (error) {
            console.error("Coach error:", error);
            setMessages(prev => [...prev, { id: Date.now() + 1, role: 'bot', text: "Соединение с облаком аналитики прервано. Давайте сохраним текущий темп, пока я переподключаюсь.", sender: 'Элитный Тренер ИИ' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col pt-20 pb-[100px]">
            {/* Шапка тренера */}
            <div className="px-6 py-4 bg-surface-lvl1 border-b border-surface-border">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-primary flex items-center justify-center rounded-soft text-black">
                        <MessageSquare size={28} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black italic">Элитный Тренер ИИ</h2>
                        <p className="text-white/40 text-xs font-bold uppercase tracking-widest">Специализация: Подготовка к марафону и биомеханика</p>
                    </div>
                </div>
            </div>

            {/* Область чата */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="text-center">
                    <span className="font-mono text-[10px] font-bold text-white/20 tracking-widest uppercase">СЕГОДНЯ, 06:00</span>
                </div>

                {messages.map((m) => (
                    <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} gap-3`}>
                        {m.role === 'bot' && (
                            <div className="w-8 h-8 bg-surface-lvl2 flex items-center justify-center rounded text-white/40 mt-1 shrink-0">
                                <MessageSquare size={14} />
                            </div>
                        )}
                        <div className="max-w-[80%] space-y-2">
                            <div className={`${m.role === 'user' ? 'bg-[#333333]' : 'bg-surface-lvl1'} border border-surface-border p-4 rounded-soft`}>
                                <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.text}</p>

                                {m.planUpdate && (
                                    <div className="mt-4 pt-4 border-t border-white/5">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-primary text-[10px] font-black tracking-widest uppercase">ОБНОВЛЕНИЕ ПЛАНА</span>
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

            {/* Область ввода */}
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
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
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

// --- Main App ---

export default function App() {
    const [currentScreen, setCurrentScreen] = useState<ScreenType>('run');
    const [showSubscription, setShowSubscription] = useState(false);

    return (
        <div className="min-h-screen bg-background selection:bg-primary selection:text-black">
            <Header title="Just go" />

            <main className="max-w-md mx-auto">
                <AnimatePresence mode="wait">
                    {currentScreen === 'run' && (
                        <motion.div
                            key="run"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                        >
                            <RunScreen />
                        </motion.div>
                    )}
                    {currentScreen === 'schedule' && (
                        <motion.div
                            key="schedule"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                        >
                            <ScheduleScreen />
                        </motion.div>
                    )}
                    {currentScreen === 'coach' && (
                        <motion.div
                            key="coach"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                        >
                            <CoachScreen />
                        </motion.div>
                    )}
                    {currentScreen === 'profile' && (
                        <motion.div
                            key="profile"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="pt-32 px-6 flex flex-col items-center text-center"
                        >
                            <div className="w-24 h-24 bg-surface-lvl2 border-2 border-primary p-1 rounded-full mb-6">
                                <div className="w-full h-full bg-surface-lvl1 rounded-full flex items-center justify-center">
                                    <User size={48} className="text-primary" />
                                </div>
                            </div>
                            <h2 className="text-3xl font-black italic">ЭЛИТНЫЙ БЕГУН</h2>
                            <p className="text-white/40 font-bold uppercase text-xs tracking-widest mt-1 mb-8">Блок подготовки к марафону в Чикаго</p>

                            <div className="w-full grid grid-cols-2 gap-4 mb-8">
                                <div className="bg-surface-lvl1 p-4 rounded-soft border border-surface-border text-left">
                                    <p className="text-[10px] font-bold text-white/40 tracking-widest uppercase mb-1">ТЕКУЩИЙ РАНГ</p>
                                    <p className="font-sans font-black italic text-xl text-primary">ЭЛИТА III</p>
                                </div>
                                <div className="bg-surface-lvl1 p-4 rounded-soft border border-surface-border text-left">
                                    <p className="text-[10px] font-bold text-white/40 tracking-widest uppercase mb-1">ОБЩИЙ КИЛОМЕТРАЖ</p>
                                    <p className="font-sans font-black italic text-xl">1,248.5</p>
                                </div>
                            </div>

                            <div className="w-full space-y-2">
                                <button
                                    onClick={() => setShowSubscription(true)}
                                    className="w-full bg-primary text-black py-4 font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 rounded-soft"
                                >
                                    ПОВЫСИТЬ ПЛАН <ArrowRight size={14} />
                                </button>
                                <button className="w-full bg-surface-lvl1 text-white py-4 font-black uppercase tracking-widest text-xs border border-surface-border rounded-soft">
                                    НАСТРОЙКИ
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            <AnimatePresence>
                {showSubscription && (
                    <SubscriptionScreen onClose={() => setShowSubscription(false)} />
                )}
            </AnimatePresence>

            <NavBar active={currentScreen} onChange={setCurrentScreen} />
        </div>
    );
}
