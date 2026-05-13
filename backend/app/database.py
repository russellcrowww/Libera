from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from .config import settings

# Формат: postgresql://username:password@localhost:5432/db_name
DATABASE_URL = settings.db_url

engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    # Импорт моделей обязателен до create_all, чтобы SQLAlchemy знала о таблицах
    from .models.Book import Book       # noqa: F401
    from .models.Category import Category  # noqa: F401

    Base.metadata.create_all(bind=engine)
