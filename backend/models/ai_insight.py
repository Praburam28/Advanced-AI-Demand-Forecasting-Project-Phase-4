from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.sql import func

from app.database import Base


class AIInsight(Base):
    __tablename__ = "ai_insights"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id"))
    dataset_id = Column(Integer, ForeignKey("datasets.id"))

    insight_type = Column(String(100), nullable=False)

    product_recommendation = Column(Text, nullable=True)
    buying_behavior = Column(Text, nullable=True)
    demand_spike_risk = Column(String(100), nullable=True)
    low_stock_risk = Column(String(100), nullable=True)
    inventory_suggestion = Column(Text, nullable=True)

    confidence_score = Column(Float, default=0)

    created_at = Column(DateTime(timezone=True), server_default=func.now())