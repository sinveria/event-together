from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List

class GroupBase(BaseModel):
    name: str
    description: Optional[str] = None
    max_members: int

class GroupCreate(GroupBase):
    event_id: int

class GroupUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    max_members: Optional[int] = None
    is_open: Optional[bool] = None

class GroupCatalog(BaseModel):
    id: int
    event_id: int
    name: str
    members_count: int
    max_members: int
    is_open: bool

    class Config:
        from_attributes = True

class GroupResponse(GroupBase):
    id: int
    event_id: int
    members_count: int
    is_open: bool
    organizer_id: int
    created_at: datetime

    class Config:
        from_attributes = True

class GroupMember(BaseModel):
    user_id: int
    name: str
    email: str