from app.domain.entities.client import Client

class CreateClientUseCase:

    def __init__(self, client_repo):
        self.client_repo = client_repo

    def execute(self, name: str, email: str):

        if self.client_repo.get_by_email(email):
            raise Exception("Client already exists")

        client = Client(id=None, name=name, email=email)
        return self.client_repo.create(client)