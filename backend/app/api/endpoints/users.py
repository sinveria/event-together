from fastapi import APIRouter
from backend.app.api.schemas.user import UserResponse, UserCreate

router = APIRouter()

@router.get("/me", response_model=UserResponse)
async def get_profile():
    return UserResponse(
        id=123,
        email="user@example.com",
        name="Иван",
        interests=["музыка", "спорт"],
        avatar_url="https://example.com/avatar.jpg"
    )

@router.post("/register", response_model=UserResponse)
async def register_user(user_data: UserCreate):
    return UserResponse(
        id=999,
        email=user_data.email,
        name=user_data.name,
        interests=user_data.interests,
        avatar_url=None
    )

@router.post("/login")
async def login():
    return {"access_token": "fake-jwt-token-for-dev", "token_type": "bearer"}