from typing import Annotated

from pydantic import BaseModel, EmailStr, Field, StringConstraints


NameStr = Annotated[
    str,
    StringConstraints(strip_whitespace=True, min_length=3, max_length=100)
]


class SignupRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6)
    name: NameStr


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1)


class UserResponse(BaseModel):
    id: str
    email: str
    name: str


class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
