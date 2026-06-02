from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.schemas.alert_schema import AlertSettingRequest, AlertSettingResponse
from app.services.alert_service import (
    get_or_create_alert_settings,
    update_alert_settings
)


router = APIRouter(
    prefix="/alerts",
    tags=["Alert Settings"]
)


@router.get("/settings", response_model=AlertSettingResponse)
def get_settings(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_or_create_alert_settings(db, current_user)


@router.put("/settings", response_model=AlertSettingResponse)
def update_settings(
    request: AlertSettingRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return update_alert_settings(db, current_user, request)