from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class AIInsightRequest(BaseModel):
    dataset_id: int


class AIInsightResponse(BaseModel):
    id: int
    dataset_id: int
    insight_type: str
    product_recommendation: Optional[str]
    buying_behavior: Optional[str]
    demand_spike_risk: Optional[str]
    low_stock_risk: Optional[str]
    inventory_suggestion: Optional[str]
    confidence_score: float
    created_at: datetime

    class Config:
        from_attributes = True