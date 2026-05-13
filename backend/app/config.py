import os
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "LMS"
    debug: bool = True

    # Убираем validation_alias, Pydantic сам автоматически свяжет
    # переменные db_url и db_name с DB_URL и DB_NAME из .env (он нечувствителен к регистру)
    db_url: str
    db_name: str

    cors_origins: list[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
    ]

    static_dir: str = "static"
    images_dir: str = "static/images"
    pdfs_dir: str = "static/pdfs"

    # Простой относительный путь: выйти из backend наверх и взять .env
    model_config = SettingsConfigDict(env_file="../.env", extra="ignore")


# Создаем папки локально там, где запускается скрипт
os.makedirs("static/images", exist_ok=True)
os.makedirs("static/pdfs", exist_ok=True)

settings = Settings()
