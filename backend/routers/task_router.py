from fastapi import APIRouter, Depends
from celery.result import AsyncResult
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.schemas.forecast_schema import ForecastRequest
from app.schemas.report_schema import ReportCreateRequest
from app.tasks.celery_app import celery_app
from app.tasks.background_tasks import run_forecast_task, generate_report_task


router = APIRouter(
    prefix="/tasks",
    tags=["Background Tasks"]
)


@router.post("/forecast")
def create_forecast_background(
    request: ForecastRequest,
    current_user: User = Depends(get_current_user)
):
    task = run_forecast_task.delay(
        current_user.id,
        request.dataset_id,
        request.model_name,
        request.forecast_period
    )

    return {
        "message": "Forecast task submitted successfully",
        "task_id": task.id,
        "status": "queued"
    }


@router.post("/report")
def create_report_background(
    request: ReportCreateRequest,
    current_user: User = Depends(get_current_user)
):
    task = generate_report_task.delay(
        current_user.id,
        request.report_name,
        request.report_type
    )

    return {
        "message": "Report task submitted successfully",
        "task_id": task.id,
        "status": "queued"
    }


@router.get("/{task_id}")
def get_task_status(task_id: str):
    task_result = AsyncResult(task_id, app=celery_app)

    return {
        "task_id": task_id,
        "status": task_result.status,
        "result": task_result.result if task_result.ready() else None
    }