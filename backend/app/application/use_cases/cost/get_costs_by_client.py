class GetCostsByClientUseCase:

    def __init__(self, cost_repo):
        self.cost_repo = cost_repo

    def execute(self, client_id: int):
        return self.cost_repo.get_by_client(client_id)