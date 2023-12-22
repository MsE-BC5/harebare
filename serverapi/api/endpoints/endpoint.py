from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy.orm import Session
import model
import schema
import database

model.Base.metadata.create_all(bind=database.Engine)


app = FastAPI()


# Dependency to get the database session
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.post("/users/", response_model=schema.UserResponse)
def create_user(user: schema.UserCreate, db: Session = Depends(get_db)):
    # ここで既存のユーザーのメールをチェック
    db_user = db.query(model.User)\
        .filter(model.User.email == user.email)\
        .first()

    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # 新しいユーザーオブジェクトの作成
    new_user = model.User(
        name=user.name,
        nick_name=user.nick_name,
        email=user.email
        # firebase_uid=user.firebase_uid,
        # OAuth_provider=user.OAuth_provider,
        # OAuth_provider_id=user.OAuth_provider_id
        # ここに他のフィールドを追加
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user
