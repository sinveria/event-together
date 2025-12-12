from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from enum import Enum

class UserBase(BaseModel):
    email: EmailStr
    name: str
    about: Optional[str] = None
    interests: List[str] = []
    role: str = "user"
    is_active: bool = True

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    avatar_url: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class UserUpdate(BaseModel):
    name: Optional[str] = None
    about: Optional[str] = None
    interests: Optional[List[str]] = None
    avatar_url: Optional[str] = None
    role: Optional[str] = None
    is_active: Optional[bool] = None

class Token(BaseModel):
    access_token: str
    token_type: str