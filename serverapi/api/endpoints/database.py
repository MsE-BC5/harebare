from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, scoped_session
import os
from dotenv import load_dotenv


load_dotenv()


SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")

# DBとの接続
Engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    echo=True
)

# Sessionの作成
session = scoped_session(
    # ORM実行時の設定。自動コミットするか自動反映するか
    sessionmaker(
        autocommit=False,
        autoflush=False,
        bind=Engine
    )
)

# modelで使用する
Base = declarative_base()

# DB接続用のセッションクラス、インスタンスが作成されると接続する
Base.query = session.query_property()
