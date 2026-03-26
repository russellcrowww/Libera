from pydantic_settings import BaseSettings, SettingsConfigDict
import os

class Settings(BaseSettings):
    app_name: str = "LMS"
    debug: bool = True 
    
    database_url: str = "sqlite:///./library_managment_sys.db"
    
    cors_origins: list[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
    ]
    
    static_dir: str = "static"
    images_dir: str = "static/images"
    model_config = SettingsConfigDict(env_file=".env")

# папки для картинок если их нет
if not os.path.exists("static/images"):
    os.makedirs("static/images", exist_ok=True)

settings = Settings()
