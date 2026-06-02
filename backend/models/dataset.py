from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func

from app.database import Base


class Dataset(Base):
    __tablename__ = "datasets"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id"))

    file_name = Column(String(255), nullable=False)
    original_file_name = Column(String(255), nullable=False)

    file_type = Column(String(50))
    file_size = Column(String(50))

    total_rows = Column(Integer, default=0)
    total_columns = Column(Integer, default=0)

    processing_status = Column(String(50), default="pending")

    uploaded_at = Column(DateTime(timezone=True), server_default=func.now())