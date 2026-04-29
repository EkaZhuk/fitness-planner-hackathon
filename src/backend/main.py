from fastapi import FastAPI
from database import Goal, Training, TrainingDataBase
from datetime import date
import sys
import uvicorn

sys.path.append('src/ml')
from predict import predict_finish_date

app = FastAPI(title='Fitness Planner')

db = TrainingDataBase()
goal = Goal(goal_km=10, goal_deadline=date(2026, 6, 1))

@app.get('/')
def home_page():
    return 'Fitness Planner'

@app.get('/trainings')
def get_trainings_list():
    return db.get_all()

@app.post('/trainings')
def add_training(training: Training):
    db.add_training(training)
    return db.get_all()

# progress?days=30
@app.get('/progress')
def get_progress(days: int=30):
    # Прогресс за последние days дней разбитый по неделям
    return db.get_results_by_week(days)

@app.get('/goal')
def get_progress():
    return goal

@app.post('/goal')
def get_progress(new_goal: Goal):
    global goal
    goal = new_goal
    return goal

@app.get('/predict')
def get_prediction():
    return predict_finish_date(goal.goal_km, str(goal.goal_deadline))

if __name__ == '__main__':
    uvicorn.run(app)