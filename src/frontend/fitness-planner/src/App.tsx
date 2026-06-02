// App.tsx (обновленная версия с авторизацией)
import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Header } from './components/Navigation/Header';
import { NavBar } from './components/Navigation/NavBar';
import { SubscriptionScreen } from './components/Subscription/SubscriptionScreen';
import { LoginScreen } from './pages/LoginScreen/LoginScreen';
import { RegisterScreen } from './pages/RegisterScreen/RegisterScreen';
import { RunScreen } from './pages/RunScreen/RunScreen';
import { ScheduleScreen } from './pages/ScheduleScreen/ScheduleScreen';
import { CoachScreen } from './pages/CoachScreen/CoachScreen';
import { ProfileScreen } from './pages/ProfileScreen/ProfileScreen';
import { ScreenType } from './types';
import { authService } from './services/auth.service';
import { GoalScreen } from './pages/GoalScreen/GoalScreen'; // Импортируем GoalScreen
import { apiService } from './services/api.service';
import { ScheduleSetupScreen } from './pages/ScheduleSetupScreen/ScheduleSetupScreen';



export default function App() {
    const [currentScreen, setCurrentScreen] = useState<ScreenType>('run');
    const [showSubscription, setShowSubscription] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [showLogin, setShowLogin] = useState(true); // true: login, false: register
    const [showGoalScreen, setShowGoalScreen] = useState(false); // Новое состояние
    const [isCheckingGoal, setIsCheckingGoal] = useState(true);
    const [showScheduleSetup, setShowScheduleSetup] = useState(false);

    useEffect(() => {
        const checkAuthAndGoal = async () => {
            const authenticated = authService.isAuthenticated();
            setIsAuthenticated(authenticated);

            if (authenticated) {
                // Проверяем, есть ли уже цель у пользователя
                try {
                    const goal = await apiService.getGoal();
                    if (!goal) {
                        // Если цели нет, показываем экран цели
                        setShowGoalScreen(true);
                    }
                } catch (error) {
                    console.error('Error checking goal:', error);
                }
            }
            setIsCheckingGoal(false);
        };

        checkAuthAndGoal();
    }, []);


    const handleLogout = () => {
        authService.logout();
        localStorage.clear();
        setIsAuthenticated(false);
    };


    const handleRegisterSuccess = () => {
        setIsAuthenticated(true);
        // После регистрации сразу показываем экран цели
        setTimeout(() => {
            setShowGoalScreen(true);
        }, 1000);
        setShowGoalScreen(true);

    };



    const handleGoalSaved = () => {
        // Скрываем экран цели после сохранения
        setShowGoalScreen(false);
        setCurrentScreen('run');
    };

    const handleScheduleSetupComplete = () => {
        setShowScheduleSetup(false);
        setCurrentScreen('schedule');
    };


    // Проверка цели
    if (isCheckingGoal) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">Загрузка...</div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <AnimatePresence mode="wait">
                {showLogin ? (
                    <LoginScreen
                        key="login"
                        onLoginSuccess={() => setIsAuthenticated(true)}
                        onSwitchToRegister={() => setShowLogin(false)}
                    />
                ) : (
                    <RegisterScreen
                        key="register"
                        onRegisterSuccess={() => {
                            setIsAuthenticated(true);
                            setTimeout(() => {
                                setShowGoalScreen(true);
                            }, 1500);
                            setShowGoalScreen(true);
                        }}
                        onSwitchToLogin={() => setShowLogin(true)}
                    />
                )}
            </AnimatePresence>
        );
    }

    if (showGoalScreen) {
        return (
            <div className="min-h-screen bg-background">
                <GoalScreen onGoalSaved={handleGoalSaved} />
            </div>
        );
    }

    if (showScheduleSetup) {
        return (
            <div className="min-h-screen bg-background">
                <ScheduleSetupScreen onClose={handleScheduleSetupComplete} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background selection:bg-primary selection:text-black">
            <Header onLogout={handleLogout} />

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
                            <ScheduleScreen onOpenSetup={() => setShowScheduleSetup(true)}/>
                        </motion.div>
                    )}
                    {/* Модалка вне motion.div, чтобы не наследовать анимации */}
                    {showScheduleSetup && (
                        <ScheduleSetupScreen onClose={() => setShowScheduleSetup(false)} />
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
