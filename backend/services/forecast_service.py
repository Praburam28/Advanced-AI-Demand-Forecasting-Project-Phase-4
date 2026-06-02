from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.dataset import Dataset
from app.models.forecast import Forecast
from app.models.user import User
from app.ml.predictor import generate_prediction
from app.services.user_service import create_activity_log

from app.services.notification_service import (
    generate_forecast_completion_notification,
    generate_forecast_failure_notification
)

from app.services.alert_service import evaluate_forecast_alerts


def create_forecast(
    db: Session,
    current_user: User,
    dataset_id: int,
    model_name: str,
    forecast_period: int
):
    dataset = db.query(Dataset).filter(
        Dataset.id == dataset_id
    ).first()

    if not dataset:
        raise HTTPException(
            status_code=404,
            detail="Dataset not found"
        )

    file_path = f"uploads/datasets/{dataset.file_name}"

    try:
        prediction_result = generate_prediction(
            file_path=file_path,
            model_name=model_name
        )

    except Exception as e:
        generate_forecast_failure_notification(
            db=db,
            current_user=current_user,
            reason=str(e)
        )

        raise HTTPException(
            status_code=400,
            detail=f"Forecast generation failed: {str(e)}"
        )

    forecast = Forecast(
        user_id=current_user.id,
        dataset_id=dataset_id,
        model_name=model_name,
        forecast_period=forecast_period,
        predicted_demand=prediction_result[
            "predicted_demand"
        ],
        confidence_score=prediction_result[
            "confidence_score"
        ],
        mae=prediction_result["mae"],
        mse=prediction_result["mse"],
        rmse=prediction_result["rmse"],
        trend=prediction_result["trend"],
        recommendation=prediction_result[
            "recommendation"
        ],
        status="completed"
    )

    db.add(forecast)
    db.commit()
    db.refresh(forecast)

    create_activity_log(
        db=db,
        user_id=current_user.id,
        action="FORECAST_GENERATED",
        module="FORECAST",
        description=f"Generated forecast using {model_name}"
    )

    generate_forecast_completion_notification(
        db=db,
        current_user=current_user,
        forecast_id=forecast.id
    )

    evaluate_forecast_alerts(
        db=db,
        current_user=current_user,
        predicted_demand=forecast.predicted_demand,
        confidence_score=forecast.confidence_score
    )

    return forecast


def get_forecast_history(
    db: Session,
    current_user: User
):
    if current_user.role == "admin":
        return (
            db.query(Forecast)
            .order_by(Forecast.id.desc())
            .all()
        )

    return (
        db.query(Forecast)
        .filter(Forecast.user_id == current_user.id)
        .order_by(Forecast.id.desc())
        .all()
    )


def compare_models(
    db: Session,
    current_user: User,
    dataset_id: int
):
    models = [
        "linear_regression",
        "random_forest",
        "decision_tree",
        "gradient_boosting",
        "extra_trees",
        "ridge_regression",
        "lasso_regression",
        "svr"
    ]

    results = []

    for model_name in models:
        result = create_forecast(
            db=db,
            current_user=current_user,
            dataset_id=dataset_id,
            model_name=model_name,
            forecast_period=30
        )

        results.append(result)

    return results