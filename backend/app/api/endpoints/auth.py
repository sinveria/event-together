from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.api.core.db import get_db
from app.api.models.user import User
from app.api.schemas.user import UserCreate, UserResponse, Token, TokenRefresh
from app.api.core.security import (
    get_current_user, 
    create_access_token, 
    create_refresh_token, 
    verify_refresh_token_in_db
)
from app.api.services.auth import AuthService

router = APIRouter(tags=["authentication"])

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserCreate, db: Session = Depends(get_db)):
    auth_service = AuthService(db)
    
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    hashed_password = auth_service.get_password_hash(user_data.password)
    db_user = User(
        email=user_data.email,
        name=user_data.name,
        hashed_password=hashed_password,
        role="user"
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    return db_user

@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    auth_service = AuthService(db)
    
    user = auth_service.authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(data={"sub": user.email, "user_id": user.id})
    refresh_token = create_refresh_token(user.id, user.email)

    user.refresh_token = refresh_token
    db.commit()
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }

@router.post("/refresh", response_model=Token)
async def refresh_token_endpoint(token_data: TokenRefresh, db: Session = Depends(get_db)):
    user = verify_refresh_token_in_db(token_data.refresh_token, db)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session expired or invalid (logged out from another device)",
            headers={"WWW-Authenticate": "Bearer"},
        )

    new_access_token = create_access_token(data={"sub": user.email, "user_id": user.id})
    new_refresh_token = create_refresh_token(user.id, user.email)

    user.refresh_token = new_refresh_token
    db.commit()
    
    return {
        "access_token": new_access_token,
        "refresh_token": new_refresh_token,
        "token_type": "bearer"
    }

@router.post("/logout")
async def logout(
    token_data: TokenRefresh,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    current_user.refresh_token = None
    db.commit()
    
    return {"message": "Successfully logged out"}

@router.post("/logout-all")
async def logout_all_sessions(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    current_user.refresh_token = None
    db.commit()
    
    return {"message": "All sessions revoked"}

@router.get("/me", response_model=UserResponse)
async def get_current_user_profile(current_user: User = Depends(get_current_user)):
    return current_user
