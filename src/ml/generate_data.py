"""
Генерация синтетического датасета тренировок бегуна.
Логика прогрессии основана на типовом плане подготовки к забегу 10 км.
"""
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from pathlib import Path

np.random.seed(42)
START_DATE = datetime(2025, 1, 6)
END_DATE = datetime(2025, 10, 12)
TRAINING_DAYS = [0, 2, 5]
BASE_DISTANCE = 3.0
WEEKLY_INCREASE = 0.4

dates = []
current = START_DATE
while current <= END_DATE:
    if current.weekday() in TRAINING_DAYS:
        dates.append(current)
    current += timedelta(days=1)

distances = []
for i, _ in enumerate(dates):
    week_number = i // 3
    expected = BASE_DISTANCE + week_number * WEEKLY_INCREASE
    noise = np.random.normal(0, 0.3)
    dist = max(2.0, expected + noise)
    distances.append(round(dist, 2))

durations = []
for d in distances:
    base_time = d * 6
    noise = np.random.normal(0, 1.5)
    dur = max(d * 4.5, base_time + noise)
    durations.append(round(dur, 1))

df = pd.DataFrame({
    'date': [d.strftime('%Y-%m-%d') for d in dates],
    'distance_km': distances,
    'duration_min': durations,
    'avg_pace_min_per_km': [round(dur / dist, 2) for dur, dist in zip(durations, distances)],
    'notes': [''] * len(dates)
})

output_dir = Path(__file__).parent.parent.parent / 'data'
output_dir.mkdir(parents=True, exist_ok=True)
output_path = output_dir / 'training_data.csv'

df.to_csv(output_path, index=False, encoding='utf-8')

print(f'Сгенерировано {len(df)} записей')
print(f'Сохранено в: {output_path}')
print(f'\nПервые 5 строк:')
print(df.head().to_string())
print(f'\nСтатистика:')
print(f'Дистанция: от {df["distance_km"].min():.1f} до {df["distance_km"].max():.1f} км')
print(f'Средний темп: {df["avg_pace_min_per_km"].mean():.1f} мин/км')