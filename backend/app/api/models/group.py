from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text, ForeignKey, Table
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from backend.app.api.core.db import Base

group_members = Table(
    'group_members',
    Base.metadata,
    Column('user_id', Integer, ForeignKey('users.id'), primary_key=True),
    Column('group_id', Integer, ForeignKey('groups.id'), primary_key=True)
)

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
    
    @property
    def members_count(self):
        return len(self.members) if self.members else 0
    
    @property
    def organizer_name(self):
        return self.organizer.name if self.organizer else "Неизвестно"