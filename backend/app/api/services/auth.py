from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
import os
from dotenv import load_dotenv
import bcrypt
from sqlalchemy.orm import Session
from app.api.repositories.user import UserRepository
from app.api.models.user import User

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

refresh_tokens_store: dict = {}

class AuthService:
    def __init__(self, db: Session):
        self.db = db
        self.user_repo = UserRepository(db)
    
    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        try:
            return bcrypt.checkpw(
                plain_password.encode('utf-8'),
                hashed_password.encode('utf-8')
            )
        except ValueError:
            from passlib.context import CryptContext
            temp_pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
            return temp_pwd_context.verify(plain_password, hashed_password)
    
    def get_password_hash(self, password: str) -> str:
        salt = bcrypt.gensalt()
        hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
        return hashed.decode('utf-8')
    
    def create_access_token(self, data: dict, expires_delta: Optional[timedelta] = None) -> str:
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        to_encode.update({"exp": expire, "type": "access"})
        encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
        return encoded_jwt
    
    def create_refresh_token(self, user_id: int, email: str) -> str:
        expire = datetime.utcnow() + timedelta(days=365)
        to_encode = {
            "sub": email,
            "user_id": user_id,
            "exp": expire,
            "type": "refresh"
        }
        encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

        refresh_tokens_store[encoded_jwt] = {
            "user_id": user_id,
            "expires": expire
        }
        
        return encoded_jwt
    
    def verify_token(self, token: str, token_type: str = "access") -> Optional[dict]:
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            if payload.get("type") != token_type:
                return None
            return payload
        except JWTError:
            return None
    
    def refresh_access_token(self, refresh_token: str) -> Optional[str]:
        payload = self.verify_token(refresh_token, token_type="refresh")
        if not payload:
            return None

        if refresh_token not in refresh_tokens_store:
            return None

        user = self.user_repo.get_by_id(payload.get("user_id"))
        if not user or not user.is_active:
            return None

        return self.create_access_token(data={"sub": user.email, "user_id": user.id})
    
    def revoke_refresh_token(self, refresh_token: str) -> bool:
        if refresh_token in refresh_tokens_store:
            del refresh_tokens_store[refresh_token]
            return True
        return False
    
    def revoke_all_user_tokens(self, user_id: int) -> int:
        revoked = 0
        tokens_to_remove = [
            token for token, data in refresh_tokens_store.items()
            if data.get("user_id") == user_id
        ]
        for token in tokens_to_remove:
            del refresh_tokens_store[token]
            revoked += 1
        return revoked
    
    def authenticate_user(self, email: str, password: str) -> Optional[User]:
        user = self.user_repo.get_by_email(email)
        if not user:
            return None
        if not self.verify_password(password, user.hashed_password):
            return None
        if not user.is_active:
            return None
        return user