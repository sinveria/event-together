from typing import List, Optional
from fastapi import APIRouter, Query
from backend.app.api.schemas.event import Catalog, EventResponse, EventCreate

router = APIRouter()

@router.get("/", response_model=List[Catalog])
async def get_events_catalog(
    skip: int = 0,
    limit: int = 10,
    search: Optional[str] = Query(None)
):
    return [
        {
            "id": 1,
            "title": "Концерт в парке",
            "date": "2025-11-15T18:00:00",
            "location": "Центральный парк",
            "price": 0.0,
            "organizer": "Городская администрация",
            "max_participants": 500
        },
        {
            "id": 2,
            "title": "Хакатон",
            "date": "2025-12-01T10:00:00",
            "location": "IT Hub",
            "price": 500.0,
            "organizer": "Tech Community",
            "max_participants": 100
        }
    ]

@router.post("/", response_model=EventResponse)
async def create_event(event_data: EventCreate):
    return EventResponse(
        id=99,
        title=event_data.title,
        description=event_data.description,
        date=event_data.date,
        location=event_data.location,
        price=event_data.price,
        organizer=event_data.organizer,
        max_participants=event_data.max_participants,
        current_participants=0
    )

@router.get("/{event_id}", response_model=EventResponse)
async def get_event(event_id: int):
    return EventResponse(
        id=event_id,
        title="Детали события",
        description="Описание...",
        date="2025-11-15T18:00:00",
        location="Адрес",
        price=0.0,
        organizer="Организатор",
        max_participants=100,
        current_participants=5
    )

@router.delete("/{event_id}")
async def delete_event(event_id: int):
    return {"message": f"Event {event_id} deleted"}