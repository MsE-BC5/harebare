from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID
from ...database.database import get_db  # get_dbをインポート
from ...schemas.schema import UserCreate, UserResponse
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
    db_user = UserService(db=db).get_user_by_id(user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

# endpoint.py

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

#     user_response = UserResponse(
#         id=str(db_user.user_id),  # UUIDを文字列に変換
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

    # JSONResponseを使用してJSON形式のレスポンスを返す
    # return JSONResponse(content=user_response.dict())
