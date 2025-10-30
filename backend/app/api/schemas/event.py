from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class Catalog(BaseModel):
    id: int
    title: str
    date: datetime
    location: str
    price: float
    organizer: str
    max_participants: int

class EventResponse(BaseModel):
    id: int
    title: str
    description: str
    date: datetime
    location: str
    price: float
    organizer: str
    max_participants: int
    current_participants: int

class EventCreate(BaseModel):
    title: str
    description: str
    date: datetime
    location: str
    price: float
    organizer: str
    max_participants: int