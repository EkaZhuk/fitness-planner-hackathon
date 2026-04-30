"""
Функции для прогнозирования прогресса бегуна.
С корректирующими коэффициентами на антропометрию.
"""
import pickle
import warnings
from pathlib import Path
from datetime import datetime, timedelta

warnings.filterwarnings('ignore')


def load_model():
    """Загружает сохранённую модель"""
    model_path = Path(__file__).parent / 'model.pkl'
    with open(model_path, 'rb') as f:
        data = pickle.load(f)
    return data['model'], data['start_date'], data['r2_score'], data['mae']


def predict_finish_date(target_distance: float, target_date_str: str,
                        current_date_str: str = None):
    """
    Прогнозирует дистанцию за тренировку к целевой дате.
    """
    model, start_date, r2, mae = load_model()

    # Валидация входных данных
    if target_distance <= 0:
        return {
            'error': True,
            'message': 'Целевая дистанция должна быть больше нуля',
            'status': 'Некорректный ввод'
        }

    target_date = datetime.strptime(target_date_str, '%Y-%m-%d')
    
    # Проверка: дата забега должна быть позже даты старта тренировок
    if target_date < start_date:
        return {
            'error': True,
            'message': 'Дата забега раньше начала тренировок — проверьте данные',
            'status': 'Некорректный ввод'
        }
    
    # Предупреждение о слишком большой цели
    if target_distance > 100:
        return {
            'warning': True,
            'message': 'Цель больше 100 км — это ультрамарафон. Рекомендуется консультация со специалистом',
            'status': 'Очень амбициозная цель'
        }

    # Расчёт прогноза
    total_weeks = max(1, (target_date - start_date).days / 7)
    predicted_distance = round(float(model.predict([[total_weeks]])[0]), 1)

    if current_date_str:
        current_date = datetime.strptime(current_date_str, '%Y-%m-%d')
    else:
        current_date = start_date

    current_weeks = max(0, (current_date - start_date).days / 7)
    current_distance = round(float(model.predict([[current_weeks]])[0]), 1)

    weeks_left = max(0, round(total_weeks - current_weeks))
    progress_pct = min(100, round((current_distance / target_distance) * 100))

    gap = target_distance - predicted_distance
    if gap <= 0:
        status = f'Цель будет достигнута. Прогноз: {predicted_distance} км за тренировку'
    else:
        status = f'Нужно ещё {gap:.1f} км. Прогноз: {predicted_distance} км'

    return {
        'target_distance_km': target_distance,
        'target_date': target_date.strftime('%Y-%m-%d'),
        'predicted_km_per_training': predicted_distance,
        'current_km_per_training': current_distance,
        'progress_pct': progress_pct,
        'weeks_left': weeks_left,
        'status': status,
        'r2_score': round(r2, 4),
        'mae_km': round(mae, 2)
    }


def get_correction_factor(user_profile: dict) -> float:
    """
    Корректирует прогноз дистанции с учётом антропометрии.
    Возвращает множитель к predicted_distance.
    """
    factor = 1.0

    # Пол: у женщин стартовая дистанция на 15% ниже
    if user_profile.get('gender') == 'female':
        factor *= 0.85

    # Возраст: после 35 лет снижение на 1% в год
    age = user_profile.get('age', 25)
    if age > 35:
        factor *= 1.0 - (age - 35) * 0.01

    # ИМТ: если >30, снижаем нагрузку на суставы
    weight = user_profile.get('weight_kg', 70)
    height_cm = user_profile.get('height_cm', 170)
    height_m = height_cm / 100
    bmi = weight / (height_m ** 2)
    if bmi > 30:
        factor *= 0.8
    elif bmi > 25:
        factor *= 0.9

    # Травмы коленей/спины — дополнительное ограничение
    if user_profile.get('knee_issues'):
        factor *= 0.7
    if user_profile.get('back_issues'):
        factor *= 0.85

    # Новичок — не более 75% от базового прогноза первые недели
    if user_profile.get('level') == 'beginner':
        factor = min(factor, 0.75)

    return round(factor, 2)


def safe_prediction(target_distance, target_date_str, current_date_str, user_profile=None):
    """
    Безопасный прогноз с учётом противопоказаний и антропометрии.
    """
    result = predict_finish_date(target_distance, target_date_str, current_date_str)

    if user_profile:
        correction = get_correction_factor(user_profile)
        result['predicted_km_per_training'] = round(
            result['predicted_km_per_training'] * correction, 1
        )
        result['current_km_per_training'] = round(
            result['current_km_per_training'] * correction, 1
        )
        result['correction_factor'] = correction
        result['warning'] = []

        # Предупреждения о противопоказаниях
        if correction < 0.7:
            result['warning'].append('Рекомендуется консультация врача перед началом тренировок')

        weight = user_profile.get('weight_kg', 70)
        height_cm = user_profile.get('height_cm', 170)
        bmi = weight / ((height_cm / 100) ** 2)
        if bmi > 30:
            result['warning'].append('При ИМТ > 30 рекомендовано начинать с ходьбы и плавания')

        if user_profile.get('knee_issues'):
            result['warning'].append('При проблемах с коленями избегайте бега по асфальту')

    return result


if __name__ == '__main__':
    # Тестовый запуск
    print('Базовый прогноз:')
    result = predict_finish_date(10, '2025-07-01', '2025-04-06')
    for key, value in result.items():
        print(f'   {key}: {value}')

    print('\nБезопасный прогноз (женщина, 45 лет, новичок):')
    user = {
        'gender': 'female',
        'age': 45,
        'weight_kg': 85,
        'height_cm': 165,
        'level': 'beginner',
        'knee_issues': False,
        'back_issues': False
    }
    safe = safe_prediction(10, '2025-07-01', '2025-04-06', user)
    for key, value in safe.items():
        print(f'   {key}: {value}')