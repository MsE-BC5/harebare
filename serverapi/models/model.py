from sqlalchemy import (
    Column, ForeignKey, String, Text, DateTime, func
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
    created_at = Column(
        DateTime(timezone=True),
        default=func.now())
    updated_at = Column(
        DateTime(timezone=True),
        default=func.now(),
        onupdate=func.now()
    )

    llm_texts = relationship("Llm_text")


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

    # user = relationship("User")
    user = relationship("User",
                        back_populates="llm_texts",
                        overlaps="llm_texts")  # 競合するため修正


def main():
    # テーブルが存在しなければ、テーブルを作成
    Base.metadata.create_all(bind=Engine)


if __name__ == "__main__":
    main()
