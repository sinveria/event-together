from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.app.core.db import get_db
from backend.app.api.models.chat import ChatMessage
from backend.app.api.models.group import Group
from backend.app.api.models.user import User
from backend.app.api.schemas.chat import ChatMessage as ChatMessageSchema, ChatMessageCreate
from backend.app.core.security import get_current_user

router = APIRouter()

@router.get("/groups/{group_id}/messages", response_model=List[ChatMessageSchema])
async def get_chat_messages(
    group_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    group = db.query(Group).filter(Group.id == group_id).first()
    if not group:
        raise HTTPException(status_code=404, detail="Group not found")
    
    if current_user not in group.members:
        raise HTTPException(status_code=403, detail="Not a member of this group")
    
    messages = db.query(ChatMessage).filter(ChatMessage.group_id == group_id).order_by(ChatMessage.timestamp).all()
    return messages

@router.post("/groups/{group_id}/messages", response_model=ChatMessageSchema)
async def create_chat_message(
    group_id: int,
    message_data: ChatMessageCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    group = db.query(Group).filter(Group.id == group_id).first()
    if not group:
        raise HTTPException(status_code=404, detail="Group not found")
    
    if current_user not in group.members:
        raise HTTPException(status_code=403, detail="Not a member of this group")
    
    db_message = ChatMessage(
        group_id=group_id,
        user_id=current_user.id,
        text=message_data.text
    )
    
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    return db_message