from pydantic import BaseModel
from datetime import datetime

class ChatMessage(BaseModel):
    id: int
    group_id: int
    user_id: int
    username: str
    text: str
    timestamp: datetime