from app.domain.repositories.user_repository import UserRepository
from app.infrastructure.db.models import UserModel
from app.domain.entities.user import User

class UserRepositoryImpl(UserRepository):

    def __init__(self, db):
        self.db = db

    def get_by_email(self, email: str):
        user = self.db.query(UserModel).filter(UserModel.email == email).first()

        if not user:
            return None

        return User(user.id, user.email, user.hashed_password)

    def create(self, user: User):
        db_user = UserModel(
            email=user.email,
            hashed_password=user.hashed_password
        )
        self.db.add(db_user)
        self.db.commit()
        self.db.refresh(db_user)
        return User(db_user.id, db_user.email, db_user.hashed_password)