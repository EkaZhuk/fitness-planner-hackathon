-- Создание расширений
CREATE EXTENSION IF NOT EXISTS vector;


-- Таблица пользователей
CREATE TABLE IF NOT EXISTS users (
    username TEXT PRIMARY KEY,
    hashed_password TEXT NOT NULL,
    email TEXT,
    full_name TEXT,
    gender TEXT,
    age INTEGER,
    weight_kg INTEGER,
    height_cm INTEGER,
    level TEXT,
    knee_issues INTEGER DEFAULT 0,
    back_issues INTEGER DEFAULT 0
);


-- Таблица тренировок
CREATE TABLE IF NOT EXISTS trainings (
    training_id SERIAL PRIMARY KEY,
    username TEXT REFERENCES users(username) ON DELETE CASCADE,
    training_date DATE NOT NULL,
    distance_km FLOAT NOT NULL,
    duration_min FLOAT NOT NULL,
    notes TEXT,
    is_train INTEGER DEFAULT 1
);


-- Таблица прогресса
CREATE TABLE IF NOT EXISTS progress (
    progress_id SERIAL PRIMARY KEY,
    username TEXT REFERENCES users(username) ON DELETE CASCADE,
    current_distance_km FLOAT NOT NULL DEFAULT 0,
    sum_distance_km FLOAT NOT NULL DEFAULT 0,
    points INTEGER NOT NULL DEFAULT 0
);

-- Таблица целей
CREATE TABLE IF NOT EXISTS goals (
    goal_id SERIAL PRIMARY KEY,
    username TEXT REFERENCES users(username) ON DELETE CASCADE,
    start_km FLOAT NOT NULL,
    goal_km FLOAT NOT NULL,
    goal_deadline DATE NOT NULL
);


CREATE INDEX IF NOT EXISTS idx_trainings_username ON trainings(username);
CREATE INDEX IF NOT EXISTS idx_trainings_date ON trainings(training_date);
CREATE INDEX IF NOT EXISTS idx_progress_username ON progress(username);
CREATE INDEX IF NOT EXISTS idx_goals_username ON goals(username);
CREATE INDEX IF NOT EXISTS idx_goals_deadline ON goals(goal_deadline);


-- Таблица истории чата с привязкой к пользователю
CREATE TABLE chat_history (
    id VARCHAR(64) PRIMARY KEY,              -- SHA-256 хэш (уникальный идентификатор сообщения)
    username TEXT NOT NULL,                  -- ID пользователя из таблицы Users
    role VARCHAR(10) NOT NULL,               -- 'user' или 'assistant'
    text TEXT NOT NULL,                      -- Текст сообщения
    embedding VECTOR(1536),                  -- Векторное представление текста (размерность зависит от модели)
    created_at TIMESTAMP DEFAULT NOW(),      -- Время создания
    FOREIGN KEY (username) REFERENCES users(username) ON DELETE CASCADE
);

-- Создаем индекс для быстрого поиска истории по пользователю
CREATE INDEX idx_chat_history_username ON chat_history (username);

-- Создаем индекс для сортировки по времени
CREATE INDEX idx_chat_history_created_at ON chat_history (created_at DESC);


INSERT INTO progress (username, current_distance_km, sum_distance_km, point)
VALUES (0, 0, 0, 0)
