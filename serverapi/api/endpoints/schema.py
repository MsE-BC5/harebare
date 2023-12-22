# APIエンドポイントからPOSTやPUTで受け取るデータを検証
from pydantic import BaseModel
from typing import Optional
from uuid import UUID
from datetime import datetime


class UserBase(BaseModel):
    name: Optional[str] = None
    nick_name: Optional[str] = None
    email: Optional[str] = None
    firebase_uid: Optional[str] = None
    OAuth_provider: Optional[str] = None
    OAuth_provider_id: Optional[str] = None


class UserCreate(UserBase):
    name: str
    email: str


class UserUpdate(UserBase):
    pass


class UserResponse(UserBase):
    id: UUID
    gender_id: UUID
    age_range_id: UUID
    address_id: UUID
    talk_mode_id: UUID
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True


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
