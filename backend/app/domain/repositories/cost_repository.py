from abc import ABC, abstractmethod

class CostRepository(ABC):

    @abstractmethod
    def create(self, cost):
        pass

    @abstractmethod
    def get_by_client(self, client_id: int):
        pass