from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.app.core.db import get_db
from backend.app.api.models.attendance import Attendance
from backend.app.api.models.event import Event
from backend.app.api.models.user import User
from backend.app.api.schemas.attendance import AttendanceRecord, AttendanceCreate
from backend.app.core.security import get_current_user

router = APIRouter()

@router.get("/my", response_model=List[AttendanceRecord])
async def get_my_attendance(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    attendance_records = db.query(Attendance).filter(Attendance.user_id == current_user.id).all()
    
    records = []
    for record in attendance_records:
        records.append(AttendanceRecord(
            event_id=record.event_id,
            event_title=record.event.title,
            attended=record.attended,
            date=record.date
        ))
    
    return records

@router.post("/", response_model=AttendanceRecord)
async def create_attendance_record(
    attendance_data: AttendanceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    event = db.query(Event).filter(Event.id == attendance_data.event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    existing_record = db.query(Attendance).filter(
        Attendance.user_id == current_user.id,
        Attendance.event_id == attendance_data.event_id
    ).first()
    
    if existing_record:
        raise HTTPException(status_code=400, detail="Attendance record already exists")
    
    db_attendance = Attendance(
        user_id=current_user.id,
        event_id=attendance_data.event_id,
        attended=attendance_data.attended
    )
    
    db.add(db_attendance)
    db.commit()
    db.refresh(db_attendance)
    
    return AttendanceRecord(
        event_id=db_attendance.event_id,
        event_title=event.title,
        attended=db_attendance.attended,
        date=db_attendance.date
    )

@router.put("/{event_id}")
async def update_attendance(
    event_id: int,
    attended: bool,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    attendance_record = db.query(Attendance).filter(
        Attendance.user_id == current_user.id,
        Attendance.event_id == event_id
    ).first()
    
    if not attendance_record:
        raise HTTPException(status_code=404, detail="Attendance record not found")
    
    attendance_record.attended = attended
    db.commit()
    
    return {"message": f"Attendance for event {event_id} updated to {attended}"}