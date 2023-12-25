from sqlalchemy import Column, ForeignKey, String, BigInteger, Text, DateTime
from sqlalchemy import func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
from ..database.database import Base, Engine


class Gender(Base):
    __tablename__ = 'genders'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    gender_type = Column(String(20))
    created_at = Column(
        DateTime(timezone=True),
        default=func.now())
    updated_at = Column(
        DateTime(timezone=True),
        default=func.now(),
        onupdate=func.now()
    )


class AgeRange(Base):
    __tablename__ = 'age_ranges'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    range = Column(String(20))
    created_at = Column(
        DateTime(timezone=True),
        default=func.now())
    updated_at = Column(
        DateTime(timezone=True),
        default=func.now(),
        onupdate=func.now()
    )


class Address(Base):
    __tablename__ = 'addresses'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    prefecture = Column(String(10))
    created_at = Column(
        DateTime(timezone=True),
        default=func.now())
    updated_at = Column(
        DateTime(timezone=True),
        default=func.now(),
        onupdate=func.now()
    )


class TalkMode(Base):
    __tablename__ = 'talk_modes'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    mode = Column(String(10))
    created_at = Column(
        DateTime(timezone=True),
        default=func.now())
    updated_at = Column(
        DateTime(timezone=True),
        default=func.now(),
        onupdate=func.now()
    )


class User(Base):
    __tablename__ = 'users'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(30))
    nick_name = Column(String(30))
    email = Column(String(100))
    gender_id = Column(UUID(as_uuid=True), ForeignKey('genders.id'))
    age_range_id = Column(UUID(as_uuid=True), ForeignKey('age_ranges.id'))
    address_id = Column(UUID(as_uuid=True), ForeignKey('addresses.id'))
    talk_mode_id = Column(UUID(as_uuid=True), ForeignKey('talk_modes.id'))
    firebase_uid = Column(String(50))
    OAuth_provider = Column(String(30))
    OAuth_provider_id = Column(String(50))
    created_at = Column(
        DateTime(timezone=True),
        default=func.now())
    updated_at = Column(
        DateTime(timezone=True),
        default=func.now(),
        onupdate=func.now()
    )

    gender = relationship("Gender")
    age_range = relationship("AgeRange")
    address = relationship("Address")
    talk_mode = relationship("TalkMode")
    queries = relationship("Query")
    payments = relationship("Payment")
    responses = relationship("Response")


class Query(Base):
    __tablename__ = 'queries'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id'))
    query_text = Column(Text)
    created_at = Column(
        DateTime(timezone=True),
        default=func.now())
    updated_at = Column(
        DateTime(timezone=True),
        default=func.now(),
        onupdate=func.now()
    )

    user = relationship("User")
    responses = relationship("Response")


class Response(Base):
    __tablename__ = 'responses'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id'))
    query_id = Column(UUID(as_uuid=True), ForeignKey('queries.id'))
    response_text = Column(Text)
    created_at = Column(
        DateTime(timezone=True),
        default=func.now())
    updated_at = Column(
        DateTime(timezone=True),
        default=func.now(),
        onupdate=func.now()
    )


class Payment(Base):
    __tablename__ = 'payments'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id'))
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
