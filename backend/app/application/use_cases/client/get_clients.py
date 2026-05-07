class GetClientsUseCase:

    def __init__(self, client_repo):
        self.client_repo = client_repo

    def execute(self):
        return self.client_repo.get_all()