from app.domain.repositories.cost_repository import CostRepository
from app.infrastructure.db.models import CostModel
from app.domain.entities.cost import Cost

class CostRepositoryImpl(CostRepository):

    def __init__(self, db):
        self.db = db

    def create(self, cost: Cost):
        db_cost = CostModel(
            client_id=cost.client_id,
            description=cost.description,
            amount=cost.amount
        )
        self.db.add(db_cost)
        self.db.commit()
        self.db.refresh(db_cost)

        return Cost(
            db_cost.id,
            db_cost.client_id,
            db_cost.description,
            db_cost.amount
        )

    def get_by_client(self, client_id: int):
        costs = self.db.query(CostModel).filter(
            CostModel.client_id == client_id
        ).all()

        return [
            Cost(c.id, c.client_id, c.description, c.amount)
            for c in costs
        ]