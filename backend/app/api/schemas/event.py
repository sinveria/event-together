from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class EventBase(BaseModel):
    title: str
    description: str
    date: datetime
    location: str
    price: float = 0.0
    max_participants: int

class EventCreate(EventBase):
    pass

class EventUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    date: Optional[datetime] = None
    location: Optional[str] = None
    price: Optional[float] = None
    max_participants: Optional[int] = None

class Catalog(BaseModel):
    id: int
    title: str
    date: datetime
    location: str
    price: float
    organizer: str
    max_participants: int

    class Config:
        from_attributes = True

class EventResponse(EventBase):
    id: int
    organizer: str
    current_participants: int = 0
    created_at: datetime

    class Config:
        from_attributes = True