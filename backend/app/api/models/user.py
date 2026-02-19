from sqlalchemy import Column, Integer, String, DateTime, Table, ForeignKey, Boolean, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.api.core.db import Base

user_interests = Table(
    'user_interests',
    Base.metadata,
    Column('user_id', Integer, ForeignKey('users.id')),
    Column('interest', String(50))
)

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    name = Column(String(100), nullable=False)
    about = Column(String, nullable=True) 
    hashed_password = Column(String(255), nullable=False)
    avatar_url = Column(String(500), nullable=True)
    role = Column(String(20), default="user", nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    organized_events = relationship("Event", back_populates="organizer", lazy='dynamic')
    organized_groups = relationship("Group", back_populates="organizer")
    messages = relationship("ChatMessage", back_populates="user")
    attendance_records = relationship("Attendance", back_populates="user")
    groups = relationship("Group", secondary="group_members", back_populates="members")