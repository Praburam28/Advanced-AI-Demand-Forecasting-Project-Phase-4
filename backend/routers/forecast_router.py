from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.schemas.forecast_schema import ForecastRequest, ForecastResponse
from app.services.forecast_service import (
    create_forecast,
    get_forecast_history,
    compare_models
)


router = APIRouter(
    prefix="/forecasts",
    tags=["Forecasting"]
)


@router.post("/generate", response_model=ForecastResponse)
def generate_forecast(
    request: ForecastRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return create_forecast(
        db=db,
        current_user=current_user,
        dataset_id=request.dataset_id,
        model_name=request.model_name,
        forecast_period=request.forecast_period
    )


@router.get("/history", response_model=list[ForecastResponse])
def history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_forecast_history(db, current_user)


@router.post("/compare/{dataset_id}", response_model=list[ForecastResponse])
def compare_forecast_models(
    dataset_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return compare_models(db, current_user, dataset_id)