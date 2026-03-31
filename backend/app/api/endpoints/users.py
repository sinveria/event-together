from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from app.api.core.db import get_db
from app.api.models.user import User
from app.api.schemas.user import UserResponse, UserUpdate
from app.api.core.security import get_current_user
from app.api.core.s3 import upload_avatar, delete_avatar
import uuid
from pathlib import Path
from io import BytesIO

router = APIRouter()

@router.get("/me", response_model=UserResponse)
async def get_current_user_profile(current_user: User = Depends(get_current_user)):
    return current_user

@router.put("/me", response_model=UserResponse)
async def update_profile(
    user_data: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    update_data = user_data.dict(exclude_unset=True)
    
    for field, value in update_data.items():
        setattr(current_user, field, value)
    
    db.commit()
    db.refresh(current_user)
    return current_user

@router.delete("/me")
async def delete_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db.delete(current_user)
    db.commit()
    return {"message": "User deleted successfully"}

@router.post("/me/avatar")
async def upload_user_avatar(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    allowed_types = ["image/jpeg", "image/png", "image/webp"]
    if file.content_type not in allowed_types:
        raise HTTPException(400, detail="Разрешены только JPEG, PNG, WebP")
    
    contents = await file.read()
    if len(contents) > 5 * 1024 * 1024:
        raise HTTPException(400, detail="Максимальный размер файла — 5MB")
    
    ext = Path(file.filename).suffix or ".jpg"
    filename = f"{uuid.uuid4()}{ext}"
    
    file_url = upload_avatar(BytesIO(contents), current_user.id, filename, file.content_type)
    
    if current_user.avatar_url:
        delete_avatar(current_user.avatar_url)
    
    current_user.avatar_url = file_url
    db.commit()
    db.refresh(current_user)
    
    return {"avatar_url": file_url}

@router.delete("/me/avatar")
async def delete_user_avatar(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not current_user.avatar_url:
        raise HTTPException(404, detail="Аватар не найден")
    
    delete_avatar(current_user.avatar_url)
    current_user.avatar_url = None
    db.commit()
    
    return {"message": "Аватар удалён"}