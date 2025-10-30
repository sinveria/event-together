from pydantic import BaseModel
from datetime import datetime

class AttendanceRecord(BaseModel):
    event_id: int
    event_title: str
    attended: bool
    date: datetime