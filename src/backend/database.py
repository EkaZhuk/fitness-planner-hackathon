import sqlite3
from pydantic import BaseModel
from datetime import date

class Training(BaseModel):
    training_date: date
    distance_km: float
    duration_min: float
    notes: str | None = None

class TrainingDataBase:
    def __init__(self):
        self.connection = sqlite3.connect('data/trainings.db', check_same_thread=False)
        self.cursor = self.connection.cursor()
        self.drop_table() # Удаляет таблицу при запуске
        self.create_table_trainings()
    
    def __del__(self):
        self.cursor.close()
        self.connection.close()
    
    def create_table_trainings(self):
        self.cursor.execute('''
            CREATE TABLE IF NOT EXISTS trainings (
                training_id INT IDENTITY(1,1) PRIMARY KEY,
                training_date DATE NOT NULL,
                distance_km FLOAT NOT NULL,
                duration_min FLOAT NOT NULL,
                notes TEXT
            );
        ''')
        self.connection.commit()
    
    def drop_table(self):
        self.cursor.execute('''
            DROP TABLE IF EXISTS trainings;
        ''')
        self.connection.commit()
    
    def add_training(self, training: Training):
        self.cursor.execute('''
            INSERT INTO trainings (training_date, distance_km, duration_min, notes) VALUES (?, ?, ?, ?);
        ''', (str(training.training_date), training.distance_km, training.duration_min, training.notes))
        self.connection.commit()
    
    def get_all(self):
        self.cursor.execute('''
            SELECT * FROM trainings;
        ''')
        return [Training(training_date=training[1],
                         distance_km=training[2],
                         duration_min=training[3],
                         notes=training[4]) for training in self.cursor.fetchall()]

if __name__ == '__main__':
    db = TrainingDataBase()
    db.add_training(Training(training_date=date.today(),
                            distance_km=2.2,
                            duration_min=2.2,))
    print(db.get_all())