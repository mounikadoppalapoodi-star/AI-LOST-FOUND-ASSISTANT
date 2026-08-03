from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from pathlib import Path
import os
from .core.config import settings

db_file_path = Path(settings.SQLITE_DB_PATH).resolve()
db_file_path.parent.mkdir(parents=True, exist_ok=True)

# For Windows SQLite URLs, use 4 slashes for absolute paths or normalized posix paths
SQLALCHEMY_DATABASE_URL = f"sqlite:///{db_file_path.as_posix()}"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
