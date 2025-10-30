from typing import List
from fastapi import APIRouter
from backend.app.api.schemas.attendance import AttendanceRecord

router = APIRouter()

@router.get("/my", response_model=List[AttendanceRecord])
async def get_my_attendance():
    return [
        {
            "event_id": 5,
            "event_title": "Марафон",
            "attended": True,
            "date": "2025-10-20T09:00:00"
        }
    ]