from pydantic import BaseModel
from datetime import datetime

class AttendanceBase(BaseModel):
    attended: bool = False

class AttendanceCreate(AttendanceBase):
    event_id: int

class AttendanceRecord(BaseModel):
    event_id: int
    event_title: str
    attended: bool
    date: datetime

    class Config:
        from_attributes = True