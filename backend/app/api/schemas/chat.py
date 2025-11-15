from pydantic import BaseModel
from datetime import datetime

class ChatMessageBase(BaseModel):
    text: str

class ChatMessageCreate(ChatMessageBase):
    pass

class ChatMessage(BaseModel):
    id: int
    group_id: int
    user_id: int
    username: str
    text: str
    timestamp: datetime

    class Config:
        from_attributes = True