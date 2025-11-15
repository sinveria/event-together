from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from backend.app.core.db import get_db
from backend.app.api.models.event import Event
from backend.app.api.models.user import User
from backend.app.api.schemas.event import Catalog, EventResponse, EventCreate, EventUpdate
from backend.app.core.security import get_current_user

router = APIRouter()

@router.get("/", response_model=List[Catalog])
async def get_events_catalog(
    skip: int = 0,
    limit: int = 10,
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(Event)
    
    if search:
        query = query.filter(Event.title.ilike(f"%{search}%"))
    
    events = query.offset(skip).limit(limit).all()
    return events

@router.post("/", response_model=EventResponse)
async def create_event(
    event_data: EventCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_event = Event(**event_data.dict(), organizer_id=current_user.id)
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event

@router.get("/{event_id}", response_model=EventResponse)
async def get_event(event_id: int, db: Session = Depends(get_db)):
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return event

@router.put("/{event_id}", response_model=EventResponse)
async def update_event(
    event_id: int,
    event_data: EventUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    if event.organizer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to update this event")
    
    update_data = event_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(event, field, value)
    
    db.commit()
    db.refresh(event)
    return event

@router.delete("/{event_id}")
async def delete_event(
    event_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    if event.organizer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this event")
    
    db.delete(event)
    db.commit()
    return {"message": f"Event {event_id} deleted successfully"}