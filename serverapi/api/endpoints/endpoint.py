from typing import List
from fastapi import APIRouter, Depends, HTTPException, Path
from sqlalchemy.orm import Session
from uuid import UUID
from ...database.database import get_db
from ...schemas.schema import (
    UserResponse,
    LlmTextResponse
)
from ...services.service import UserService

router = APIRouter()


# ユーザー情報の新規登録？？？
# @router.post("/users/", response_model=UserResponse)
# def create_user(user: UserCreate, db: Session = Depends(get_db)):
#     db_user = UserService(db).create_user(user)
#     if db_user is None:
# #         raise HTTPException(status_code=400, detail="User already exists")
#     return db_user


# マイページ用ユーザー情報の取得
@router.get("/users/{user_id}", response_model=UserResponse)
def read_user(user_id: UUID, db: Session = Depends(get_db)):
    user_service = UserService(db=db)
    db_user = user_service.get_user_info(user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")

    return UserResponse(
        id=db_user.user_id,
        name=db_user.name,
        nick_name=db_user.nick_name,
        email=db_user.email,
        gender=db_user.gender,
        age_range=db_user.age_range,
        address=db_user.address,
        talk_mode=db_user.talk_mode,
        job_title=db_user.job_title,
        years_of_experience=db_user.years_of_experience
        )


# LLM問い合わせした履歴を取得
@router.get("/llm_texts/{user_id}", response_model=List[LlmTextResponse])
def get_llm_texts(
    user_id: UUID = Path(..., title="User ID"),
    db: Session = Depends(get_db)
):
    user_service = UserService(db=db)
    llm_texts = user_service.get_llm_texts_by_user_id(user_id=user_id)
    if not llm_texts:
        raise HTTPException(status_code=404, detail="LLM texts not found")

    # LlmTextResponseスキーマに合わせて、LLMテキストを返す
    llm_text_responses = []
    for llm_text in llm_texts:
        llm_text_response = LlmTextResponse(
            id=llm_text.llm_text_id,
            user_id=llm_text.user_id,
            request_text=llm_text.request_text,
            response_text=llm_text.response_text,
            created_at=llm_text.created_at
        )
        llm_text_responses.append(llm_text_response)

    return llm_text_responses
