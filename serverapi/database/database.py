from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

load_dotenv()

SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")
Engine = create_engine(SQLALCHEMY_DATABASE_URL, echo=True)
# このSessionLocalは、依存関係として使用されます
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=Engine)
Base = declarative_base()


# データベースセッションを生成するための依存関係
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
