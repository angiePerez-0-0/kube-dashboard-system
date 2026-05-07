from pydantic import BaseModel, Field

class LoginRequest(BaseModel):
    email: str
    password: str

class TokenResponse(BaseModel):
    access_token: str

class RegisterRequest(BaseModel):
    email: str
    password: str = Field(min_length=6, max_length=72, description="Password must be between 6 and 72 characters")