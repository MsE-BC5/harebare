# from typing import List
# from fastapi import APIRouter, Depends, HTTPException, Path
# from fastapi.responses import JSONResponse
# from sqlalchemy.orm import Session
# from uuid import UUID
# from ...database.database import get_db
# from ...models.model import User
# from ...schemas.schema import (
#     UserResponse,
#     LlmTextResponse,
#     UserCreate
# )
# from ...services.service import UserService

# router = APIRouter()


# # ユーザー情報の新規登録
# @router.post("/users/", response_model=UserResponse)
# def create_user(user: UserCreate, db: Session = Depends(get_db)):
#     # ユーザーデータをDBに保存
#     db_user = User(**user.dict())
#     db.add(db_user)
#     db.commit()
#     db.refresh(db_user)

#     # # オートインクリメントで生成された user_id のみを含むレスポンスを返す
#     # return UserResponse(id=str(db_user.user_id))
#     return JSONResponse({"message": "successful"})


# # マイページ用ユーザー情報の取得
# @router.get("/users/{user_id}", response_model=UserResponse)
# # user_id をパスパラメータとしてクライアントから受け取る
# def read_user(
#     user_id: UUID = Path(..., title="User ID"),
#     db: Session = Depends(get_db)
# ):

#     user_service = UserService(db=db)
#     db_user = user_service.get_user_info(user_id=user_id)
#     if db_user is None:
#         raise HTTPException(status_code=404, detail="User not found")

#     user_response = MypageUserResponse(
#         # id=str(db_user.user_id),  # UUIDを文字列に変換
#         name=db_user.name,
#         nick_name=db_user.nick_name,
#         email=db_user.email,
#         gender=db_user.gender,
#         age_range=db_user.age_range,
#         address=db_user.address,
#         talk_mode=db_user.talk_mode,
#         job_title=db_user.job_title,
#         years_of_experience=db_user.years_of_experience
#     )

#     # JSONResponseを使用してJSON形式のレスポンスを返す
#     return JSONResponse(content=user_response.dict())


# # LLM問い合わせした履歴を取得
# @router.get("/llm_texts/{user_id}", response_model=List[LlmTextResponse])
# # user_id をパスパラメータとしてクライアントから受け取る
# def get_llm_texts(
#     user_id: UUID = Path(..., title="User ID"),
#     db: Session = Depends(get_db)
# ):

#     user_service = UserService(db=db)
#     llm_texts = user_service.get_llm_texts_by_user_id(user_id=user_id)
#     if not llm_texts:
#         raise HTTPException(status_code=404, detail="LLM texts not found")

#     # LlmTextResponseスキーマに合わせて、LLMテキストを返す
#     llm_text_responses = []
#     for llm_text in llm_texts:
#         llm_text_response = LlmTextResponse(
#             id=str(llm_text.llm_text_id),  # UUIDを文字列に変換
#             user_id=str(llm_text.user_id),  # UUIDを文字列に変換
#             request_text=llm_text.request_text,
#             response_text=llm_text.response_text,
#             created_at=llm_text.created_at.strftime("%Y-%m-%d %H:%M:%S")
#         )
#         llm_text_responses.append(llm_text_response)

#     return llm_text_responses


# endpoint.py
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
    UserCreate
)
from ...services.service import UserService

router = APIRouter()


# ユーザー情報の新規登録
@router.post("/users/", response_model=UserResponse)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    # ユーザーデータをDBに保存
    db_user = User(**user.dict())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    return JSONResponse(content={"message": "successful"})


# マイページ用ユーザー情報の取得
@router.get("/user/{firebase_uid}", response_model=MypageUserResponse)
def read_user(
   firebase_uid: str = Path(..., title="Firebase UID"),
   db: Session = Depends(get_db)
):
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


# LLM問い合わせした履歴を取得
@router.get("/llm_texts/{firebase_uid}", response_model=List[LlmTextResponse])
def get_llm_texts(
  firebase_uid: str = Path(..., title="Firebase UID"),
  db: Session = Depends(get_db)
):
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
