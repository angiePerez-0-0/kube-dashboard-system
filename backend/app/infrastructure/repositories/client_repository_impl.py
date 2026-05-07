from app.domain.repositories.client_repository import ClientRepository
from app.infrastructure.db.models import ClientModel
from app.domain.entities.client import Client

class ClientRepositoryImpl(ClientRepository):

    def __init__(self, db):
        self.db = db

    def create(self, client: Client):
        db_client = ClientModel(
            name=client.name,
            email=client.email
        )
        self.db.add(db_client)
        self.db.commit()
        self.db.refresh(db_client)

        return Client(db_client.id, db_client.name, db_client.email)

    def get_all(self):
        clients = self.db.query(ClientModel).all()

        return [
            Client(c.id, c.name, c.email)
            for c in clients
        ]
    
    def get_by_email(self, email: str):
        client = self.db.query(ClientModel).filter(ClientModel.email == email).first()

        if not client:
            return None

        return Client(client.id, client.name, client.email)