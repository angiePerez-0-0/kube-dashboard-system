from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.core.config.settings import settings

engine = create_engine(
    settings.DB_URL,
    connect_args={"check_same_thread": False}  # 👈 SOLO para SQLite
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)