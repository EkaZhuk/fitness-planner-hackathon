// export const getDaysArray = (currentWeekStart: Date) => {
//     const days = [];
//
//     // Получаем понедельник текущей недели
//     const today = new Date(currentWeekStart);
//     const dayOfWeek = today.getDay(); // 0 = воскресенье, 1 = понедельник, ..., 6 = суббота
//
//     // Вычисляем понедельник (если сегодня воскресенье, то отнимаем 6 дней)
//     const monday = new Date(today);
//     const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
//     monday.setDate(today.getDate() - daysToMonday);
//
//     // Создаем массив с понедельника по воскресенье
//     for (let i = 0; i < 7; i++) {
//         const date = new Date(monday);
//         date.setDate(monday.getDate() + i);
//         days.push({
//             date: date,
//             day: date.toLocaleDateString('ru-RU', { weekday: 'short' }).toUpperCase(),
//             dateNumber: date.getDate(),
//             isToday: date.toDateString() === new Date().toDateString(),
//         });
//     }
//     return days;
// };
//
//
// export const formatPace = (pace: number): string => {
//     const minutes = Math.floor(pace);
//     const seconds = Math.round((pace - minutes) * 60);
//     return `${minutes}:${seconds.toString().padStart(2, '0')}`;
// };
// export const getDaysArray = (currentDate: Date) => {
//     const days = [];
//
//     // Находим понедельник текущей недели
//     const date = new Date(currentDate);
//     const day = date.getDay();
//     const diff = date.getDate() - day + (day === 0 ? -6 : 1);
//     const monday = new Date(date.setDate(diff));
//     monday.setHours(0, 0, 0, 0);
//
//     // Создаем массив дней с понедельника по воскресенье
//     for (let i = 0; i < 7; i++) {
//         const currentDay = new Date(monday);
//         currentDay.setDate(monday.getDate() + i);
//         currentDay.setHours(0, 0, 0, 0);
//
//         const today = new Date();
//         today.setHours(0, 0, 0, 0);
//
//         days.push({
//             date: currentDay,
//             day: currentDay.toLocaleDateString('ru-RU', { weekday: 'short' }).toUpperCase(),
//             dateNumber: currentDay.getDate(),
//             isToday: currentDay.getTime() === today.getTime(),
//             isPast: currentDay.getTime() < today.getTime(),
//             isFuture: currentDay.getTime() > today.getTime(),
//         });
//     }
//
//     return days;
// };
//
// export const formatPace = (paceInSeconds: number): string => {
//     const minutes = Math.floor(paceInSeconds / 60);
//     const seconds = paceInSeconds % 60;
//     return `${minutes}:${seconds.toString().padStart(2, '0')}`;
// };
// export const getDaysArray = (currentDate: Date) => {
//     const days = [];
//
//     // Создаем копию даты
//     const date = new Date(currentDate);
//     date.setHours(0, 0, 0, 0);
//
//     // Получаем номер дня недели (0 = воскресенье, 1 = понедельник, ..., 6 = суббота)
//     let dayOfWeek = date.getDay();
//
//     // Преобразуем в понедельник как начало недели
//     // Если сегодня воскресенье (0), то отнимаем 6 дней чтобы получить понедельник
//     // Иначе отнимаем (dayOfWeek - 1) дней
//     const daysToMonday = dayOfWeek === 0 ? -6 : dayOfWeek - 1;
//     const monday = new Date(date);
//     monday.setDate(date.getDate() - daysToMonday);
//     monday.setHours(0, 0, 0, 0);
//
//     // Создаем массив дней с понедельника по воскресенье
//     for (let i = 0; i < 7; i++) {
//         const currentDay = new Date(monday);
//         currentDay.setDate(monday.getDate() + i);
//         currentDay.setHours(0, 0, 0, 0);
//
//         const today = new Date();
//         today.setHours(0, 0, 0, 0);
//
//         days.push({
//             date: currentDay,
//             day: currentDay.toLocaleDateString('ru-RU', { weekday: 'short' }).toUpperCase(),
//             dateNumber: currentDay.getDate(),
//             isToday: currentDay.getTime() === today.getTime(),
//             isPast: currentDay.getTime() < today.getTime(),
//             isFuture: currentDay.getTime() > today.getTime(),
//         });
//     }
//
//     return days;
// };
export const getDaysArray = (currentDate: Date) => {
    const days = [];

    // Создаем копию даты
    const date = new Date(currentDate);
    date.setHours(0, 0, 0, 0);

    // Получаем номер дня недели (0 = воскресенье, 1 = понедельник, ..., 6 = суббота)
    let dayOfWeek = date.getDay();

    // Преобразуем в понедельник как начало недели
    // Если сегодня воскресенье (0), то отнимаем 6 дней чтобы получить понедельник
    // Иначе отнимаем (dayOfWeek - 1) дней
    const daysToMonday = dayOfWeek === 0 ? -6 : dayOfWeek - 1;
    const monday = new Date(date);
    monday.setDate(date.getDate() - daysToMonday);
    monday.setHours(0, 0, 0, 0);

    // Создаем массив дней с понедельника по воскресенье
    for (let i = 0; i < 7; i++) {
        const currentDay = new Date(monday);
        currentDay.setDate(monday.getDate() + i);
        currentDay.setHours(0, 0, 0, 0);

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        days.push({
            date: currentDay,
            day: currentDay.toLocaleDateString('ru-RU', { weekday: 'short' }).toUpperCase(),
            dateNumber: currentDay.getDate(),
            isToday: currentDay.getTime() === today.getTime(),
            isPast: currentDay.getTime() < today.getTime(),
            isFuture: currentDay.getTime() > today.getTime(),
        });
    }

    return days;
};
