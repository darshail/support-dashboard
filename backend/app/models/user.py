from pydantic import BaseModel, EmailStr


class User(BaseModel):
    id: str
    email: EmailStr
    name: str
    roles: list[str] = []


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: User


class TokenData(BaseModel):
    sub: str | None = None
    email: str | None = None
    roles: list[str] = []
