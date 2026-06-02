from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.sql import func

from app.database import Base


class Forecast(Base):
    __tablename__ = "forecasts"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id"))
    dataset_id = Column(Integer, ForeignKey("datasets.id"))

    model_name = Column(String(100), default="linear_regression")

    forecast_period = Column(Integer, default=30)

    predicted_demand = Column(Float, default=0)
    confidence_score = Column(Float, default=0)

    mae = Column(Float, default=0)
    mse = Column(Float, default=0)
    rmse = Column(Float, default=0)

    trend = Column(String(100), nullable=True)
    recommendation = Column(Text, nullable=True)

    status = Column(String(50), default="completed")

    created_at = Column(DateTime(timezone=True), server_default=func.now())