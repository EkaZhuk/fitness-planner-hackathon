"""
Визуализация прогресса бегуна: фактическая дистанция + ML-прогноз.
Сравнение с конкурентами: две линии на одном графике.
"""
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.dates as mdates
from pathlib import Path
from datetime import datetime, timedelta
import sys
sys.path.append('.')
from src.ml.predict import predict_finish_date


def plot_progress_with_forecast(target_distance, target_date_str, current_date_str):
    """
    Строит график: синяя линия (факт) + оранжевый пунктир (ML-прогноз).
    Прогноз плавный: модель прогнозирует дистанцию на каждую будущую неделю,
    используя эту неделю как опорную точку.
    """
    # Загрузка данных
    data_dir = Path(__file__).parent.parent.parent / 'data'
    df = pd.read_csv(data_dir / 'training_data.csv')
    df['date'] = pd.to_datetime(df['date'])

    # Группировка по неделям
    df['week_num'] = df['date'].dt.isocalendar().week.astype(int)
    df['year'] = df['date'].dt.isocalendar().year.astype(int)
    weekly = df.groupby(['year', 'week_num']).agg(
        avg_distance=('distance_km', 'mean'),
        first_date=('date', 'min')
    ).reset_index().sort_values('first_date')

    current_date = datetime.strptime(current_date_str, '%Y-%m-%d')
    target_date = datetime.strptime(target_date_str, '%Y-%m-%d')

    # Факт (до текущей даты)
    fact = weekly[weekly['first_date'] <= current_date].copy()

    # Прогноз: плавная траектория
    # Используем модель, чтобы предсказать дистанцию на каждую неделю
    # как если бы эта неделя была целевой
    future_weeks = []
    week_start = fact['first_date'].max() + timedelta(days=7)

    # Базовая модель для предсказания дистанции по номеру недели
    import pickle
    model_path = Path(__file__).parent / 'model.pkl'
    with open(model_path, 'rb') as f:
        model_data = pickle.load(f)
    model = model_data['model']
    start_date = model_data['start_date']

    while week_start <= target_date:
        weeks_from_start = max(1, (week_start - start_date).days / 7)
        predicted = round(float(model.predict([[weeks_from_start]])[0]), 1)
        future_weeks.append({
            'first_date': week_start,
            'avg_distance': predicted
        })
        week_start += timedelta(days=7)

    future = pd.DataFrame(future_weeks)

    # График
    fig, ax = plt.subplots(figsize=(12, 6))

    # Синяя — факт
    if len(fact) > 0:
        ax.plot(fact['first_date'], fact['avg_distance'],
                color='#2563EB', linewidth=2.5, marker='o', markersize=6,
                label='Фактическая дистанция', zorder=3)

    # Оранжевая — прогноз (плавный)
    if len(future) > 0:
        # Соединение
        ax.plot([fact['first_date'].iloc[-1], future['first_date'].iloc[0]],
                [fact['avg_distance'].iloc[-1], future['avg_distance'].iloc[0]],
                color='#F97316', linewidth=2, linestyle='--', alpha=0.4)

        ax.plot(future['first_date'], future['avg_distance'],
                color='#F97316', linewidth=2.5, linestyle='--', marker='s', markersize=6,
                label='ML-прогноз', zorder=3)

    # Вертикальная линия — сегодня
    ax.axvline(x=current_date, color='#6B7280', linestyle=':', linewidth=1.5, alpha=0.7)
    all_vals = list(fact['avg_distance']) + (list(future['avg_distance']) if len(future) > 0 else [])
    y_max = max(max(all_vals) if all_vals else 0, target_distance) + 2
    ax.text(current_date, y_max * 0.92, 'Сегодня', ha='center', fontsize=9, color='#6B7280')

    # Цель
    ax.axhline(y=target_distance, color='#10B981', linestyle='-.', linewidth=1.5, alpha=0.7)
    ax.text(fact['first_date'].iloc[0] if len(fact) > 0 else current_date,
            target_distance + 0.3, f'Цель: {target_distance} км',
            fontsize=9, color='#10B981', fontweight='bold')

    # Подписи
    ax.set_xlabel('Дата', fontsize=11)
    ax.set_ylabel('Средняя дистанция за тренировку (км)', fontsize=11)
    ax.set_title('Прогресс бегуна: факт и ML-прогноз', fontsize=14, fontweight='bold', pad=15)
    ax.xaxis.set_major_formatter(mdates.DateFormatter('%d.%m'))
    ax.xaxis.set_major_locator(mdates.WeekdayLocator(interval=2))
    plt.xticks(rotation=45, ha='right')
    ax.grid(True, alpha=0.3, linestyle='--')
    ax.set_axisbelow(True)
    ax.set_ylim(0, None)
    ax.legend(loc='upper left', frameon=True, fontsize=10)

    # Аннотация
    result = predict_finish_date(target_distance, target_date_str, current_date_str)
    annotation_text = (
        f"Текущая: {result['current_km_per_training']} км\n"
        f"Прогноз к {target_date_str}: {result['predicted_km_per_training']} км\n"
        f"Прогресс: {result['progress_pct']}%\n"
        f"Осталось: {result['weeks_left']} нед."
    )
    ax.text(0.98, 0.97, annotation_text, transform=ax.transAxes,
            fontsize=10, verticalalignment='top', horizontalalignment='right',
            bbox=dict(boxstyle='round,pad=0.5', facecolor='white', alpha=0.9, edgecolor='#D1D5DB'))

    plt.tight_layout()

    output_dir = Path(__file__).parent.parent.parent / 'docs'
    output_dir.mkdir(parents=True, exist_ok=True)
    output_path = output_dir / 'progress_chart.png'
    plt.savefig(output_path, dpi=150, bbox_inches='tight')
    print(f'График сохранён: {output_path}')

    plt.show()
    return fig


