from sqlalchemy import Column, Integer, Float, Boolean, DateTime, ForeignKey
from sqlalchemy.sql import func

from app.database import Base


class AlertSetting(Base):
    __tablename__ = "alert_settings"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id"), unique=True)

    demand_spike_threshold = Column(Float, default=150.0)
    low_stock_threshold = Column(Float, default=50.0)
    confidence_threshold = Column(Float, default=60.0)

    email_alerts_enabled = Column(Boolean, default=True)
    in_app_alerts_enabled = Column(Boolean, default=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())