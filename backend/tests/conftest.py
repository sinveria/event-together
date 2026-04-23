import sys
import os
import bcrypt
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

import pytest
from typing import Generator
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.main import app
from app.api.core.db import Base, get_db
from app.api.core.security import create_access_token
from app.api.models.user import User

SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool
)

TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

@pytest.fixture(scope="function", autouse=True)
def setup_database():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)

@pytest.fixture(scope="function")
def client() -> Generator[TestClient, None, None]:
    with TestClient(app) as c:
        yield c

@pytest.fixture(scope="function")
def test_user(client: TestClient):
    db = TestingSessionLocal()
    
    from passlib.context import CryptContext
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    
    user_data = {
        "email": "test@example.com",
        "name": "Test User",
        "role": "user",
        "hashed_password": bcrypt.hashpw("securepassword123".encode('utf-8'), bcrypt.gensalt()).decode('utf-8'),
        "is_active": True
    }
    
    if not hasattr(User, 'name'):
        user_data.pop('name', None)

    try:
        user = User(**user_data)
        db.add(user)
        db.commit()
        db.refresh(user)
        
        token = create_access_token(data={"sub": user.email, "role": user.role})
        
        yield {"user": user, "token": token}
    except Exception:
        db.rollback()
        raise
    finally:
        try:
            db.delete(user)
            db.commit()
        except Exception:
            db.rollback()
        finally:
            db.close()