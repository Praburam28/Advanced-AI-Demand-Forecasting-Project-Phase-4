from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.sql import func

from app.database import Base


class Integration(Base):
    __tablename__ = "integrations"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))

    name = Column(String(150), nullable=False)
    integration_type = Column(String(100), nullable=False)

    api_url = Column(String(500), nullable=True)
    api_key = Column(String(500), nullable=True)

    status = Column(String(50), default="inactive")
    is_active = Column(Boolean, default=True)

    last_sync_status = Column(String(100), nullable=True)
    last_sync_message = Column(Text, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    last_synced_at = Column(DateTime(timezone=True), nullable=True)


class WebhookEvent(Base):
    __tablename__ = "webhook_events"

    id = Column(Integer, primary_key=True, index=True)

    source = Column(String(150), nullable=False)
    event_type = Column(String(150), nullable=False)
    payload = Column(Text, nullable=False)

    status = Column(String(50), default="received")

    created_at = Column(DateTime(timezone=True), server_default=func.now())