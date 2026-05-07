from app.core.security.security import verify_password, create_access_token

class LoginUserUseCase:

    def __init__(self, user_repo):
        self.user_repo = user_repo

    def execute(self, email: str, password: str):
        user = self.user_repo.get_by_email(email)

        if not user:
            raise Exception("User not found")

        if not verify_password(password, user.hashed_password):
            raise Exception("Invalid credentials")

        token = create_access_token({"sub": user.email})
        return token