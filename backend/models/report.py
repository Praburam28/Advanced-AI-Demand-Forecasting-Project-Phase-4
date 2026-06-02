from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.database import Base


class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))

    report_name = Column(String(255), nullable=False)
    report_type = Column(String(100), default="forecast_summary")
    file_path = Column(String(500), nullable=False)
    status = Column(String(50), default="completed")

    created_at = Column(DateTime(timezone=True), server_default=func.now())