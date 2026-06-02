// Импорт React хуков для управления состоянием и побочными эффектами
import React, {useState, useEffect} from 'react';
// Импорт иконок из библиотеки lucide-react
import {Timer, TrendingUp, Target, Zap, CheckCircle} from 'lucide-react';
// Импорт хранилища расписания тренировок (Zustand)
import {useScheduleStore} from '../../store/scheduleStore';
// Импорт сервиса для API-запросов
import {apiService} from "@/src/services/api.service.ts";
// Импорт хранилища целей пользователя
import useGoalStore from '../../store/goalStore';
// Импорт иконки отмены/закрытия
import {XCircle} from 'lucide-react';
import { getDaysArray } from '../../utils/dateHelpers';

export const RunScreen: React.FC = () => {
    // Состояние для категорий тренировок (ВСЕ/СКОРОСТЬ/ВЫНОСЛИВОСТЬ)
    const categories = ['ВСЕ', 'СКОРОСТЬ', 'ВЫНОСЛИВОСТЬ'];
    const [activeCat, setActiveCat] = useState('ВСЕ');

    // Состояния для отслеживания прогресса бега
    const [currentKm, setCurrentKm] = useState<number>(0);      // текущий километраж
    const [point, setPoint] = useState<number>(0);              // набранные очки
    const [sumDistanceKm, setSumDistanceKm] = useState<number>(0); // общая дистанция

    // Состояние прогресса с сервера
    const [currentProgress, setCurrentProgress] = useState<{
        current_distance_km: number;
        sum_distance_km: number,
        point: number
    } | null>(null);

    // Хуки из хранилища целей
    const {saveGoal, loadGoal, goal, error, clearGoal} = useGoalStore();

    // Локальные состояния для формы цели и загрузки
    const [formData, setFormData] = useState({goal_km: 0, goal_deadline: ''});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isGoalLoading, setIsGoalLoading] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [isTrainingBlockVisible, setIsTrainingBlockVisible] = useState(true);
    const [trainingStatus, setTrainingStatus] = useState(null); // статус тренировки на сегодня

    // Получение сегодняшней даты в формате ISO
    const getTodayDate = () => new Date().toISOString().split('T')[0];

    // Деструктуризация хранилища расписаний
    const {
        trainings,
        fetchTrainings,
        isLoading: trainingsLoading,
        getTrainingsByDate
    } = useScheduleStore();

    /**
     * Загрузка прогресса пользователя с сервера
     * Если прогресса нет - создаёт нулевой объект
     */
    const loadProgress = async () => {
        try {
            const progress = await apiService.getProgress();
            if (progress !== null && progress.current_distance_km !== undefined) {
                setCurrentProgress(progress);
                setCurrentKm(progress.current_distance_km);
                setPoint(progress.point);
                setSumDistanceKm(progress.sum_distance_km);
            } else {
                // Если прогресса нет, создаём нулевой
                const zeroProgress = {
                    current_distance_km: 0,
                    sum_distance_km: 0,
                    point: 0
                };
                setCurrentProgress(zeroProgress);
                setCurrentKm(0);
                setPoint(0);
                setSumDistanceKm(0);
            }
        } catch (error) {
            console.log('No progress found');
            // При ошибке тоже создаём нулевой прогресс
            const zeroProgress = {
                current_distance_km: 0,
                sum_distance_km: 0,
                point: 0
            };
            setCurrentProgress(zeroProgress);
            setCurrentKm(0);
            setPoint(0);
            setSumDistanceKm(0);

        }
    };

    /**
     * useEffect при монтировании компонента:
     * 1. Загружает все данные (тренировки, прогресс, цели)
     * 2. Загружает статус тренировки на сегодня
     */
    useEffect(() => {
        const loadAllData = async () => {
            setIsLoading(true);
            await Promise.all([
                fetchTrainings(),      // загрузка расписания тренировок
                loadProgress(),        // загрузка прогресса пользователя
                loadGoal()             // загрузка цели пользователя
            ]);
            setIsLoading(false);
        };

        const loadTrainingStatus = async () => {
            try {
                const today = getTodayDate();
                const status = await apiService.getTrainingStatus(today);
                setTrainingStatus(status);

            } catch (error) {
                console.error('Ошибка загрузки статуса:', error);
            }
        };

        loadAllData();
        loadTrainingStatus();
    }, []); // Пустой массив зависимостей = выполняется один раз при монтировании

    /**
     * Обработчик завершения тренировки
     * - Отправляет запрос на сервер о завершении
     * - Обновляет прогресс (добавляет дистанцию и +1 очко)
     * - Обновляет статус тренировки
     */


    const handleCompleteTraining = async () => {
            console.log('=== handleCompleteTraining START ===');

            console.log('1. currentProgress:', currentProgress);

            // if (!todayTraining) {
            //     console.error('No current progress or training found');
            //     return;
            // }

            console.log('2. todayTraining:', todayTraining);

            // Проверка, не выполнена ли уже тренировка
            if (trainingStatus?.is_train === 0) {
                console.log('Training already completed');
                return;
            }

            setIsSubmitting(true);

            try {
                const today = getTodayDate();
                console.log('today:', today);

                //3. Отмечаем тренировку как выполненную
                await apiService.completeTraining(today);
                await loadProgress();
                console.log('Training completed on server');
                //1. Сначала обновляем прогресс (вычисляем новое значение)
                const updatedProgress = {
                    current_distance_km: Number(currentProgress.current_distance_km) + Number(todayTraining.distance_km),
                    sum_distance_km: Number(currentProgress.sum_distance_km) + Number(todayTraining.distance_km),
                    point: Number(currentProgress.point) + 1
                };

                await apiService.setProgress(updatedProgress);
                console.log('Progress saved:', updatedProgress);

                console.log('Updated progress:', updatedProgress);


                setCurrentProgress(updatedProgress);
                setCurrentKm(updatedProgress.current_distance_km);
                setPoint(updatedProgress.point);
                setSumDistanceKm(updatedProgress.sum_distance_km);

                setTrainingStatus({ is_train: 0, training_date: today });

                await loadProgress();

                console.log('All operations completed successfully');

                // Опционально: показать сообщение об успехе

            } catch (error) {
                console.error('Error completing training:', error);
            } finally {
                setIsSubmitting(false);
            }
        };
    /**
     * Обработчик отмены/пропуска тренировки
     * - Отправляет запрос на сервер
     * - Штрафует пользователя на -1 очко
     * - Отмечает тренировку как выполненную (без добавления дистанции)
     */
    // const handleCancelTraining = async () => {
    //     if (!currentProgress || !todayTraining) {
    //         console.error('No current progress found');
    //         return;
    //     }
    //
    //     setIsSubmitting(true);
    //     try {
    //         const today = getTodayDate();
    //         // ✅ 1. Отправляем запрос на сервер
    //         await apiService.completeTraining(today);
    //         console.log('Request successful');
    //
    //         // ✅ 2. Обновляем прогресс (штраф -1 очко, дистанция не меняется)
    //         const newPoint = Math.max(0, currentProgress.point - 1); // не ниже 0
    //         const updatedProgress = {
    //             current_distance_km: currentProgress.current_distance_km,
    //             sum_distance_km: currentProgress.sum_distance_km,
    //             point: newPoint
    //         };
    //         await apiService.setProgress(updatedProgress);
    //
    //         // ✅ 3. Обновляем статус тренировки
    //         setTrainingStatus({is_train: 1, training_date: today});
    //
    //         // ✅ 4. Перезагружаем прогресс
    //         await loadProgress();
    //
    //     } catch (error) {
    //         console.error('Error canceling training:', error);
    //         alert('Ошибка при отмене тренировки');
    //     } finally {
    //         setIsSubmitting(false);
    //     }
    // };
    const handleCancelTraining = async () => {
            console.log('=== handleCancelTraining START ===');

            // if (!currentProgress || !todayTraining) {
            //     console.error('No current progress or training found');
            //     return;
            // }

            // Проверка, не выполнена ли уже тренировка
            if (trainingStatus?.is_train === 0) {
                console.log('Training already completed');
                return;
            }

            setIsSubmitting(true);

            try {
                const today = getTodayDate();
                console.log('today:', today);

                // ✅ 1. Сначала обновляем прогресс (штраф -1 очко)
                const newPoint = Math.max(0, currentProgress.point - 1);
                const updatedProgress = {
                    current_distance_km: currentProgress.current_distance_km,
                    sum_distance_km: currentProgress.sum_distance_km,
                    point: newPoint
                };

                console.log('Updated progress (penalty):', updatedProgress);

                // ✅ 2. Отправляем обновленный прогресс на сервер
                await apiService.setProgress(updatedProgress);
                console.log('Progress saved with penalty');

                // ✅ 3. Отмечаем тренировку как выполненную (0 = выполнена)
                await apiService.completeTraining(today);
                console.log('Training cancelled on server');

                // ✅ 4. Обновляем локальные состояния
                setCurrentProgress(updatedProgress);
                setCurrentKm(updatedProgress.current_distance_km);
                setPoint(updatedProgress.point);
                setSumDistanceKm(updatedProgress.sum_distance_km);

                // ✅ 5. Обновляем статус тренировки (0 = выполнена/отменена)
                setTrainingStatus({ is_train: 0, training_date: today });

                // ✅ 6. Перезагружаем данные для синхронизации
                await loadProgress();

                console.log('✅ Training cancelled successfully');

                // Сообщение об успехе

            } catch (error) {
                console.error('Error canceling training:', error);
            } finally {
                setIsSubmitting(false);
            }
        };
    /**
     * Нормализация даты (обнуление времени)
     * Нужно для корректного сравнения дат без учёта часов/минут/секунд
     */
    const normalizeDate = (date: Date): Date => {
        return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    };

    /**
     * Обработчик сохранения цели пользователя
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await saveGoal(formData);
    };

    /**
     * Обработчик загрузки цели
     */
    const handleLoad = async () => {
        await loadGoal();
    };

    // Получение сегодняшних тренировок
    const today = normalizeDate(new Date());
    const todayTrainings = getTrainingsByDate(today);
    const hasTrainingToday = todayTrainings.length > 0; // есть ли тренировка сегодня


    console.log('Normalized date:', today);
    /**
     * Возвращает иконку в зависимости от дистанции тренировки
     */
    const getTrainingIcon = (distance: number) => {
        if (distance < 8) return <Timer size={24} className="text-primary"/>;      // короткая
        if (distance < 10000) return <Zap size={24} className="text-blue-500"/>;   // средняя
        return <Target size={24} className="text-green-500"/>;                     // длинная
    };

    /**
     * Возвращает цвет рамки в зависимости от дистанции
     */
    const getTrainingColor = (distance: number) => {
        if (distance < 8) return 'border-primary';
        if (distance < 10000) return 'border-blue-500';
        return 'border-green-500';
    };

    const todayTraining = todayTrainings[0]; // берём первую тренировку на сегодня
    const hasActiveTraining = hasTrainingToday && trainingStatus?.is_train === 1;

    // Проверяем, скрыт ли блок тренировки (если is_train === 0 - тренировка выполнена/отменена)
    const isTrainingHidden = trainingStatus?.is_train === 0;

    // Состояние загрузки - показываем спиннер
    if (isLoading || !currentProgress) {
        return (
            <div className="pt-24 px-6 pb-24 flex justify-center items-center">
                <div className="text-white">Загрузка...</div>
            </div>
        );
    }

    /**
     * Расчёт процента выполнения цели
     * Формула: текущая дистанция / (цель + 9 * текущая дистанция) * 100
     */
    const procent = currentProgress && goal?.goal_km
        ? currentProgress.current_distance_km / ((goal.goal_km + 9 * currentProgress.current_distance_km) / 100)
        : 0;
    const progressWidth = `${procent}%`;
    const isTrainingCompleted = trainingStatus?.is_train === 0;


