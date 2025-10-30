from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class GroupCatalog(BaseModel):
    id: int
    event_id: int
    name: str
    members_count: int
    max_members: int
    is_open: bool

class GroupResponse(BaseModel):
    id: int
    event_id: int
    name: str
    description: Optional[str] = None
    members_count: int
    max_members: int
    is_open: bool
    organizer_id: int
    created_at: datetime

class GroupCreate(BaseModel):
    event_id: int
    name: str
    description: Optional[str] = None
    max_members: int