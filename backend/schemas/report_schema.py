from pydantic import BaseModel
from datetime import datetime


class ReportCreateRequest(BaseModel):
    report_name: str
    report_type: str = "forecast_summary"


class ReportResponse(BaseModel):
    id: int
    report_name: str
    report_type: str
    file_path: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True