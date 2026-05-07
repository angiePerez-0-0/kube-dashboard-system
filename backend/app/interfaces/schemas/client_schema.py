from pydantic import BaseModel

class ClientCreate(BaseModel):
    name: str
    email: str

class ClientResponse(BaseModel):
    id: int
    name: str
    email: str

    class Config:
        from_attributes = True