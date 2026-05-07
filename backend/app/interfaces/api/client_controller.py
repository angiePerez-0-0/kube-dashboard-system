from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.infrastructure.db.session import SessionLocal
from app.infrastructure.repositories.client_repository_impl import ClientRepositoryImpl
from app.application.use_cases.client.create_client import CreateClientUseCase
from app.application.use_cases.client.get_clients import GetClientsUseCase
from app.interfaces.schemas.client_schema import ClientCreate, ClientResponse


router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=ClientResponse, status_code=201)
def create_client(
    data: ClientCreate, 
    db: Session = Depends(get_db)
):
    repo = ClientRepositoryImpl(db)
    use_case = CreateClientUseCase(repo)
    try:
        return use_case.execute(data.name, data.email)
    except Exception as e:
        raise HTTPException(status_code=409, detail=str(e))
    
@router.get("/", response_model=list[ClientResponse])
def get_clients(
    db: Session = Depends(get_db)
):
    repo = ClientRepositoryImpl(db)
    use_case = GetClientsUseCase(repo)

    return use_case.execute()