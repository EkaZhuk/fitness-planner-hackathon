"""
Обучение модели линейной регрессии для прогнозирования дистанции одной тренировки.
"""
import pandas as pd
import numpy as np
import pickle
from pathlib import Path
from sklearn.linear_model import LinearRegression
from sklearn.metrics import r2_score, mean_absolute_error

# Загрузка данных
data_dir = Path(__file__).parent.parent.parent / 'data'
df = pd.read_csv(data_dir / 'training_data.csv')
df['date'] = pd.to_datetime(df['date'])

# Подготовка признаков
start_date = df['date'].min()
df['days_since_start'] = (df['date'] - start_date).dt.days
df['week_number'] = df['days_since_start'] / 7  # Дробные недели

X = df[['week_number']]
y = df['distance_km']

# Обучение
model = LinearRegression()
model.fit(X, y)

# Оценка
y_pred = model.predict(X)
r2 = r2_score(y, y_pred)
mae = mean_absolute_error(y, y_pred)

print('Модель обучена (прогноз дистанции одной тренировки)')
print(f'R² Score: {r2:.4f}')
print(f'MAE: {mae:.2f} км')
print(f'Прирост в неделю: {model.coef_[0]:.3f} км')
print(f'Начальная дистанция: {model.intercept_:.2f} км')

# Сохранение
model_dir = Path(__file__).parent
model_path = model_dir / 'model.pkl'

with open(model_path, 'wb') as f:
    pickle.dump({
        'model': model,
        'start_date': start_date,
        'r2_score': r2,
        'mae': mae
    }, f)

print(f'Модель сохранена в: {model_path}')