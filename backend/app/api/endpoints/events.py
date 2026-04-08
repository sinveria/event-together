from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from datetime import datetime
from sqlalchemy import asc, desc
from sqlalchemy.orm import Session, joinedload
from app.api.core.db import get_db
from app.api.models.event import Event
from app.api.models.user import User
from app.api.models.category import Category
from app.api.schemas.event import Catalog, EventResponse, EventCreate, EventUpdate, CatalogResponse
from app.api.core.security import get_current_user
from app.api.dependencies import get_current_active_user, check_event_ownership
from app.api.services.maps import yandex_maps_service

router = APIRouter()

@router.get("/", response_model=CatalogResponse)
async def get_events_catalog(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    search: Optional[str] = Query(None),
    category_id: Optional[int] = Query(None),
    sort_by: str = Query("date", regex="^(date|price|title|created_at)$"),
    order: str = Query("asc", regex="^(asc|desc)$"),
    price_min: Optional[float] = Query(None, ge=0),
    price_max: Optional[float] = Query(None, ge=0),
    date_from: Optional[datetime] = Query(None),
    date_to: Optional[datetime] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(Event).join(User, Event.organizer_id == User.id).options(joinedload(Event.organizer))
    
    if search:
        query = query.filter(Event.title.ilike(f"%{search}%"))
    if category_id:
        query = query.filter(Event.category_id == category_id)

    if price_min is not None:
        query = query.filter(Event.price >= price_min)
    if price_max is not None:
        query = query.filter(Event.price <= price_max)
    
    if date_from:
        query = query.filter(Event.date >= date_from)
    if date_to:
        query = query.filter(Event.date <= date_to)

    total = query.count()

    sort_column = {
        "date": Event.date,
        "price": Event.price,
        "title": Event.title,
        "created_at": Event.created_at
    }.get(sort_by, Event.date)
    
    query = query.order_by(desc(sort_column) if order == "desc" else asc(sort_column))

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

    return CatalogResponse(
        items=catalog_events,
        total=total,
        skip=skip,
        limit=limit
    )

@router.post("/", response_model=EventResponse)
async def create_event(
    event_data: EventCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    if event_data.category_id:
        category = db.query(Category).filter(Category.id == event_data.category_id).first()
        if not category:
            raise HTTPException(status_code=400, detail="Category not found")
    
    coords = await yandex_maps_service.geocode_address(event_data.location)

    db_event = Event(
        title=event_data.title,
        description=event_data.description,
        date=event_data.date,
        location=event_data.location,
        price=event_data.price,
        max_participants=event_data.max_participants,
        organizer_id=current_user.id,
        category_id=event_data.category_id,
        latitude=coords["latitude"] if coords else None,
        longitude=coords["longitude"] if coords else None,
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

@router.put("/{event_id}", response_model=EventResponse)
async def update_event(
    event_id: int,
    event_data: EventUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(check_event_ownership)
):
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
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
    current_user: User = Depends(check_event_ownership)
):
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    db.delete(event)
    db.commit()
    return {"message": f"Event {event_id} deleted successfully"}