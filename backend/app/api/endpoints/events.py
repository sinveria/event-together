from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session, joinedload
from app.api.core.db import get_db
from app.api.models.event import Event
from app.api.models.user import User
from app.api.models.category import Category
from app.api.schemas.event import Catalog, EventResponse, EventCreate, EventUpdate
from app.api.core.security import get_current_user

router = APIRouter()

@router.get("/", response_model=List[Catalog])
async def get_events_catalog(
    skip: int = 0,
    limit: int = 10,
    search: Optional[str] = Query(None),
    category_id: Optional[int] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(Event).join(User, Event.organizer_id == User.id).options(joinedload(Event.organizer))
    
    if search:
        query = query.filter(Event.title.ilike(f"%{search}%"))
    
    if category_id:
        query = query.filter(Event.category_id == category_id)
    
    events = query.offset(skip).limit(limit).all()
    
    catalog_events = []
    for event in events:
        catalog_events.append({
            "id": event.id,
            "title": event.title,
            "description": event.description,
            "date": event.date,
            "location": event.location,
            "price": event.price,
            "organizer_name": event.organizer.name if event.organizer else "Неизвестно",
            "max_participants": event.max_participants,
            "category_id": event.category_id
        })
    
    return catalog_events

@router.post("/", response_model=EventResponse)
async def create_event(
    event_data: EventCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if event_data.category_id:
        category = db.query(Category).filter(Category.id == event_data.category_id).first()
        if not category:
            raise HTTPException(status_code=400, detail="Category not found")
    
    db_event = Event(
        title=event_data.title,
        description=event_data.description,
        date=event_data.date,
        location=event_data.location,
        price=event_data.price,
        max_participants=event_data.max_participants,
        organizer_id=current_user.id,
        category_id=event_data.category_id
    )
    
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    
    category_name = None
    if db_event.category_id:
        category = db.query(Category).filter(Category.id == db_event.category_id).first()
        category_name = category.name if category else None

    db.refresh(db_event, ['organizer'])
    
    return {
        "id": db_event.id,
        "title": db_event.title,
        "description": db_event.description,
        "date": db_event.date,
        "location": db_event.location,
        "price": db_event.price,
        "max_participants": db_event.max_participants,
        "category_id": db_event.category_id,
        "category_name": category_name,
        "organizer_id": db_event.organizer_id,
        "organizer_name": db_event.organizer.name if db_event.organizer else "Неизвестно",
        "current_participants": 0,
        "created_at": db_event.created_at
    }

@router.get("/{event_id}", response_model=EventResponse)
async def get_event(event_id: int, db: Session = Depends(get_db)):
    event = db.query(Event).options(joinedload(Event.organizer)).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    current_participants = len(event.attendance_records) if event.attendance_records else 0
    
    category_name = None
    if event.category_id:
        category = db.query(Category).filter(Category.id == event.category_id).first()
        category_name = category.name if category else None
    
    return {
        "id": event.id,
        "title": event.title,
        "description": event.description,
        "date": event.date,
        "location": event.location,
        "price": event.price,
        "max_participants": event.max_participants,
        "category_id": event.category_id,
        "category_name": category_name,
        "organizer_id": event.organizer_id,
        "organizer_name": event.organizer.name if event.organizer else "Неизвестно",
        "current_participants": current_participants,
        "created_at": event.created_at
    }