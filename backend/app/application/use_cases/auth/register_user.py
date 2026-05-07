from app.domain.entities.user import User
from app.core.security.security import hash_password

class RegisterUserUseCase:

    def __init__(self, user_repo):
        self.user_repo = user_repo

    def execute(self, email: str, password: str):
        hashed = hash_password(password)

        user = User(
            id=None,
            email=email,
            hashed_password=hashed
        )

        return self.user_repo.create(user)