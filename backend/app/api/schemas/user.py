from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    name: str
    about: Optional[str] = None
    interests: List[str] = []

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    avatar_url: Optional[str] = None
    role: str = "user"
    is_active: bool = True
    created_at: datetime

    class Config:
        from_attributes = True

class UserUpdate(BaseModel):
    name: Optional[str] = None
    about: Optional[str] = None
    interests: Optional[List[str]] = None
    avatar_url: Optional[str] = None

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"

class TokenRefresh(BaseModel):
    refresh_token: str

class LoginRequest(BaseModel):
    email: str
    password: str