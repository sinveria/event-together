from pydantic import BaseModel
from typing import Optional

class UserBase(BaseModel):
    email: str
    name: str
    interests: list[str]

class UserResponse(UserBase):
    id: int
    avatar_url: Optional[str] = None

class UserCreate(UserBase):
    password: str