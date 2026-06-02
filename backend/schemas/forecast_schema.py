from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class ForecastRequest(BaseModel):
    dataset_id: int
    model_name: str = "linear_regression"
    forecast_period: int = 30


class ForecastResponse(BaseModel):
    id: int
    dataset_id: int
    model_name: str
    forecast_period: int
    predicted_demand: float
    confidence_score: float
    mae: float
    mse: float
    rmse: float
    trend: Optional[str]
    recommendation: Optional[str]
    status: str
    created_at: datetime

    class Config:
        from_attributes = True