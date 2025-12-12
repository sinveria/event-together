from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload, selectinload
from backend.app.api.core.db import get_db
from backend.app.api.models.group import Group, group_members
from backend.app.api.models.user import User
from backend.app.api.models.event import Event
from backend.app.api.schemas.group import GroupCatalog, GroupResponse, GroupCreate, GroupUpdate
from backend.app.api.core.security import get_current_user
from sqlalchemy import select

router = APIRouter()

@router.get("/", response_model=List[GroupCatalog])
async def get_groups(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    
    groups = db.query(Group).options(
        joinedload(Group.organizer),
        selectinload(Group.members)
    ).all()
    
    result = []
    for group in groups:
        is_member = False
        if current_user:
            member_ids = [member.id for member in group.members]
            is_member = current_user.id in member_ids
        
        result.append({
            "id": group.id,
            "event_id": group.event_id,
            "name": group.name,
            "description": group.description,
            "members_count": group.members_count,
            "max_members": group.max_members,
            "is_open": group.is_open,
            "organizer_name": group.organizer_name,
            "created_at": group.created_at,
            "current_user_is_member": is_member
        })
    
    return result

@router.get("/{group_id}/check-membership")
async def check_group_membership(
    group_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    group = db.query(Group).options(selectinload(Group.members)).filter(Group.id == group_id).first()
    if not group:
        raise HTTPException(status_code=404, detail="Group not found")

    is_member = any(member.id == current_user.id for member in group.members)
    
    return {"is_member": is_member}

@router.post("/", response_model=GroupResponse)
async def create_group(
    group_data: GroupCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    event = db.query(Event).filter(Event.id == group_data.event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    db_group = Group(**group_data.dict(), organizer_id=current_user.id)
    db_group.members.append(current_user)
    
    db.add(db_group)
    db.commit()
    db.refresh(db_group)
    return db_group

@router.get("/{group_id}", response_model=GroupResponse)
async def get_group(group_id: int, db: Session = Depends(get_db)):
    group = db.query(Group).filter(Group.id == group_id).first()
    if not group:
        raise HTTPException(status_code=404, detail="Group not found")
    return group

@router.put("/{group_id}", response_model=GroupResponse)
async def update_group(
    group_id: int,
    group_data: GroupUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    group = db.query(Group).filter(Group.id == group_id).first()
    if not group:
        raise HTTPException(status_code=404, detail="Group not found")
    
    if group.organizer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to update this group")
    
    update_data = group_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(group, field, value)
    
    db.commit()
    db.refresh(group)
    return group

@router.delete("/{group_id}")
async def delete_group(
    group_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    group = db.query(Group).filter(Group.id == group_id).first()
    if not group:
        raise HTTPException(status_code=404, detail="Group not found")
    
    if group.organizer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this group")
    
    db.delete(group)
    db.commit()
    return {"message": f"Group {group_id} deleted successfully"}

@router.post("/{group_id}/join")
async def join_group(
    group_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    group = db.query(Group).options(selectinload(Group.members)).filter(Group.id == group_id).first()
    if not group:
        raise HTTPException(status_code=404, detail="Group not found")
    
    if not group.is_open:
        raise HTTPException(status_code=400, detail="Group is closed")
    
    member_ids = [member.id for member in group.members]
    if current_user.id in member_ids:
        raise HTTPException(status_code=400, detail="Already a member of this group")
    
    if len(group.members) >= group.max_members:
        raise HTTPException(status_code=400, detail="Group is full")
    
    group.members.append(current_user)
    db.commit()
    return {"message": f"Successfully joined group {group_id}"}

@router.post("/{group_id}/leave")
async def leave_group(
    group_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    group = db.query(Group).options(selectinload(Group.members)).filter(Group.id == group_id).first()
    if not group:
        raise HTTPException(status_code=404, detail="Group not found")

    member_ids = [member.id for member in group.members]
    if current_user.id not in member_ids:
        raise HTTPException(status_code=400, detail="Not a member of this group")
    
    if group.organizer_id == current_user.id:
        raise HTTPException(status_code=400, detail="Organizer cannot leave the group")
    
    group.members.remove(current_user)
    db.commit()
    return {"message": f"Successfully left group {group_id}"}