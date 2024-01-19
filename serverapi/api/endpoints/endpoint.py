from typing import List
from fastapi import APIRouter, Depends, HTTPException, Path
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from ...database.database import get_db
from ...models.model import User
from ...schemas.schema import (
    UserResponse,
    MypageUserResponse,
    LlmTextResponse,
    UserCreate,
    UserUpdate
)
from ...services.service import UserService

router = APIRouter()


# ユーザー情報の新規登録
@router.post("/users/", response_model=UserResponse)
async def create_user(user: UserCreate, db: Session = Depends(get_db)):
    try:
        # ユーザーデータをDBに保存
        db_user = User(**user.dict())
        db.add(db_user)
        db.commit()
        db.refresh(db_user)

        return JSONResponse(content={"message": "successful"})
    except Exception as e:
        print(f"An error occurred: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")


# マイページ用ユーザー情報の取得
@router.get("/user/{firebase_uid}", response_model=MypageUserResponse)
async def read_user(
   firebase_uid: str = Path(..., title="Firebase UID"),
   db: Session = Depends(get_db)
):
    try:
        user_service = UserService(db=db)
        db_user = user_service.get_user_info(firebase_uid=firebase_uid)
        if db_user is None:
            raise HTTPException(status_code=404, detail="User not found")

        mypage_user_response = MypageUserResponse(
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
        return JSONResponse(content=mypage_user_response.dict())

    except Exception as e:
        print(f"An error occurred: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")


# マイページ用ユーザー情報の更新
@router.put("/user/{firebase_uid}", response_model=MypageUserResponse)
async def update_user(
    user: UserUpdate,
    firebase_uid: str = Path(..., title="Firebase UID"),
    db: Session = Depends(get_db)
):
    try:
        user_service = UserService(db=db)
        db_user = user_service.update_user(user, firebase_uid=firebase_uid)
        if db_user is None:
            raise HTTPException(status_code=404, detail="User not found")

        mypage_user_response = MypageUserResponse(
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
        return JSONResponse(content=mypage_user_response.dict())

    except Exception as e:
        print(f"An error occurred: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")


# LLM問い合わせした履歴を取得
@router.get("/llm_texts/{firebase_uid}",
            response_model=List[LlmTextResponse])
async def get_llm_texts(
  firebase_uid: str = Path(..., title="Firebase UID"),
  db: Session = Depends(get_db)
):
    try:
        user_service = UserService(db=db)
        user = user_service.get_user_info(firebase_uid=firebase_uid)
        if user is None:
            raise HTTPException(status_code=404, detail="User not found")
        user_id = str(user.user_id)
        llm_texts = user_service.get_llm_texts_by_user_id(user_id=user_id)
        if not llm_texts:
            raise HTTPException(status_code=404, detail="LLM texts not found")

        # LlmTextResponseスキーマに合わせて、LLMテキストを返す
        llm_text_responses = []
        for llm_text in llm_texts:
            llm_text_response = LlmTextResponse(
                request_text=llm_text.request_text,
                response_text=llm_text.response_text,
                created_at=llm_text.created_at.strftime("%Y-%m-%d %H:%M:%S")
            )
            llm_text_responses.append(llm_text_response)

        return llm_text_responses

    except Exception as e:
        print(f"An error occurred: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
