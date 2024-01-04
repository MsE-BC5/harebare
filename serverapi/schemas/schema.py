# APIエンドポイントからPOSTやPUTで受け取るデータを検証
from pydantic import BaseModel
from typing import Optional
from uuid import UUID
from datetime import datetime


# class UserBase(BaseModel):
#     name: str
#     email: str
#     nick_name: Optional[str] = None
#     firebase_uid: Optional[str] = None
#     OAuth_provider: Optional[str] = None
#     OAuth_provider_id: Optional[str] = None
#     gender_id: Optional[UUID] = None
#     age_range_id: Optional[UUID] = None
#     address_id: Optional[UUID] = None
#     talk_mode_id: Optional[UUID] = None

class UserBase(BaseModel):
    name: str
    nick_name: Optional[str] = None
    email: str
    gender: str
    age_range: str
    address: str
    talk_mode: str
    job_title: str
    years_of_experience: str


class UserCreate(UserBase):
    pass


class UserUpdate(UserBase):
    pass


class UserResponse(UserBase):
    # id: str  # UUIDを文字列として受け取る
    id: UUID
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True
        from_attributes = True

# class UserBase(BaseModel):
#     name: Optional[str] = None
#     nick_name: Optional[str] = None
#     email: Optional[str] = None
#     firebase_uid: Optional[str] = None
#     OAuth_provider: Optional[str] = None
#     OAuth_provider_id: Optional[str] = None


# class UserCreate(UserBase):
#     name: str
#     email: str
#     nick_name: Optional[str] = None
#     firebase_uid: Optional[str] = None
#     OAuth_provider: Optional[str] = None
#     OAuth_provider_id: Optional[str] = None
#     gender_id: Optional[UUID] = None
#     age_range_id: Optional[UUID] = None
#     address_id: Optional[UUID] = None
#     talk_mode_id: Optional[UUID] = None


# class UserUpdate(UserBase):
#     pass


# class UserResponse(UserBase):
#     id: UUID
#     gender_id: UUID
#     age_range_id: UUID
#     address_id: UUID
#     talk_mode_id: UUID
#     created_at: datetime
#     updated_at: Optional[datetime] = None

#     class Config:
#         orm_mode = True


class GenderBase(BaseModel):
    gender_type: str


class GenderResponse(GenderBase):
    id: UUID
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True


class AgeRangeBase(BaseModel):
    range: str


class AgeRangeResponse(AgeRangeBase):
    id: UUID
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True


class AddressBase(BaseModel):
    prefecture: str


class AddressResponse(AddressBase):
    id: UUID
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True


class TalkModeBase(BaseModel):
    mode: str


class TalkModeResponse(TalkModeBase):
    id: UUID
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True


class QueryBase(BaseModel):
    query_text: str


class QueryResponse(QueryBase):
    id: UUID
    user_id: UUID
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True


class ResponseBase(BaseModel):
    response_text: str


class ResponseResponse(ResponseBase):
    id: UUID
    user_id: UUID
    query_id: UUID
    created_at: datetime
    updated_at: Optional[datetime] = None

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
