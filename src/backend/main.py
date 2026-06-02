from typing import Annotated, Optional

from fastapi import FastAPI, Depends, HTTPException, status, Request, Response
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import jwt, JWTError

from passlib.context import CryptContext

from database import Goal, Training, TrainingDataBase, User, UserLogin
from datetime import date, datetime, timedelta, timezone
import sys
import uvicorn

sys.path.append('src/ml')
from predict import predict_finish_date

SECRET_KEY = "CHANGE_ME_IN_PRODUCTION"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

app = FastAPI(title='Fitness Planner')


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # (только для разработки)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)

def create_access_token(data: dict, expires_minutes: int = ACCESS_TOKEN_EXPIRE_MINUTES) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=expires_minutes)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def authenticate_user(username: str, password: str) -> Optional[dict]:
    user = db.get_user(username)
    if not user or not verify_password(password, user.hashed_password):
        return None
    return user

def get_token(request: Request):
    token = request.cookies.get('users_access_token')
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Token not found')
    return token

def get_current_user(token: str = Depends(get_token)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Токен не валидный!')

    expire = payload.get('exp')
    expire_time = datetime.fromtimestamp(int(expire), tz=timezone.utc)
    if (not expire) or (expire_time < datetime.now(timezone.utc)):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Токен истек')

    username = payload.get('sub')
    if not username:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Не найден username пользователя')

    user = db.get_user(username)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='User not found')

    return user


db = TrainingDataBase()

@app.post("/signup")
def register_user(user_data: User) -> dict:
    user = db.get_user(user_data.username)
    if user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail='Пользователь с таким логином уже существует'
        )
    user_dict = user_data.model_dump()
    user_dict['hashed_password'] = hash_password(user_data.hashed_password)
    db.add_user(User(**user_dict))
    return {'message': 'Вы успешно зарегистрированы!'}

@app.post("/login")
def auth_user(response: Response, user_data: UserLogin):
    check = authenticate_user(username=user_data.username, password=user_data.password)
    if check is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail='Неверный логин или пароль')
    access_token = create_access_token({"sub": check.username})
    response.set_cookie(key="users_access_token", value=access_token, httponly=True)
    return {'access_token': access_token, 'refresh_token': None}

@app.get("/profile")
def get_me(user_data: User = Depends(get_current_user)):
    return {'user_name': user_data.username,
            'email': user_data.email,
            'full_name': user_data.full_name}

@app.post("/logout")
async def logout_user(response: Response):
    response.delete_cookie(key="users_access_token")
    return {'message': 'Пользователь успешно вышел из системы'}

@app.get('/')
def home_page():
    return 'Fitness Planner'

@app.get('/trainings')
def get_trainings_list(user_data: User = Depends(get_current_user)):
    return db.get_all_trainings_by_user(username=user_data.username)

@app.post('/trainings')
def add_training(training: Training, user_data: User = Depends(get_current_user)):
    db.add_training(training, username=user_data.username)
    return db.get_all_trainings_by_user(username=user_data.username)

# /progress?days=30
@app.get('/progress')
def get_progress(days: int=30, user_data: User = Depends(get_current_user)):
    # Прогресс за последние days дней разбитый по неделям
    return db.get_results_by_week(days, username=user_data.username)

@app.get('/goal')
def get_goal(user_data: User = Depends(get_current_user)):
    return db.get_goal(username=user_data.username)

@app.post('/goal')
def set_goal(new_goal: Goal, user_data: User = Depends(get_current_user)):
    db.set_goal(goal=new_goal, username=user_data.username)
    return db.get_goal(username=user_data.username)

@app.get('/predict')
def get_prediction(user_data: User = Depends(get_current_user)):
    goal = db.get_goal(username=user_data.username)
    return predict_finish_date(goal.goal_km, str(goal.goal_deadline), str(date.today()))

if __name__ == '__main__':
    uvicorn.run(app)
