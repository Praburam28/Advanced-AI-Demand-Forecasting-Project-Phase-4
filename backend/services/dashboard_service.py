from sqlalchemy.orm import Session
from sqlalchemy import func

from app.models.dataset import Dataset
from app.models.forecast import Forecast
from app.models.ai_insight import AIInsight
from app.models.report import Report

from app.utils.cache import (
    get_cache,
    set_cache
)


def get_dashboard_summary(
    db: Session,
    current_user
):
    cache_key = (
        f"dashboard_summary_"
        f"{current_user.id}_"
        f"{current_user.role}"
    )

    cached_data = get_cache(cache_key)

    if cached_data:
        return cached_data

    dataset_query = db.query(Dataset)

    forecast_query = db.query(Forecast)

    insight_query = db.query(AIInsight)

    report_query = db.query(Report)

    if current_user.role != "admin":
        dataset_query = dataset_query.filter(
            Dataset.user_id == current_user.id
        )

        forecast_query = forecast_query.filter(
            Forecast.user_id == current_user.id
        )

        insight_query = insight_query.filter(
            AIInsight.user_id == current_user.id
        )

        report_query = report_query.filter(
            Report.user_id == current_user.id
        )

    total_datasets = dataset_query.count()

    total_forecasts = forecast_query.count()

    total_ai_insights = insight_query.count()

    total_reports = report_query.count()

    avg_confidence = (
        forecast_query.with_entities(
            func.avg(
                Forecast.confidence_score
            )
        ).scalar()
        or 0
    )

    latest_forecast = (
        forecast_query
        .order_by(Forecast.id.desc())
        .first()
    )

    kpis = {
        "total_datasets": total_datasets,

        "total_forecasts": total_forecasts,

        "total_ai_insights": total_ai_insights,

        "total_reports": total_reports,

        "average_confidence_score": round(
            float(avg_confidence),
            2
        ),

        "latest_predicted_demand":
            latest_forecast.predicted_demand
            if latest_forecast
            else 0
    }

    forecasts = (
        forecast_query
        .order_by(Forecast.id.desc())
        .limit(10)
        .all()
    )

    accuracy_trends = [
    {
        "forecast_id": item.id,
        "model_name": item.model_name,
        "mae": item.mae,
        "mse": item.mse,
        "rmse": item.rmse,
        "mape": 0,
        "r2_score": 0,
        "confidence_score": item.confidence_score
    }
    for item in forecasts
]

    model_rows = (
        forecast_query
        .with_entities(
            Forecast.model_name,

            func.avg(Forecast.mae),

            func.avg(Forecast.rmse),

            func.avg(Forecast.confidence_score)
        )
        .group_by(Forecast.model_name)
        .all()
    )

    model_comparison = [
        {
            "model_name": row[0],

            "average_mae": round(
                float(row[1] or 0),
                2
            ),

            "average_rmse": round(
                float(row[2] or 0),
                2
            ),

            "average_confidence": round(
                float(row[3] or 0),
                2
            )
        }
        for row in model_rows
    ]

    best_model = None

    if model_comparison:
        best_model = sorted(
            model_comparison,
            key=lambda x: (
                x["average_rmse"],
                -x["average_confidence"]
            )
        )[0]

    model_ranking = sorted(
        model_comparison,
        key=lambda x: (
            x["average_rmse"],
            -x["average_confidence"]
        )
    )

    business_recommendations = []

    if latest_forecast:
        if latest_forecast.trend:
            business_recommendations.append(
                latest_forecast.recommendation
            )

        if (
            latest_forecast.confidence_score
            < 60
        ):
            business_recommendations.append(
                "Forecast confidence is low. "
                "Upload more historical data "
                "for better accuracy."
            )

        if (
            latest_forecast.predicted_demand
            > 0
        ):
            business_recommendations.append(
                "Use latest demand forecast "
                "to adjust procurement and "
                "inventory planning."
            )

    if not business_recommendations:
        business_recommendations.append(
            "Upload datasets and generate "
            "forecasts to view business "
            "recommendations."
        )

    result = {
        "kpis": kpis,

        "accuracy_trends": accuracy_trends,

        "model_comparison": model_comparison,

        "best_model": best_model,

        "model_ranking": model_ranking,

        "business_recommendations":
            business_recommendations
    }

    set_cache(
        cache_key,
        result
    )

    return result


def get_drilldown_analytics(
    db: Session,
    current_user
):
    forecast_query = db.query(Forecast)

    if current_user.role != "admin":
        forecast_query = forecast_query.filter(
            Forecast.user_id == current_user.id
        )

    forecasts = (
        forecast_query
        .order_by(Forecast.id.desc())
        .all()
    )

    return [
        {
            "forecast_id": item.id,

            "dataset_id": item.dataset_id,

            "model_name": item.model_name,

            "forecast_period":
                item.forecast_period,

            "predicted_demand":
                item.predicted_demand,

            "confidence_score":
                item.confidence_score,

            "mae": item.mae,

            "mse": item.mse,

            "rmse": item.rmse,

            "mape": 0,
            
            "r2_score": 0,

            "trend": item.trend,

            "recommendation":
                item.recommendation,

            "created_at":
                item.created_at
        }
        for item in forecasts
    ]
