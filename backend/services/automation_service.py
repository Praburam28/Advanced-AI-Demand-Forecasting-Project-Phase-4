from datetime import datetime, timedelta, timezone

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.automation import AutomationSchedule
from app.models.dataset import Dataset
from app.models.user import User
from app.schemas.automation_schema import AutomationCreateRequest, AutomationUpdateRequest
from app.services.user_service import create_activity_log


def create_automation_schedule(
    db: Session,
    current_user: User,
    request: AutomationCreateRequest
):
    dataset = db.query(Dataset).filter(Dataset.id == request.dataset_id).first()

    if not dataset:
        raise HTTPException(status_code=404, detail="Dataset not found")

    schedule = AutomationSchedule(
        user_id=current_user.id,
        dataset_id=request.dataset_id,
        schedule_name=request.schedule_name,
        model_name=request.model_name,
        forecast_period=request.forecast_period,
        interval_minutes=request.interval_minutes,
        is_active=True,
        next_run_at=datetime.now(timezone.utc) + timedelta(minutes=request.interval_minutes)
    )

    db.add(schedule)
    db.commit()
    db.refresh(schedule)

    create_activity_log(
        db=db,
        user_id=current_user.id,
        action="AUTOMATION_CREATED",
        module="SMART_AUTOMATION",
        description=f"Created automation schedule {request.schedule_name}"
    )

    return schedule


def get_automation_schedules(db: Session, current_user: User):
    if current_user.role == "admin":
        return db.query(AutomationSchedule).order_by(AutomationSchedule.id.desc()).all()

    return (
        db.query(AutomationSchedule)
        .filter(AutomationSchedule.user_id == current_user.id)
        .order_by(AutomationSchedule.id.desc())
        .all()
    )


def update_automation_schedule(
    db: Session,
    current_user: User,
    schedule_id: int,
    request: AutomationUpdateRequest
):
    schedule = db.query(AutomationSchedule).filter(
        AutomationSchedule.id == schedule_id
    ).first()

    if not schedule:
        raise HTTPException(status_code=404, detail="Automation schedule not found")

    if current_user.role != "admin" and schedule.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")

    if request.schedule_name is not None:
        schedule.schedule_name = request.schedule_name

    if request.model_name is not None:
        schedule.model_name = request.model_name

    if request.forecast_period is not None:
        schedule.forecast_period = request.forecast_period

    if request.interval_minutes is not None:
        schedule.interval_minutes = request.interval_minutes
        schedule.next_run_at = datetime.now(timezone.utc) + timedelta(
            minutes=request.interval_minutes
        )

    if request.is_active is not None:
        schedule.is_active = request.is_active

    db.commit()
    db.refresh(schedule)

    create_activity_log(
        db=db,
        user_id=current_user.id,
        action="AUTOMATION_UPDATED",
        module="SMART_AUTOMATION",
        description=f"Updated automation schedule {schedule.schedule_name}"
    )

    return schedule


def delete_automation_schedule(
    db: Session,
    current_user: User,
    schedule_id: int
):
    schedule = db.query(AutomationSchedule).filter(
        AutomationSchedule.id == schedule_id
    ).first()

    if not schedule:
        raise HTTPException(status_code=404, detail="Automation schedule not found")

    if current_user.role != "admin" and schedule.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")

    db.delete(schedule)
    db.commit()

    create_activity_log(
        db=db,
        user_id=current_user.id,
        action="AUTOMATION_DELETED",
        module="SMART_AUTOMATION",
        description="Deleted automation schedule"
    )

    return {"message": "Automation schedule deleted successfully"}