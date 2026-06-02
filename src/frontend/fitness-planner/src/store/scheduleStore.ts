// store/scheduleStore.ts
import { create } from 'zustand';

// const API_URL = 'http://82.146.61.208:8000';
const API_URL = 'http://localhost:8000';


// Тип данных, которые приходят с бэкенда
interface TrainingFromAPI {
    training_date: string;
    distance_km: number;
    duration_min: number;
    notes: string;
}

// Тип для хранения в store
interface Training {
    id: string;
    training_date: string;
    distance_km: number;
    duration_min: number;
    notes: string;
    displayDate: string;
    pace_per_km: number;
}

interface ScheduleStore {
    trainings: Training[];
    isLoading: boolean;
    error: string | null;
    fetchTrainings: () => Promise<void>;
    addMultipleTrainings: (trainings: Training[]) => void;
    removeTraining: (id: string) => void;
    getTrainingsByDate: (date: Date) => Training[];
    clearTrainings: () => void;
}

export const useScheduleStore = create<ScheduleStore>((set, get) => ({
    trainings: [],
    isLoading: false,
    error: null,

    fetchTrainings: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`${API_URL}/trainings`, {
                method: 'GET',              // ✅ явно указываем GET
                credentials: 'include',     // ✅ отправляем cookies
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data: TrainingFromAPI[] = await response.json();

            // Преобразуем в нужный формат
            const trainings: Training[] = data.map((item, index) => ({
                id: `training-${index}-${item.training_date}`,
                training_date: item.training_date,
                distance_km: item.distance_km,
                duration_min: item.duration_min,
                notes: item.notes,
                displayDate: formatDate(item.training_date),
                pace_per_km: +(item.duration_min / item.distance_km).toFixed(1), // темп мин/км
            }));

            set({ trainings });
            console.log(`✅ Загружено ${trainings.length} тренировок`);

        } catch (error) {
            console.error('❌ Ошибка загрузки:', error);
            set({ error: 'Не удалось загрузить тренировки' });
        } finally {
            set({ isLoading: false });
        }
    },

    // Добавить несколько тренировок
    addMultipleTrainings: (newTrainings) => set((state) => ({
        trainings: [...state.trainings, ...newTrainings]
    })),

    // Удалить тренировку
    removeTraining: (id) => set((state) => ({
        trainings: state.trainings.filter(t => t.id !== id)
    })),

    // // Получить тренировки по дате
    // getTrainingsByDate: (date) => {
    //     const { trainings } = get();
    //     const dateString = date.toISOString().split('T')[0];
    //     return trainings.filter(t => t.training_date === dateString);
    // },
    getTrainingsByDate: (date) => {
        const { trainings } = get();
        // Используем UTC методы
        const year = date.getUTCFullYear();
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const day = String(date.getUTCDate()).padStart(2, '0');
        const dateString = `${year}-${month}-${day}`;

        console.log('🔍 Поиск:', {
            inputDate: date,
            dateString: dateString,
            found: trainings.filter(t => t.training_date === dateString).length
        });

        return trainings.filter(t => t.training_date === dateString);
    },

    // Очистить все тренировки
    clearTrainings: () => set({ trainings: [] }),
}));

// Вспомогательная функция для форматирования даты
function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        weekday: 'short'
    });
}
