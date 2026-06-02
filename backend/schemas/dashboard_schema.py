from pydantic import BaseModel
from typing import List, Optional


class KPICardsResponse(BaseModel):
    total_datasets: int
    total_forecasts: int
    total_ai_insights: int
    total_reports: int
    average_confidence_score: float
    latest_predicted_demand: float


class AccuracyTrendItem(BaseModel):
    forecast_id: int
    model_name: str
    mae: float
    mse: float
    rmse: float
    confidence_score: float


class ModelComparisonItem(BaseModel):
    model_name: str
    average_mae: float
    average_rmse: float
    average_confidence: float


class DashboardSummaryResponse(BaseModel):
    kpis: KPICardsResponse
    accuracy_trends: List[AccuracyTrendItem]
    model_comparison: List[ModelComparisonItem]
    business_recommendations: List[str]