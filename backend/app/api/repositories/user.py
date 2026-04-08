from sqlalchemy.orm import Session
from app.api.models.user import User
from typing import Optional, List

class UserRepository:
    def __init__(self, db: Session):
        self.db = db
    
    def get_by_email(self, email: str) -> Optional[User]:
        return self.db.query(User).filter(User.email == email).first()
    
    def get_by_id(self, user_id: int) -> Optional[User]:
        return self.db.query(User).filter(User.id == user_id).first()
    
    def create(self, email: str, name: str, hashed_password: str) -> User:
        db_user = User(
            email=email,
            name=name,
            hashed_password=hashed_password
        )
        self.db.add(db_user)
        self.db.commit()
        self.db.refresh(db_user)
        return db_user
    
    def get_all(self, skip: int = 0, limit: int = 100, search: Optional[str] = None) -> List[User]:
        query = self.db.query(User)
        if search:
            from sqlalchemy import or_
            query = query.filter(
                or_(
                    User.name.ilike(f"%{search}%"),
                    User.email.ilike(f"%{search}%")
                )
            )
        return query.offset(skip).limit(limit).all()
    
    def update(self, user: User, update_data: dict) -> User:
        for field, value in update_data.items():
            setattr(user, field, value)
        self.db.commit()
        self.db.refresh(user)
        return user
    
    def delete(self, user: User) -> None:
        self.db.delete(user)
        self.db.commit()