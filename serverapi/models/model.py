from sqlalchemy import (
    Column, ForeignKey, String, BigInteger, Text, DateTime, func
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
from ..database.database import Base, Engine


class User(Base):
    __tablename__ = 'users'

    user_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(30))
    nick_name = Column(String(30))
    email = Column(String(100))
    gender = Column(String(50))
    age_range = Column(String(50))
    address = Column(String(100))
    talk_mode = Column(String(50))
    job_title = Column(String(100))
    years_of_experience = Column(String(50))
    firebase_uid = Column(String(50))
    OAuth_provider = Column(String(50))
    OAuth_provider_id = Column(String(50))
    created_at = Column(
        DateTime(timezone=True),
        default=func.now())
    updated_at = Column(
        DateTime(timezone=True),
        default=func.now(),
        onupdate=func.now()
    )

    llm_texts = relationship("Llm_text")
    payments = relationship("Payment")


class Llm_text(Base):
    __tablename__ = 'llm_texts'

    llm_text_id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.user_id'))
    request_text = Column(Text)
    response_text = Column(Text)
    created_at = Column(
        DateTime(timezone=True),
        default=func.now())
    updated_at = Column(
        DateTime(timezone=True),
        default=func.now(),
        onupdate=func.now()
    )

    user = relationship("User")


class Payment(Base):
    __tablename__ = 'payments'

    payment_id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.user_id'))
    stripe_customer_id = Column(String(50))
    price = Column(BigInteger)
    currency = Column(String(3))
    status = Column(String(20))
    payment_date = Column(DateTime(timezone=True))
    created_at = Column(
        DateTime(timezone=True),
        default=func.now())
    updated_at = Column(
        DateTime(timezone=True),
        default=func.now(),
        onupdate=func.now()
    )


def main():
    # テーブルが存在しなければ、テーブルを作成
    Base.metadata.create_all(bind=Engine)


if __name__ == "__main__":
    main()
