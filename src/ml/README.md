# ML-модель

## Подход
Линейная регрессия (Scikit-learn `LinearRegression`)

## Признаки
- `days_since_start` — количество дней от первой тренировки

## Целевая переменная
- `cumulative_distance` — накопленная дистанция с начала тренировок

## Обучение
```python
from sklearn.linear_model import LinearRegression
model = LinearRegression()
model.fit(X, y)
