from app.domain.entities.cost import Cost

class CreateCostUseCase:

    def __init__(self, cost_repo):
        self.cost_repo = cost_repo

    def execute(self, client_id: int, description: str, amount: float):
        cost = Cost(
            id=None,
            client_id=client_id,
            description=description,
            amount=amount
        )
        return self.cost_repo.create(cost)