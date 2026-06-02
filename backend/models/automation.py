from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.sql import func

from app.database import Base


class AutomationSchedule(Base):
    __tablename__ = "automation_schedules"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id"))
    dataset_id = Column(Integer, ForeignKey("datasets.id"))

    schedule_name = Column(String(150), nullable=False)
    model_name = Column(String(100), default="linear_regression")
    forecast_period = Column(Integer, default=30)

    interval_minutes = Column(Integer, default=60)
    is_active = Column(Boolean, default=True)

    last_run_at = Column(DateTime(timezone=True), nullable=True)
    next_run_at = Column(DateTime(timezone=True), nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())