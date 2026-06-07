import os
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "LMS"
    debug: bool = True


    db_url: str

    cors_origins: list[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
    ]

    static_dir: str = "static"
    images_dir: str = "static/images"
    pdfs_dir: str = "static/pdfs"

    model_config = SettingsConfigDict(env_file="../.env", extra="ignore")


os.makedirs("static/images", exist_ok=True)
os.makedirs("static/pdfs", exist_ok=True)

settings = Settings()
