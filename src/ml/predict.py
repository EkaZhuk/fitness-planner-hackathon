"""
Функции для прогнозирования прогресса бегуна.
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

    Параметры:
        target_distance: цель в км (например, 10)
        target_date_str: дата забега 'YYYY-MM-DD'
        current_date_str: текущая дата для расчёта прогресса 'YYYY-MM-DD'
    """
    model, start_date, r2, mae = load_model()

    target_date = datetime.strptime(target_date_str, '%Y-%m-%d')
    total_weeks = max(1, (target_date - start_date).days / 7)
    predicted_distance = round(float(model.predict([[total_weeks]])[0]), 1)

    # Если передана текущая дата, используем её; иначе — start_date
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
        status = f'Цель будет достигнута! Прогноз: {predicted_distance} км за тренировку'
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


if __name__ == '__main__':
    # Пример: начал 6 января, сегодня 6 апреля, цель 10 км к 1 июля
    result = predict_finish_date(10, '2025-07-01', '2025-04-06')
    print('Прогноз тренировок (на 6 апреля):')
    for key, value in result.items():
        print(f'   {key}: {value}')