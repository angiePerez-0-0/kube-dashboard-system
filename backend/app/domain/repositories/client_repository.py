from abc import ABC, abstractmethod

class ClientRepository(ABC):

    @abstractmethod
    def create(self, client):
        pass

    @abstractmethod
    def get_all(self):
        pass

    @abstractmethod
    def get_by_email(self, email: str):
        pass