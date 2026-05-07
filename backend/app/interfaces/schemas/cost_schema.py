from pydantic import BaseModel

class CostCreate(BaseModel):
    client_id: int
    description: str
    amount: float

class CostResponse(BaseModel):
    id: int
    client_id: int
    description: str
    amount: float

    class Config:
        from_attributes = True