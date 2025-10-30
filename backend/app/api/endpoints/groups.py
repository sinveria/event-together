from typing import List
from fastapi import APIRouter
from backend.app.api.schemas.group import GroupCatalog, GroupResponse, GroupCreate

router = APIRouter()

@router.get("/", response_model=List[GroupCatalog])
async def get_groups():
    return [
        {
            "id": 1,
            "event_id": 1,
            "name": "Идём вместе!",
            "members_count": 3,
            "max_members": 10,
            "is_open": True
        }
    ]

@router.post("/", response_model=GroupResponse)
async def create_group(group_data: GroupCreate):
    return GroupResponse(
        id=99,
        event_id=group_data.event_id,
        name=group_data.name,
        description=group_data.description,
        members_count=1,
        max_members=group_data.max_members,
        is_open=True,
        organizer_id=123,
        created_at="2025-10-30T12:00:00"
    )

@router.post("/{group_id}/join")
async def join_group(group_id: int):
    return {"message": f"Joined group {group_id}"}

@router.post("/{group_id}/leave")
async def leave_group(group_id: int):
    return {"message": f"Left group {group_id}"}