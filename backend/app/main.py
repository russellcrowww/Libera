from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from .config import settings
from .database import init_db
from .routers import Book_router, Categories_router
# Добавили современный инструмент для запуска кода
from contextlib import asynccontextmanager

# 1. Заменяем устаревший @app.on_event('startup') на современный lifespan-обработчик


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Этот код выполнится ровно ОДИН раз при старте приложения
    init_db()
    yield
    # Если нужно что-то сделать при остановке (например, закрыть коннекты) — пишем здесь

app = FastAPI(
    title=settings.app_name,
    debug=settings.debug,
    docs_url='/api/docs',
    redoc_url='/api/redoc',
    lifespan=lifespan  # Регистрируем наш lifespan
)

# 2. Добавляем порт Docker-фронтенда (:3000) в список разрешенных адресов
default_frontend_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",   # Добавлено для работы фронтенда из контейнера Nginx
    "http://127.0.0.1:3000",   # Добавлено на всякий случай
]
allow_origins = list(dict.fromkeys(
    [*settings.cors_origins, *default_frontend_origins]))

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount('/static', StaticFiles(directory=settings.static_dir), name='static')

app.include_router(Book_router)
app.include_router(Categories_router)


@app.get('/')
def root():
    return {
        'message': 'Welcome to fastapi libreary API',
        "docs": "api/docs",
    }


@app.get('/health')
def health_check():
    return {'status': 'healthy'}
