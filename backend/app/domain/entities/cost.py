class Cost:
    def __init__(self, id: int, client_id: int, description: str, amount: float, date=None):
        self.id = id
        self.client_id = client_id
        self.description = description
        self.amount = amount
        self.date = date