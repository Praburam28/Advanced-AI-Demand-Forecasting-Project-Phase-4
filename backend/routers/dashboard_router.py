from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.schemas.dashboard_schema import DashboardSummaryResponse
from app.services.dashboard_service import (
    get_dashboard_summary,
    get_drilldown_analytics
)


router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard Analytics"]
)


@router.get("/summary", response_model=DashboardSummaryResponse)
def dashboard_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_dashboard_summary(db, current_user)


@router.get("/drilldown")
def drilldown(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_drilldown_analytics(db, current_user)