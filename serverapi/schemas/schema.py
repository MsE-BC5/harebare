# APIエンドポイントからPOSTやPUTで受け取るデータを検証
# from json import JSONEncoder
from pydantic import BaseModel
from typing import Optional
from uuid import UUID
from datetime import datetime


class UserBase(BaseModel):
    name: str
    nick_name: str
    # nick_name: Optional[str] = None
    email: str
    gender: str
    age_range: str
    address: str
    talk_mode: str
    job_title: str
    years_of_experience: str


class UserCreate(BaseModel):
    firebase_uid: str
    name: str
    nick_name: str
    # nick_name: Optional[str] = None
    email: str
    gender: str
    age_range: str
    address: str
    talk_mode: str
    job_title: str
    years_of_experience: str


class UserResponse(BaseModel):
    message: str


class MypageUserResponse(BaseModel):
    name: str
    nick_name: str
    email: str
    gender: str
    age_range: str
    address: str
    talk_mode: str
    job_title: str
    years_of_experience: str


class LlmTextResponse(BaseModel):
    request_text: str
    response_text: str
    created_at: str  # datetimeではなくstrとして定義

    class Config:
        orm_mode = True


class PaymentBase(BaseModel):
    stripe_customer_id: str
    price: int
    currency: str
    status: str
    payment_date: datetime


class PaymentResponse(PaymentBase):
    id: UUID
    user_id: UUID
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True
        from_attributes = True


# # APIエンドポイントからPOSTやPUTで受け取るデータを検証
# # from json import JSONEncoder
# from pydantic import BaseModel
# from typing import Optional
# from uuid import UUID
# from datetime import datetime


# class UserBase(BaseModel):
#     name: str
#     nick_name: str
#     # nick_name: Optional[str] = None
#     email: str
#     gender: str
#     age_range: str
#     address: str
#     talk_mode: str
#     job_title: str
#     years_of_experience: str


# class UserCreate(BaseModel):
#     firebase_uid: str
#     name: str
#     nick_name: str
#     # nick_name: Optional[str] = None
#     email: str
#     gender: str
#     age_range: str
#     address: str
#     talk_mode: str
#     job_title: str
#     years_of_experience: str


# class UserResponse(BaseModel):
#     id: str  # UUIDを文字列として受け取る


# class LlmTextResponse(BaseModel):
#     request_text: str
#     response_text: str
#     created_at: str  # datetimeではなくstrとして定義

#     id: str
#     user_id: str

#     class Config:
#         orm_mode = True


# class PaymentBase(BaseModel):
#     stripe_customer_id: str
#     price: int
#     currency: str
#     status: str
#     payment_date: datetime


# class PaymentResponse(PaymentBase):
#     id: UUID
#     user_id: UUID
#     created_at: datetime
#     updated_at: Optional[datetime] = None

#     class Config:
#         orm_mode = True
#         from_attributes = True