from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class AutomationCreateRequest(BaseModel):
    dataset_id: int
    schedule_name: str
    model_name: str = "linear_regression"
    forecast_period: int = 30
    interval_minutes: int = 60


class AutomationUpdateRequest(BaseModel):
    schedule_name: Optional[str] = None
    model_name: Optional[str] = None
    forecast_period: Optional[int] = None
    interval_minutes: Optional[int] = None
    is_active: Optional[bool] = None


class AutomationResponse(BaseModel):
    id: int
    dataset_id: int
    schedule_name: str
    model_name: str
    forecast_period: int
    interval_minutes: int
    is_active: bool
    last_run_at: Optional[datetime]
    next_run_at: Optional[datetime]
    created_at: datetime

    class Config:
        from_attributes = True