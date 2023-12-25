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


# from sqlalchemy import create_engine
# from sqlalchemy.ext.declarative import declarative_base
# from sqlalchemy.orm import sessionmaker, scoped_session
# import os
# from dotenv import load_dotenv


# load_dotenv()


# # 接続先DBの設定
# SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")


# # DBとの接続
# Engine = create_engine(
#     SQLALCHEMY_DATABASE_URL,
#     # echo=Trueだと実行のたびにSQLが出力される
#     echo=True
# )

# # Sessionの作成
# session = scoped_session(
#     # ORM実行時の設定。自動コミットするか自動反映するか
#     sessionmaker(
#         autocommit=False,
#         autoflush=False,
#         bind=Engine
#     )
# )

# # modelで使用する
# Base = declarative_base()
# Base.query = session.query_property()
