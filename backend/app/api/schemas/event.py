from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from .user import UserResponse

class EventBase(BaseModel):
    title: str
    description: str
    date: datetime
    location: str
    price: float = 0.0
    max_participants: int
    category_id: Optional[int] = None

class EventCreate(EventBase):
    pass

class EventUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    date: Optional[datetime] = None
    location: Optional[str] = None
    price: Optional[float] = None
    max_participants: Optional[int] = None
    category_id: Optional[int] = None

class Catalog(BaseModel):
    id: int
    title: str
    description: str
    date: datetime
    location: str
    price: float
    organizer_name: str
    max_participants: int
    category_id: Optional[int] = None

    class Config:
        from_attributes = True

class EventResponse(EventBase):
    id: int
    organizer_id: int
    organizer_name: str
    current_participants: int = 0
    created_at: datetime
    category_name: Optional[str] = None

    class Config:
        from_attributes = True