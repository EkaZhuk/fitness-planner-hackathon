# Backend (FastAPI)

## Эндпоинты

| Метод | Путь | Описание |
|:---|:---|:---|
| GET | `/` | Health check |
| GET | `/training` | Получить все тренировки |
| POST | `/training` | Добавить новую тренировку |
| GET | `/progress` | Получить агрегированный прогресс |
| GET | `/predict` | Получить ML-прогноз на целевую дату |

## Модель данных (Training)
```json
{
  "id": 1,
  "date": "2024-05-10",
  "distance_km": 5.2,
  "duration_min": 32.5
}
