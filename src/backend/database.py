import sqlite3
from pydantic import BaseModel
from datetime import date

class Goal(BaseModel):
    goal_km: float
    goal_deadline: date

class Training(BaseModel):
    training_date: date
    distance_km: float
    duration_min: float
    notes: str | None = None

class User(BaseModel):
    username: str
    hashed_password: str
    email: str | None = None
    full_name: str | None = None

class UserLogin(BaseModel):
    username: str
    password: str

class TrainingDataBase:
    def __init__(self):
        self.connection = sqlite3.connect('data/trainings.db', check_same_thread=False)
        self.cursor = self.connection.cursor()
        self.drop_database() # Удаляет базу при запуске
        self.create_database()
    
    def __del__(self):
        self.cursor.close()
        self.connection.close()
    
    def create_database(self):
        self.cursor.execute('''                            
            CREATE TABLE IF NOT EXISTS Users (
                username TEXT PRIMARY KEY,
                hashed_password TEXT NOT NULL,
                email TEXT,
                full_name TEXT
            );
        ''')

        self.cursor.execute('''                                        
            CREATE TABLE IF NOT EXISTS Trainings (
                training_id INT IDENTITY(1,1) PRIMARY KEY,
                username REFERENCES users(username),
                training_date DATE NOT NULL,
                distance_km FLOAT NOT NULL,
                duration_min FLOAT NOT NULL,
                notes TEXT
            );
        ''')

        self.cursor.execute('''                            
            CREATE TABLE IF NOT EXISTS Goals (
                goal_id INT IDENTITY(1,1) PRIMARY KEY,
                username REFERENCES users(username),
                goal_km FLOAT NOT NULL,
                goal_deadline DATE NOT NULL
            );
        ''')

        self.connection.commit()
    
    def drop_database(self):
        self.cursor.execute('''
            DROP TABLE IF EXISTS Trainings;
        ''')

        self.cursor.execute('''
            DROP TABLE IF EXISTS Users;
        ''')

        self.cursor.execute('''
            DROP TABLE IF EXISTS Goals;
        ''')

        self.connection.commit()
    
    def add_training(self, training: Training, username: str):
        self.cursor.execute('''
            INSERT INTO Trainings (username, training_date, distance_km, duration_min, notes)
            VALUES (?, ?, ?, ?, ?);
        ''', (username, str(training.training_date), training.distance_km, training.duration_min, training.notes))
        self.connection.commit()
    
    def add_user(self, user: User):
        self.cursor.execute('''
            INSERT INTO Users (username, hashed_password, email, full_name)
            VALUES (?, ?, ?, ?);
        ''', (user.username, user.hashed_password, user.email, user.full_name))

        self.cursor.execute('''
            INSERT INTO Goals (username, goal_km, goal_deadline)
            VALUES (?, ?, ?);
        ''', (user.username, 10, date(2026, 6, 1)))

        self.connection.commit()
    
    def set_goal(self, goal: Goal, username: str):
        self.cursor.execute(f'''
            UPDATE Goals
            SET goal_km = '{goal.goal_km}', goal_deadline = '{goal.goal_deadline}'
            WHERE username = '{username}';
        ''')
        self.connection.commit()
    
    def get_goal(self, username: str):
        self.cursor.execute(f'''
            SELECT * 
            FROM Goals
            WHERE username = '{username}';
        ''')
        goal = self.cursor.fetchone()
        if not goal:
            return None
        return Goal(
            goal_km=goal[2],
            goal_deadline=goal[3]
        )
    
    def get_all_trainings(self):
        self.cursor.execute('''
            SELECT * 
            FROM Trainings;
        ''')
        return [Training(
            training_date=training[2],
            distance_km=training[3],
            duration_min=training[4],
            notes=training[5]
        ) for training in self.cursor.fetchall()]
    
    def get_all_trainings_by_user(self, username: str):
        self.cursor.execute(f'''
            SELECT * 
            FROM Trainings
            WHERE username = '{username}';
        ''')
        return [Training(
            training_date=training[2],
            distance_km=training[3],
            duration_min=training[4],
            notes=training[5]
        ) for training in self.cursor.fetchall()]
    
    def get_all_users(self):
        self.cursor.execute('''
            SELECT * 
            FROM Users;
        ''')
        return [User(
            username=user[0],
            hashed_password=user[1],
            email=user[2],
            full_name=user[3],
        ) for user in self.cursor.fetchall()]
    
    def get_user(self, username: str):
        self.cursor.execute(f'''
            SELECT * 
            FROM Users
            WHERE username = '{username}';
        ''')
        user = self.cursor.fetchone()
        if not user:
            return None
        return User(
            username=user[0],
            hashed_password=user[1],
            email=user[2],
            full_name=user[3],
        )

    def get_results_by_week(self, days: int, username: str):
        self.cursor.execute(f'''
            SELECT *, date(end_of_the_week, '-6 days') as start_of_the_week
            FROM (SELECT date(training_date, 'weekday 0') as end_of_the_week,
                         ROUND(SUM(distance_km), 2) as total_distance_km, 
                         ROUND(SUM(duration_min), 2) as total_duration_min
                  FROM trainings
                  WHERE training_date > (SELECT date('now', '-{days} day')) AND username = '{username}'
                  GROUP BY end_of_the_week)
            ORDER BY end_of_the_week;
        ''')
        return [{'week_start': week[3],
                 'week_end': week[0],
                 'total_distance_km': week[1],
                 'total_duration_min': week[2]} for week in self.cursor.fetchall()]


if __name__ == '__main__':
    db = TrainingDataBase()
    
    db.add_user(User(username='admin', hashed_password='admin'))
    db.add_training(Training(
        training_date=date.today(),
        distance_km=2.2,
        duration_min=2.2,
    ), username='admin')
    db.add_training(Training(
        training_date=date.today(),
        distance_km=2.5,
        duration_min=2.1,
    ), username='admin')
    db.add_training(Training(
        training_date=date(2026, 4, 5),
        distance_km=2.2,
        duration_min=2.2,
    ), username='admin')
    db.add_training(Training(
        training_date=date(2026, 3, 25),
        distance_km=2.2,
        duration_min=2.2,
    ), username='admin')
    
    db.set_goal(Goal(goal_km=12, goal_deadline=date.today()), username='admin')

    print(db.get_all_users())
    print(db.get_all_trainings())
    print(db.get_results_by_week(30, username='admin'))
    print(db.get_user('admin'))

    print(db.get_all_trainings_by_user(username='admin'))
    print(db.get_goal('admin'))