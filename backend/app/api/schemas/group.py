from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List

class GroupBase(BaseModel):
    name: str = Field(..., min_length=3, max_length=100)
    description: Optional[str] = None
    max_members: int = Field(..., ge=2, le=100)

class GroupCreate(GroupBase):
    event_id: int

class GroupUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=3, max_length=100)
    description: Optional[str] = None
    max_members: Optional[int] = Field(None, ge=2, le=100)
    is_open: Optional[bool] = None

class GroupCatalog(BaseModel):
    id: int
    event_id: int
    name: str
    description: Optional[str] = None
    members_count: int
    max_members: int
    is_open: bool
    organizer_name: str
    current_user_is_member: Optional[bool] = None
    created_at: datetime

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