from typing import List
from fastapi import APIRouter, Depends, HTTPException, Path
from sqlalchemy.orm import Session
from uuid import UUID
from ...database.database import get_db
from ...schemas.schema import (
    UserCreate,
    UserResponse,
    JobResponse,
    LlmTextResponse
)
from ...services.service import UserService

router = APIRouter()


@router.post("/users/", response_model=UserResponse)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = UserService(db).create_user(user)
    if db_user is None:
        raise HTTPException(status_code=400, detail="User already exists")
    return db_user


@router.get("/users/{user_id}", response_model=UserResponse)
def read_user(user_id: UUID, db: Session = Depends(get_db)):
    user_service = UserService(db=db)
    db_user = user_service.get_user_by_id(user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")

    # ここでユーザーの職業情報を取得
    db_jobs = user_service.get_jobs_by_user_id(user_id=user_id)

    # UserResponseスキーマに合わせて、ユーザーと職業情報を結合する
    return UserResponse(
        **db_user.__dict__,
        # jobs を UserResponse に追加
        jobs=[JobResponse(**job.__dict__) for job in db_jobs]
    )


# LLM問い合わせした履歴を取得
@router.get("/llm_texts/{user_id}", response_model=List[LlmTextResponse])
def get_llm_texts(
    # URLパスパラメータをuser_idとして受け取る
    user_id: UUID = Path(..., title="User ID"),
    db: Session = Depends(get_db)
):
    user_service = UserService(db=db)
    llm_texts = user_service.get_llm_texts_by_user_id(user_id=user_id)
    if not llm_texts:
        raise HTTPException(status_code=404, detail="LLM texts not found")

    # LlmTextResponseスキーマに合わせて、LLMテキストを返す
    return [LlmTextResponse(**llm_text.__dict__) for llm_text in llm_texts]