// Скрытие блока
    // Если тренировка уже завершена/скрыта - показываем упрощённый вид с сообщением
    if (isTrainingHidden) {
        return (
            <div className="pt-24 px-6 pb-24">
                {/* Блок прогресса (всегда виден) */}
                <div className="bg-surface-lvl1 border border-surface-border rounded-soft p-6 mb-8">
                    <div className="flex justify-between items-end mb-2">
                        <h4 className="font-mono text-[10px] font-bold text-white/40 tracking-widest uppercase">
                            Мой прогресс
                        </h4>
                        <div className="flex items-center gap-1 text-primary">
                            <TrendingUp size={14}/>
                            <span className="font-sans font-bold">+{point}</span>
                        </div>
                    </div>
                    <div className="flex items-baseline gap-1 mb-3">
                        <span className="text-2xl font-black italic">{sumDistanceKm}</span>
                        <span className="text-white/40 font-bold">км</span>
                    </div>
                    <div className="h-1.5 bg-surface-lvl2 overflow-hidden mb-2">
                        <div
                            className="h-full bg-primary transition-all duration-300"
                            style={{width: `${procent}%`}}
                        />
                    </div>
                    <span className="text-[10px] font-bold text-white/40 tracking-widest">
                        {Math.round(procent)}% ОТ ЦЕЛИ
                    </span>
                </div>

                {/* Сообщение о том, что тренировок нет */}
                <div className="bg-orange-500/10 rounded-soft p-4 text-center">
                    <p className="text-orange-400 text-sm font-bold">
                        ТРЕНИРОВОК НЕТ
                    </p>
                    <p className="text-white/40 text-xs mt-1">
                        Отличная работа!
                    </p>
                </div>
                <img
                    src="/fit4.png"
                    alt={hasActiveTraining ? "Training completed" : "No training today"}
                    className="w-full h-auto object-contain opacity-80"
                />
            </div>
        );
    }


    // Основной рендер компонента
    return (
        <div className="pt-24 px-6 pb-24">
            {/* Заголовок страницы */}
            <h2 className="text-4xl font-extrabold tracking-tight mb-2">Беговые упражнения и тренировки</h2>
            <p className="text-white/60 text-sm mb-8">
                Тренировки высокой точности для улучшения скорости, выносливости и техники бега.
            </p>

            {/* Блок прогресса пользователя */}
            <div className="bg-surface-lvl1 border border-surface-border rounded-soft p-6 mb-8">
                <div className="flex justify-between items-end mb-2">
                    <h4 className="font-mono text-[10px] font-bold text-white/40 tracking-widest uppercase">
                        Мой прогресс
                    </h4>
                    <div className="flex items-center gap-1 text-primary">
                        <TrendingUp size={14}/>
                        <span className="font-sans font-bold">+{point}</span>
                    </div>
                </div>
                <div className="flex items-baseline gap-1 mb-3">
                    <span className="text-2xl font-black italic">{sumDistanceKm}</span>
                    <span className="text-white/40 font-bold">км</span>
                </div>
                {/* График прогресса */}
                <div className="h-1.5 bg-surface-lvl2 overflow-hidden mb-2">
                    <div
                        className="h-full bg-primary transition-all duration-300"
                        style={{width: progressWidth}}
                    />
                </div>
                <span className="text-[10px] font-bold text-white/40 tracking-widest">
                    {Math.round(procent)}% ОТ ЦЕЛИ
                </span>
            </div>

            {/* Кнопки управления тренировкой (Завершить / Отменить) */}
            <div className="mt-6 pt-4 border-t border-surface-border">
                <div className="flex gap-3">
                    <button
                        onClick={async () => {
                            await handleCompleteTraining();
                        }}
                        disabled={isSubmitting || !hasActiveTraining || !todayTraining}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded font-bold transition-all ${
                            hasActiveTraining && !isSubmitting && todayTraining
                                ? 'bg-[#FF5F00] hover:bg-[#E65500] text-white'
                                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        }`}
                    >
                        <CheckCircle size={18}/>
                        {isSubmitting ? 'Обработка...' : 'Завершить'}
                    </button>

                    <button
                         onClick={async () => {
                        await handleCancelTraining();
                    }}
                        disabled={isSubmitting || !hasActiveTraining}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded font-bold transition-all ${
                            hasActiveTraining && !isSubmitting
                                ? 'bg-red-500 hover:bg-red-600 text-white'
                                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        }`}
                    >
                        <XCircle size={18}/>
                        Отменить
                    </button>
                </div>
                {/* Подсказка для пользователя */}
                <p className="text-white/40 text-xs text-center mt-3">
                    {hasActiveTraining
                        ? 'Сегодня есть тренировка! Выполните её для получения очков.'
                        : isTrainingCompleted
                            ? 'Тренировка на сегодня. Отличная работа!'
                            : 'Нет тренировки на сегодня. Отдыхайте или занимайтесь восстановлением.'}
                </p>
            </div>

            {/* Блок с деталями тренировки на сегодня */}
            <div className="mt-8 pt-6 border-t border-surface-border">
                <h4 className="font-mono text-[10px] font-bold text-white/40 tracking-widest uppercase mb-4">
                    Тренировка на сегодня
                </h4>

                {hasActiveTraining && todayTraining ? (
                    // Если есть активная тренировка - показываем её детали
                    <div
                        className={`bg-surface-lvl2 border-l-4 ${getTrainingColor(todayTraining.distance_km)} rounded-r-soft p-4`}>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-surface-lvl3 rounded-soft flex items-center justify-center">
                                {getTrainingIcon(todayTraining.distance_km)}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-2xl font-black italic">
                                        {todayTraining.distance_km}
                                    </span>
                                    <span className="text-white/40 font-bold text-sm">км</span>
                                </div>
                            </div>
                        </div>
                        {/* Изображение, связанное с тренировкой */}
                        <img
                            src="/fit3.png"
                            alt="Training"
                            className="w-full h-auto object-contain opacity-80"
                        />
                    </div>
                ) : (
                    // Если тренировки нет или она выполнена - показываем сообщение
                    <div className="bg-surface-lvl2 rounded-soft p-4 text-center">
                        <p className="text-white/40 text-sm font-bold">
                            {hasActiveTraining ? 'ТРЕНИРОВКА ВЫПОЛНЕНА' : 'НЕТ ТРЕНИРОВОК НА СЕГОДНЯ'}
                        </p>
                        <p className="text-white/20 text-xs mt-1 mb-2">
                            {hasActiveTraining
                                ? 'Отличная работа! Сегодняшняя тренировка завершена.'
                                : 'Отличный день для отдыха или активного восстановления'}
                        </p>
                        <img
                            src="/fit2.png"
                            alt={hasActiveTraining ? "Training completed" : "No training today"}
                            className="w-full h-auto object-contain opacity-80"
                        />
                    </div>
                )}
            </div>
        </div>
    );
};
