from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api.core.db import get_db
from app.api.models.user import User, UserRole
from app.api.core.security import get_current_user
from typing import List

async def get_current_active_user(
    current_user: User = Depends(get_current_user)
) -> User:
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="User is inactive")
    return current_user

async def get_current_moderator(
    current_user: User = Depends(get_current_active_user)
) -> User:
    if current_user.role not in [UserRole.MODERATOR.value, UserRole.ADMIN.value]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Moderator or admin access required"
        )
    return current_user

async def get_current_admin(
    current_user: User = Depends(get_current_active_user)
) -> User:
    if current_user.role != UserRole.ADMIN.value:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    return current_user

async def check_admin_or_moderator(
    current_user: User = Depends(get_current_active_user)
) -> User:
    return await get_current_moderator(current_user=current_user)

async def check_event_ownership(
    event_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
) -> User:
    from app.api.models.event import Event
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    if current_user.role in [UserRole.ADMIN.value, UserRole.MODERATOR.value]:
        return current_user
    
    if event.organizer_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    return current_user

async def check_group_ownership(
    group_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
) -> User:
    from app.api.models.group import Group
    group = db.query(Group).filter(Group.id == group_id).first()
    if not group:
        raise HTTPException(status_code=404, detail="Group not found")
    
    if current_user.role in [UserRole.ADMIN.value, UserRole.MODERATOR.value]:
        return current_user
    
    if group.organizer_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    return current_user

def require_role(allowed_roles: List[str]):
    async def role_checker(
        current_user: User = Depends(get_current_active_user)
    ) -> User:
        if current_user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Required one of roles: {allowed_roles}"
            )
        return current_user
    return role_checker