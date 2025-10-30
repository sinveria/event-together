from fastapi import APIRouter

router = APIRouter()

@router.post("/login")
async def login():
    return {"access_token": "fake-jwt-token-for-dev", "token_type": "bearer"}

@router.post("/register")
async def register():
    return {"message": "Регистрация успешна (заглушка)"}