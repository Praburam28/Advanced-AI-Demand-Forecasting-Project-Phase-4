from pydantic import BaseModel
from datetime import datetime


class DatasetResponse(BaseModel):
    id: int
    file_name: str
    original_file_name: str
    file_type: str
    file_size: str
    total_rows: int
    total_columns: int
    processing_status: str
    uploaded_at: datetime

    class Config:
        from_attributes = True