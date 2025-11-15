from sqlalchemy import Column, Integer, String, Boolean, DateTime, Float, Text, ForeignKey, Table
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from backend.app.core.db import Base

group_members = Table(
    'group_members',
    Base.metadata,
    Column('user_id', Integer, ForeignKey('users.id')),
    Column('group_id', Integer, ForeignKey('groups.id'))
)

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
    hashed_password = Column(String(255), nullable=False)
    avatar_url = Column(String(500), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    organized_events = relationship("Event", back_populates="organizer")
    organized_groups = relationship("Group", back_populates="organizer")
    messages = relationship("ChatMessage", back_populates="user")
    attendance_records = relationship("Attendance", back_populates="user")
    groups = relationship("Group", secondary=group_members, back_populates="members")

class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    description = Column(Text)
    date = Column(DateTime(timezone=True), nullable=False)
    location = Column(String(300), nullable=False)
    price = Column(Float, default=0.0)
    organizer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    max_participants = Column(Integer, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    organizer = relationship("User", back_populates="organized_events")
    groups = relationship("Group", back_populates="event")
    attendance_records = relationship("Attendance", back_populates="event")

class Group(Base):
    __tablename__ = "groups"

    id = Column(Integer, primary_key=True, index=True)
    event_id = Column(Integer, ForeignKey("events.id"), nullable=False)
    name = Column(String(100), nullable=False)
    description = Column(Text)
    max_members = Column(Integer, nullable=False)
    is_open = Column(Boolean, default=True)
    organizer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    event = relationship("Event", back_populates="groups")
    organizer = relationship("User", back_populates="organized_groups")
    members = relationship("User", secondary=group_members, back_populates="groups")
    messages = relationship("ChatMessage", back_populates="group")

class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(Integer, primary_key=True, index=True)
    group_id = Column(Integer, ForeignKey("groups.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    text = Column(Text, nullable=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    
    group = relationship("Group", back_populates="messages")
    user = relationship("User", back_populates="messages")

class Attendance(Base):
    __tablename__ = "attendance"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    event_id = Column(Integer, ForeignKey("events.id"), nullable=False)
    attended = Column(Boolean, default=False)
    date = Column(DateTime(timezone=True), server_default=func.now())
    
    user = relationship("User", back_populates="attendance_records")
    event = relationship("Event", back_populates="attendance_records")