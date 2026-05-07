from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.infrastructure.db.session import SessionLocal
from app.infrastructure.repositories.user_repository_impl import UserRepositoryImpl
from app.application.use_cases.auth.login_user import LoginUserUseCase
from app.interfaces.schemas.auth_schema import LoginRequest, TokenResponse

from app.application.use_cases.auth.register_user import RegisterUserUseCase
from app.interfaces.schemas.auth_schema import RegisterRequest

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/login", response_model=TokenResponse)
def login(data: LoginRequest, db: Session = Depends(get_db)):
    repo = UserRepositoryImpl(db)
    use_case = LoginUserUseCase(repo)
    try:
        token = use_case.execute(data.email, data.password)
        return {"access_token": token}
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))

@router.post("/register", status_code=201)
def register(data: RegisterRequest, db: Session = Depends(get_db)):
    repo = UserRepositoryImpl(db)
    use_case = RegisterUserUseCase(repo)
    try:
        user = use_case.execute(data.email, data.password)
        return {"message": "User created", "email": user.email}
    except Exception as e:
        raise HTTPException(status_code=409, detail=str(e))