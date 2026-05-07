from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.infrastructure.db.session import SessionLocal
from app.infrastructure.repositories.cost_repository_impl import CostRepositoryImpl
from app.application.use_cases.cost.create_cost import CreateCostUseCase
from app.application.use_cases.cost.get_costs_by_client import GetCostsByClientUseCase
from app.interfaces.schemas.cost_schema import CostCreate, CostResponse

from app.core.security.dependencies import get_current_user

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=CostResponse)
def create_cost(
    data: CostCreate,
    db: Session = Depends(get_db)
):
    repo = CostRepositoryImpl(db)
    use_case = CreateCostUseCase(repo)

    return use_case.execute(
        data.client_id,
        data.description,
        data.amount
    )

@router.get("/{client_id}", response_model=list[CostResponse])
def get_costs(
    client_id: int,
    db: Session = Depends(get_db)
):
    repo = CostRepositoryImpl(db)
    use_case = GetCostsByClientUseCase(repo)

    return use_case.execute(client_id)