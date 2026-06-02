from pydantic import BaseModel
from datetime import datetime
from typing import Optional, Dict, Any


class IntegrationCreateRequest(BaseModel):
    name: str
    integration_type: str
    api_url: Optional[str] = None
    api_key: Optional[str] = None


class IntegrationUpdateRequest(BaseModel):
    name: Optional[str] = None
    integration_type: Optional[str] = None
    api_url: Optional[str] = None
    api_key: Optional[str] = None
    status: Optional[str] = None
    is_active: Optional[bool] = None


class IntegrationResponse(BaseModel):
    id: int
    name: str
    integration_type: str
    api_url: Optional[str]
    status: str
    is_active: bool
    last_sync_status: Optional[str]
    last_sync_message: Optional[str]
    created_at: datetime
    last_synced_at: Optional[datetime]

    class Config:
        from_attributes = True


class WebhookRequest(BaseModel):
    source: str
    event_type: str
    payload: Dict[str, Any]