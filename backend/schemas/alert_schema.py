from pydantic import BaseModel


class AlertSettingRequest(BaseModel):
    demand_spike_threshold: float = 150.0
    low_stock_threshold: float = 50.0
    confidence_threshold: float = 60.0
    email_alerts_enabled: bool = True
    in_app_alerts_enabled: bool = True


class AlertSettingResponse(BaseModel):
    id: int
    demand_spike_threshold: float
    low_stock_threshold: float
    confidence_threshold: float
    email_alerts_enabled: bool
    in_app_alerts_enabled: bool

    class Config:
        from_attributes = True