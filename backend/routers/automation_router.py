from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.schemas.automation_schema import (
    AutomationCreateRequest,
    AutomationUpdateRequest,
    AutomationResponse
)
from app.services.automation_service import (
    create_automation_schedule,
    get_automation_schedules,
    update_automation_schedule,
    delete_automation_schedule
)


router = APIRouter(
    prefix="/automation",
    tags=["Smart Automation"]
)


@router.post("/schedules", response_model=AutomationResponse)
def create_schedule(
    request: AutomationCreateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return create_automation_schedule(db, current_user, request)


@router.get("/schedules", response_model=list[AutomationResponse])
def list_schedules(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_automation_schedules(db, current_user)


@router.put("/schedules/{schedule_id}", response_model=AutomationResponse)
def update_schedule(
    schedule_id: int,
    request: AutomationUpdateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return update_automation_schedule(db, current_user, schedule_id, request)


@router.delete("/schedules/{schedule_id}")
def delete_schedule(
    schedule_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return delete_automation_schedule(db, current_user, schedule_id)