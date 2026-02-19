from sqlalchemy import Column, Integer, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.api.core.db import Base

class Attendance(Base):
    __tablename__ = "attendance"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    event_id = Column(Integer, ForeignKey("events.id"), nullable=False)
    attended = Column(Boolean, default=False)
    date = Column(DateTime(timezone=True), server_default=func.now())
    
    user = relationship("User", back_populates="attendance_records")
    event = relationship("Event", back_populates="attendance_records")