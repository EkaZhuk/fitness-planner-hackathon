from fastapi import FastAPI
from database import Training, TrainingDataBase
from datetime import date
import uvicorn

app = FastAPI(title='Fitness Planner')

db = TrainingDataBase()

@app.get('/')
def home_page():
    return 'Hello, World!'

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
    return f'{days} days'

@app.get('/goal')
def get_progress():
    return {'goal_km': 10, 'goal_deadline': date(2026, 6, 1)}

if __name__ == '__main__':
    uvicorn.run(app)