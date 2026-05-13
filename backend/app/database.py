from sqlalchemy import create_engine
from .config import settings
from sqlalchemy.orm import declarative_base, sessionmaker

# 1. Получаем URL подключения из ваших настроек.
# Формат db_url должен быть: postgresql://username:password@localhost:5432/db_name
DATABASE_URL = settings.db_url

# 2. Создаем движок (engine) для управления подключениями
engine = create_engine(DATABASE_URL)

# 3. Создаем фабрику сессий для обработки запросов к БД
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 4. Базовый класс для будущих моделей (таблиц)
Base = declarative_base()


# 5. Функция-генератор для получения сессии (вместо старого get_db)
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# 6. Функция инициализации базы данных (создание таблиц и индексов)
def init_db():
    # Импортируйте ваши модели SQLAlchemy здесь перед вызовом create_all,
    # чтобы SQLAlchemy "узнала" о существовании ваших таблиц.
    # от app.models import Book, Category

    Base.metadata.create_all(bind=engine)