def plot_comparison_with_competitors():
    """
    Сравнительная диаграмма: какие графики строят конкуренты и что строим мы.
    """
    fig, axes = plt.subplots(2, 2, figsize=(14, 10))
    weeks = np.array(list(range(1, 13)))
    fact_data = np.array([3.2, 3.5, 3.8, 4.1, 4.3, 4.6, 4.9, 5.2, 5.5, 5.7, 6.0, 6.3])

    # 1. Nike Run Club: только история
    ax = axes[0, 0]
    ax.plot(weeks, fact_data, color='#000000', linewidth=2, marker='o')
    ax.set_title('Nike Run Club\n(только история)', fontsize=12, fontweight='bold')
    ax.set_ylabel('Дистанция (км)')
    ax.grid(True, alpha=0.3)
    ax.set_ylim(0, 13)

    # 2. Strava: столбики
    ax = axes[0, 1]
    ax.bar(weeks, fact_data, color='#FC4C02', alpha=0.8)
    ax.set_title('Strava\n(столбики по неделям)', fontsize=12, fontweight='bold')
    ax.grid(True, alpha=0.3)
    ax.set_ylim(0, 13)

    # 3. Couch to 5K: фиксированный план
    ax = axes[1, 0]
    couch_plan = np.array([1.5, 1.5, 2.0, 2.5, 2.5, 3.0, 3.0, 3.5, 3.5, 4.0, 4.5, 5.0])
    ax.plot(weeks, couch_plan, color='#2E8B57', linewidth=2, marker='s')
    ax.axhline(y=5, color='red', linestyle=':', alpha=0.7)
    ax.text(1, 5.3, 'Цель 5 км', fontsize=9, color='red')
    ax.set_title('Couch to 5K\n(фиксированный план)', fontsize=12, fontweight='bold')
    ax.set_ylabel('Дистанция (км)')
    ax.grid(True, alpha=0.3)
    ax.set_ylim(0, 13)

    # 4. Just Go: факт + прогноз
    ax = axes[1, 1]
    split = 8  # первые 8 недель — факт, остальные — прогноз
    future_data = np.array([6.8, 7.3, 7.9, 8.5])

    # Факт
    ax.plot(weeks[:split], fact_data[:split], color='#2563EB', linewidth=2.5,
            marker='o', label='Факт')
    # Прогноз (начинаем с последней точки факта)
    forecast_weeks = np.array([split - 1] + list(range(split, split + len(future_data))))
    forecast_values = np.array([fact_data[split - 1]] + list(future_data))
    ax.plot(forecast_weeks, forecast_values, color='#F97316', linewidth=2.5,
            linestyle='--', marker='s', label='Прогноз')

    ax.axvline(x=split, color='#6B7280', linestyle=':', alpha=0.7)
    ax.text(split + 0.3, 12, 'Сегодня', fontsize=9, color='#6B7280')
    ax.set_title('Just Go\n(факт + ML-прогноз)', fontsize=12, fontweight='bold')
    ax.set_xlabel('Недели')
    ax.legend(loc='upper left', fontsize=9)
    ax.grid(True, alpha=0.3)
    ax.set_ylim(0, 13)

    plt.suptitle('Сравнение визуализации прогресса: конкуренты vs Just Go',
                 fontsize=14, fontweight='bold', y=1.01)
    plt.tight_layout()

    # Сохранение
    output_dir = Path(__file__).parent.parent.parent / 'docs'
    output_dir.mkdir(parents=True, exist_ok=True)
    output_path = output_dir / 'competitor_comparison.png'
    plt.savefig(output_path, dpi=150, bbox_inches='tight')
    print(f'Сравнение сохранено: {output_path}')

    plt.show()
    return fig


if __name__ == '__main__':
    print('1. График "Факт + ML-прогноз"')
    plot_progress_with_forecast(10, '2025-07-01', '2025-04-06')

    print('\n2. Сравнение с конкурентами')
    plot_comparison_with_competitors()