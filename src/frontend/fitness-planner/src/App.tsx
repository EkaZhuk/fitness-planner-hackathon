import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Header } from './components/Navigation/Header';
import { NavBar } from './components/Navigation/NavBar';
import { SubscriptionScreen } from './components/Subscription/SubscriptionScreen';
import { RunScreen } from './pages/RunScreen/RunScreen';
import { ScheduleScreen } from './pages/ScheduleScreen/ScheduleScreen';
import { CoachScreen } from './pages/CoachScreen/CoachScreen';
import { ProfileScreen } from './pages/ProfileScreen/ProfileScreen';
import { ScreenType } from './types';

export default function App() {
    const [currentScreen, setCurrentScreen] = useState<ScreenType>('run');
    const [showSubscription, setShowSubscription] = useState(false);

    return (
        <div className="min-h-screen bg-background selection:bg-primary selection:text-black">
            <Header />

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
                        >
                            <ProfileScreen onUpgradePress={() => setShowSubscription(true)} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            <AnimatePresence>
                {showSubscription && <SubscriptionScreen onClose={() => setShowSubscription(false)} />}
            </AnimatePresence>

            <NavBar active={currentScreen} onChange={setCurrentScreen} />
        </div>
    );
}
