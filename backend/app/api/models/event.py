from sqlalchemy import Column, Integer, String, DateTime, Float, Text, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from backend.app.api.core.db import Base

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

    organizer = relationship("User", back_populates="organized_events", lazy='joined')
    groups = relationship("Group", back_populates="event")
    attendance_records = relationship("Attendance", back_populates="event")