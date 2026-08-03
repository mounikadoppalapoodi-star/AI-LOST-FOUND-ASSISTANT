import os
from pathlib import Path
from pydantic import Field
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # General
    PROJECT_NAME: str = "AI Lost & Found"
    DEBUG: bool = True
    # Backend
    BACKEND_HOST: str = "0.0.0.0"
    BACKEND_PORT: int = 8000
    # Database
    SQLITE_DB_PATH: str = str(Path(__file__).resolve().parents[2] / "data" / "app.db")
    # JWT
    JWT_SECRET_KEY: str = Field(default="dummy_jwt_secret", env="JWT_SECRET_KEY")
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    # Email (Gmail)
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USER: str = Field(default="dummy_user@example.com", env="SMTP_USER")
    SMTP_PASSWORD: str = Field(default="dummy_password", env="SMTP_PASSWORD")
    # Mapbox (optional)
    MAPBOX_TOKEN: str = Field(default="", env="MAPBOX_TOKEN")

    class Config:
        env_file = str(Path(__file__).resolve().parents[3] / ".env")
        env_file_encoding = "utf-8"

settings = Settings()
