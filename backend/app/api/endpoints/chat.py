# backend/app/api/endpoints/chat.py
from typing import List
from fastapi import APIRouter
from backend.app.api.schemas.chat import ChatMessage

router = APIRouter()

@router.get("/groups/{group_id}/messages", response_model=List[ChatMessage])
async def get_chat_messages(group_id: int):
    return [
        {
            "id": 1,
            "group_id": group_id,
            "user_id": 1,
            "username": "Алиса",
            "text": "Привет!",
            "timestamp": "2025-10-30T12:00:00"
        },
        {
            "id": 2,
            "group_id": group_id,
            "user_id": 2,
            "username": "Боб",
            "text": "Кто идёт?",
            "timestamp": "2025-10-30T12:05:00"
        }
    ]