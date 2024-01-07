from typing import Optional, List
from uuid import UUID
from ..models.model import User, Llm_text
from ..schemas.schema import UserCreate
from sqlalchemy.orm import Session


class UserService:
    def __init__(self, db: Session):
        self.db = db

    # ユーザー情報を取得するメソッド
    def get_user_info(self, firebase_uid: str) -> Optional[User]:
        return (
            self.db.query(User)
            .filter(User.firebase_uid == firebase_uid)
            .first()
        )

    # ユーザー情報の新規登録メソッド
    def create_user(self, user: UserCreate) -> User:
        db_user = User(**user.dict())
        self.db.add(db_user)
        self.db.commit()
        self.db.refresh(db_user)
        return db_user

    # 問い合わせと回答をDBに保存するメソッド
    def create_llm_text(
            self,
            request_text: str,
            response_text: str,
            user_id: str) -> Llm_text:
        new_llm_text = Llm_text(
            request_text=request_text,
            response_text=response_text,
            user_id=user_id)
        self.db.add(new_llm_text)
        self.db.commit()
        self.db.refresh(new_llm_text)
        return new_llm_text

    # LLM問い合わせした履歴を取得するメソッド
    def get_llm_texts_by_user_id(self, user_id: UUID) -> List[Llm_text]:
        return (
            self.db.query(Llm_text.llm_text_id,
                          Llm_text.user_id,
                          Llm_text.request_text,
                          Llm_text.response_text,
                          Llm_text.created_at)
            .filter(Llm_text.user_id == user_id)
            .all()
        )
