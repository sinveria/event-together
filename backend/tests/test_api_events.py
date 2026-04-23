import pytest
from fastapi.testclient import TestClient

def test_create_event_success(client: TestClient, test_user):
    token = test_user["token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    event_data = {
        "title": "Конференция Fullstack",
        "description": "Лучшая конференция года",
        "date": "2026-12-01T10:00:00",
        "location": "Москва, Кремль",
        "price": 5000.0,
        "max_participants": 100,
        "category_id": None
    }
    
    response = client.post("/events/", json=event_data, headers=headers)
    
    assert response.status_code == 201 or response.status_code == 200
    data = response.json()
    assert data["title"] == event_data["title"]
    assert "id" in data

def test_create_event_unauthorized(client: TestClient):
    event_data = {"title": "Hackathon", "description": "...", "date": "2026-12-01T10:00:00", "location": "SPb", "price": 0, "max_participants": 50}
    
    response = client.post("/events/", json=event_data)
    
    assert response.status_code == 401

def test_get_events_pagination(client: TestClient, test_user):
    token = test_user["token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    for i in range(15):
        client.post("/events/", json={
            "title": f"Event {i}",
            "description": "Desc",
            "date": "2026-12-01T10:00:00",
            "location": "Moscow",
            "price": 0,
            "max_participants": 10
        }, headers=headers)
    
    response = client.get("/events/?skip=0&limit=10")
    assert response.status_code == 200
    data = response.json()
    assert len(data["items"]) == 10
    assert data["total"] == 15
    
    response = client.get("/events/?skip=10&limit=10")
    data = response.json()
    assert len(data["items"]) == 5