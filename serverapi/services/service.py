from typing import Optional, List
from uuid import UUID
from ..models.model import Job, User, Llm_text
from ..schemas.schema import UserCreate
# from ..schemas.schema import UserCreate, UserLLMData
from sqlalchemy.orm import Session, joinedload


class UserService:
    def __init__(self, db: Session):
        self.db = db

    # ユーザーに関連する職業情報を取得するメソッド
    def get_jobs_by_user_id(self, user_id: UUID) -> List[Job]:
        return self.db.query(Job).filter(Job.user_id == user_id).all()

    def get_user_by_id(self, user_id: UUID) -> Optional[User]:
        return self.db.query(User).filter(User.id == user_id).first()

    def create_user(self, user_data: UserCreate) -> User:
        # 既存のユーザーをチェック
        existing_user = (
            self.db.query(User).filter(User.email == user_data.email).first()
        )

        if existing_user:
            return None

        new_user = User(**user_data.dict())
        self.db.add(new_user)
        self.db.commit()
        self.db.refresh(new_user)
        return new_user

    def get_user_details(self, user_id: UUID) -> Optional[User]:
        return (
            self.db.query(User)
            .filter(User.id == user_id)
            .options(joinedload(User.jobs))  # jobs を含むようにロード
            .first()
        )

    def create_llm_text(
            self,
            request_text: str,
            response_text: str,
            user_id: UUID) -> Llm_text:
        new_llm_text = Llm_text(
            request_text=request_text,
            response_text=response_text,
            user_id=user_id)
        self.db.add(new_llm_text)
        self.db.commit()
        self.db.refresh(new_llm_text)
        return new_llm_text

    def get_llm_texts_by_user_id(self, user_id: UUID) -> List[Llm_text]:
        return (
            self.db.query(Llm_text)
            .filter(Llm_text.user_id == user_id)
            .all()
        )

    # # ここで必要なLLMデータを取得
    # def get_user_llm_data(self, user_id: UUID) -> Optional[UserLLMData]:
    #     user = self.db.query(User).filter(User.id == user_id).first()
    #     if not user:
    #         return None

    #     jobs = self.db.query(Job).filter(Job.user_id == user_id).all()

    #     return UserLLMData(
    #         gender_id=user.gender_id,
    #         age_range_id=user.age_range_id,
    #         address_id=user.address_id,
    #         talk_mode_id=user.talk_mode_id,
    #         jobs=[
    #             {
    #                 "job_title": job.job_title,
    #                 "years_of_experience": job.years_of_experience,
    #             }
    #             for job in jobs
    #         ],
    #     )
