from pathlib import Path
import os
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    app_name: str = "LMS"
    debug: bool = True 

    db_url: str = Field(
        default="mongodb://localhost:27017",
        alias="DB_URL",
    )
    db_name: str = Field(default="library_management", alias="DB_NAME")
    
    cors_origins: list[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
    ]
    
    static_dir: str = "static"
    images_dir: str = "static/images"
    pdfs_dir: str = "static/pdfs"
    model_config = SettingsConfigDict(
        env_file=str(Path(__file__).resolve().parents[1] / ".env"),
        extra="ignore",
    )

# папки для картинок если их нет
if not os.path.exists("static/images"):
    os.makedirs("static/images", exist_ok=True)
if not os.path.exists("static/pdfs"):
    os.makedirs("static/pdfs", exist_ok=True)

settings = Settings()
