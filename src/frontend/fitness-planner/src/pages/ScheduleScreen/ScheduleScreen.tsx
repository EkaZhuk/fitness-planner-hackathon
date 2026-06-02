import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Timer, Gauge, Navigation, Loader, ChevronLeft, ChevronRight } from 'lucide-react';
import { useScheduleStore } from '../../store/scheduleStore';
import { getDaysArray } from '../../utils/dateHelpers';

interface ScheduleScreenProps {
    onOpenSetup?: () => void;
}

export const ScheduleScreen: React.FC<ScheduleScreenProps> = ({ onOpenSetup }) => {
    const [currentWeekStart, setCurrentWeekStart] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date()); // Выбранная дата
    const {
        trainings,
        fetchTrainings,
        isLoading,
        error,
        getTrainingsByDate,
        removeTraining
    } = useScheduleStore();

    useEffect(() => {
        fetchTrainings();
    }, []);

    const normalizeDate = (date: Date): Date => {
        return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    };


    // Получаем дни для календаря
    const days = getDaysArray(currentWeekStart).map((day) => {
        const dayTrainings = getTrainingsByDate(normalizeDate(day.date));

        console.log('День:', {
            date: day.date,
            dateString: day.date.toDateString(),
            selectedDateString: selectedDate.toDateString(),
            isSelected: day.date.toDateString() === selectedDate.toDateString(),
            dayTrainingsCount: dayTrainings.length
        });

        return {
            ...day,
            hasTraining: dayTrainings.length > 0,
            trainings: dayTrainings,
            isSelected: day.date.toDateString() === selectedDate.toDateString(),
        };
    });

    // Получаем тренировки для выбранной даты
    const selectedDateTrainings = getTrainingsByDate(normalizeDate(selectedDate));

    // Навигация по неделям
    const prevWeek = () => {
        const newDate = new Date(currentWeekStart);
        newDate.setDate(newDate.getDate() - 7);
        setCurrentWeekStart(normalizeDate(newDate));
    };

    const nextWeek = () => {
        const newDate = new Date(currentWeekStart);
        newDate.setDate(newDate.getDate() + 7);
        setCurrentWeekStart(normalizeDate(newDate));
    };

    const goToToday = () => {
        const today = new Date();
        const normalizedToday = normalizeDate(today);

        setCurrentWeekStart(normalizedToday);
        setSelectedDate(normalizedToday);
    };

    // Определяем тип тренировки


    const getTrainingColor = (distance: number) => {
        if (distance < 8) return 'border-primary';
        if (distance < 10000) return 'border-blue-500';
        return 'border-green-500';
    };

    const getTrainingIcon = (distance: number) => {
        if (distance < 8) return <Timer size={32} className="text-primary" />;
        if (distance < 10000) return <Gauge size={32} className="text-blue-500" />;
        return <Navigation size={32} className="text-green-500" />;
    };

    const formatTrainingDate = (date: Date) => {
        const today = normalizeDate(new Date());
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        if (date.toDateString() === today.toDateString()) {
            return `СЕГОДНЯ`;
        } else if (date.toDateString() === tomorrow.toDateString()) {
            return `ЗАВТРА`;
        } else {
            return date.toLocaleDateString('ru-RU', {
                weekday: 'long',
                day: 'numeric',
                month: 'long'
            }).toUpperCase();
        }
    };

    if (isLoading) {
        return (
            <div className="pt-24 px-6 pb-24 flex justify-center items-center">
                <Loader size={48} className="animate-spin text-primary" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="pt-24 px-6 pb-24">
                <div className="bg-red-500/10 border border-red-500 rounded-soft p-6 text-center">
                    <p className="text-red-500 font-bold">{error}</p>
                    <button
                        onClick={fetchTrainings}
                        className="mt-4 bg-primary text-black px-4 py-2 rounded-soft"
                    >
                        Повторить
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-24 px-6 pb-24">
            <div className="mb-4">
                <h2 className="text-5xl font-extrabold tracking-tight">РАСПИСАНИЕ БЕГА</h2>
                <p className="text-white/40 font-bold uppercase text-xs tracking-widest mt-1">
                    {currentWeekStart.toLocaleDateString('ru-RU', {
                        day: 'numeric',
                        month: 'long'
                    })}
                    {' — '}
                    {new Date(currentWeekStart.getTime() + 6 * 24 * 60 * 60 * 1000)
                        .toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}
                </p>
            </div>

            {/* Кнопки навигации */}
            <div className="flex gap-2 mb-6">
                <button
                    onClick={goToToday}
                    className="bg-surface-lvl1 px-3 py-2 rounded-soft border border-surface-border text-xs font-bold hover:bg-surface-lvl2 transition-colors"
                >
                    Сегодня
                </button>
                <button
                    onClick={prevWeek}
                    className="bg-surface-lvl1 px-3 py-2 rounded-soft border border-surface-border text-xs font-bold hover:bg-surface-lvl2 transition-colors"
                >
                    <ChevronLeft size={16} />
                </button>
                <button
                    onClick={nextWeek}
                    className="bg-surface-lvl1 px-3 py-2 rounded-soft border border-surface-border text-xs font-bold hover:bg-surface-lvl2 transition-colors"
                >
                    <ChevronRight size={16} />
                </button>
                <button onClick={onOpenSetup}
                        className="bg-primary text-black px-4 py-2 flex items-center gap-2 font-black uppercase text-[10px] tracking-widest rounded-soft hover:bg-primary/90 transition-colors">
                    <Plus size={16}/> Настроить расписание
                </button>
            </div>

            {/* Календарь - активный и кликабельный */}
            <div className="grid grid-cols-7 gap-2 mb-8">
                {days.map((day, i) => (
                    <motion.button
                        key={i}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedDate(day.date)}
                        className={`
                            flex flex-col items-center py-4 rounded-soft border transition-all
                            ${day.isSelected
                            ? 'bg-primary border-primary scale-105 shadow-lg shadow-primary/20'
                            : day.isToday
                                ? 'bg-surface-lvl2 border-primary/50'
                                : day.hasTraining
                                    ? 'bg-surface-lvl2 border-surface-border hover:border-primary/50'
                                    : 'bg-surface-lvl1 border-surface-border hover:bg-surface-lvl2'
                        }
                            ${day.isPast && !day.isToday ? 'opacity-50' : ''}
                        `}
                    >
                        <span className={`font-mono text-[10px] font-bold tracking-widest mb-2 ${
                            day.isSelected ? 'text-black' : day.isActive ? 'text-primary' : 'text-white/40'
                        }`}>
                            {day.day}
                        </span>
                        <span className={`text-2xl font-black ${
                            day.isSelected ? 'text-black' : day.isActive ? 'text-white' : 'text-white/80'
                        }`}>
                            {day.dateNumber}
                        </span>
                        {day.hasTraining && !day.isSelected && (
                            <div className="mt-2 w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_8px_rgba(255,95,0,0.8)]" />
                        )}
                    </motion.button>
                ))}
            </div>

            {/* Заголовок выбранной даты */}
            <div className="mb-6">
                <h3 className="text-2xl font-bold">
                    {formatTrainingDate(selectedDate)}
                </h3>
                <p className="text-white/40 text-sm">
                    {/*{selectedDate.toLocaleDateString('ru-RU', {*/}
                    {/*    weekday: 'long',*/}
                    {/*    day: 'numeric',*/}
                    {/*    month: 'long',*/}
                    {/*    year: 'numeric'*/}
                    {/*}).toUpperCase()}*/}
                </p>
            </div>

            {/* Тренировки на выбранную дату */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={selectedDate.toISOString()}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-4"
                >
                    {selectedDateTrainings.length > 0 ? (
                        selectedDateTrainings.map((training) => (
                            <div
                                key={training.id}
                                className={`bg-surface-lvl1 border-l-4 ${getTrainingColor(training.distance_km)} rounded-r-soft p-6`}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-3xl font-black">
                                            Тренировка
                                        </h3>
                                        {/*<p className="text-white/40 text-sm mt-1">{training.notes}</p>*/}
                                    </div>
                                    <motion.div
                                        animate={{ rotate: training.distance_km < 8 ? 360 : 0 }}
                                        transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                                    >
                                        {getTrainingIcon(training.distance_km)}
                                    </motion.div>
                                </div>

                                <div className="grid grid-cols-3 gap-6 py-6 border-y border-white/5 mb-4">
                                    <div>
                                        <p className="text-[10px] font-bold text-white/40 tracking-widest mb-1 uppercase">
                                            ДИСТАНЦИЯ
                                        </p>
                                        <p className="text-2xl font-black italic">
                                            {training.distance_km} <span className="text-sm font-bold text-white/40">км</span>
                                        </p>
                                    </div>
                                </div>

                                {/*<button*/}
                                {/*    onClick={() => removeTraining(training.id)}*/}
                                {/*    className="text-white/20 hover:text-red-500 transition-colors text-xs font-bold uppercase"*/}
                                {/*>*/}
                                {/*    Удалить*/}
                                {/*</button>*/}

                            </div>
                        ))
                    ) : (
                        <div className="text-center py-12 bg-surface-lvl1 rounded-soft border border-surface-border">
                            <p className="text-white/40 text-lg font-bold">НЕТ ТРЕНИРОВОК</p>
                            <p className="text-white/20 text-sm mt-2">На этот день нет запланированных тренировок</p>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};
