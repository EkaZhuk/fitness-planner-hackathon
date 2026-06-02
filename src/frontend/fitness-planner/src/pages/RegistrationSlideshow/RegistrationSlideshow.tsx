// components/RegistrationSlideshow.tsx
// components/RegistrationSlideshow.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface RegistrationSlideshowProps {
    onComplete: () => void;
}

const slides = [
    {
        id: 1,
        image: '/images/slide2.png',
        title: 'Добро пожаловать!',
        description: 'Для начала выбери цель'
    },
    {
        id: 2,
        image: '/images/slide1.png',
        title: 'Настрой своё расписание',
        description: 'Рекомендуем не менее 3 тренировок в неделю'
    },
    {
        id: 3,
        image: '/images/slide3.png',
        title: 'Расписание настраивается по дням',
        description: 'Нажми «Создать расписание» — и вперёд'
    },
    {
        id: 4,
        image: '/images/slide4.png',
        title: 'Тренируйся и нажимай «Завершить»',
        description: 'Или «Отменить», если не смог потренироваться...'
    },
    {
        id: 5,
        image: '/images/slide5.png',
        title: 'Спрашивай у своего AI-тренера',
        description: 'Он обязательно поможет'
    }
];

export const RegistrationSlideshow: React.FC<RegistrationSlideshowProps> = ({ onComplete }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [direction, setDirection] = useState(0);

    const nextSlide = useCallback(() => {
        if (currentSlide < slides.length - 1) {
            setDirection(1);
            setCurrentSlide(prev => prev + 1);
        } else {
            onComplete();
        }
    }, [currentSlide, onComplete]);

    const prevSlide = () => {
        if (currentSlide > 0) {
            setDirection(-1);
            setCurrentSlide(currentSlide - 1);
        }
    };

    // Автоматическая смена слайдов
    useEffect(() => {
        const timer = setTimeout(() => {
            nextSlide();
        }, 5000);

        return () => clearTimeout(timer);
    }, [currentSlide, nextSlide]);

    const slideVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? '100%' : '-100%',
            opacity: 0
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? '100%' : '-100%',
            opacity: 0
        })
    };

    return (
        <div className="fixed inset-0 z-[200] bg-gradient-to-br from-gray-900 to-black overflow-hidden">
            {/* Кнопка пропуска */}
            <button
                onClick={onComplete}
                className="absolute top-4 right-4 z-20 flex items-center gap-1 text-white/60 hover:text-white transition-colors cursor-pointer"
                type="button"
            >
                <X size={20} />
                <span className="text-sm">Пропустить</span>
            </button>

            {/* Индикаторы прогресса */}
            <div className="absolute top-4 left-0 right-0 z-10 flex justify-center gap-2 px-4">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => {
                            setDirection(index > currentSlide ? 1 : -1);
                            setCurrentSlide(index);
                        }}
                        className="flex-1 max-w-12 h-1 rounded-full transition-all duration-300 cursor-pointer"
                        style={{
                            backgroundColor: index === currentSlide ? '#3b82f6' : 'rgba(255,255,255,0.3)',
                            width: index === currentSlide ? '2rem' : '1rem'
                        }}
                    />
                ))}
            </div>

            {/* Слайды */}
            <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div
                    key={currentSlide}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                        x: { type: "spring", stiffness: 300, damping: 30 },
                        opacity: { duration: 0.2 }
                    }}
                    className="absolute inset-0"
                >
                    <div className="h-full flex flex-col items-center justify-center p-6">
                        {/* Увеличенный контейнер для изображения */}
                        <div className="w-full max-w-md aspect-square mb-8 flex items-center justify-center">
                            <img
                                src={slides[currentSlide].image}
                                alt={slides[currentSlide].title}
                                className="w-full h-full object-contain rounded-2xl"
                                onError={(e) => {
                                    // Заглушка, если изображение не загрузилось
                                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x400?text=JUST+GO';
                                }}
                            />
                        </div>

                        <h2 className="text-3xl md:text-4xl font-black text-white mb-4 text-center px-4">
                            {slides[currentSlide].title}
                        </h2>

                        <p className="text-white/70 text-center max-w-md text-base md:text-lg px-4">
                            {slides[currentSlide].description}
                        </p>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Кнопки навигации */}
            {currentSlide > 0 && (
                <button
                    onClick={prevSlide}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 hover:bg-black/70 transition-colors cursor-pointer z-10"
                    type="button"
                    aria-label="Предыдущий слайд"
                >
                    <ChevronLeft size={28} className="text-white" />
                </button>
            )}

            {currentSlide < slides.length - 1 && (
                <button
                    onClick={nextSlide}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 hover:bg-black/70 transition-colors cursor-pointer z-10"
                    type="button"
                    aria-label="Следующий слайд"
                >
                    <ChevronRight size={28} className="text-white" />
                </button>
            )}

            {/* Кнопка "Продолжить" на последнем слайде */}
            {currentSlide === slides.length - 1 && (
                <button
                    onClick={onComplete}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-full font-bold uppercase tracking-wider transition-all cursor-pointer z-10 shadow-lg whitespace-nowrap"
                    type="button"
                >
                    Начать тренировки
                </button>
            )}
        </div>
    );
};
