from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.schemas.ai_insight_schema import AIInsightRequest, AIInsightResponse
from app.services.ai_insight_service import (
    generate_ai_insights,
    get_ai_insights_history
)


router = APIRouter(
    prefix="/ai-insights",
    tags=["Advanced AI Insights"]
)


@router.post("/generate", response_model=AIInsightResponse)
def generate(
    request: AIInsightRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return generate_ai_insights(db, current_user, request.dataset_id)


@router.get("/history", response_model=list[AIInsightResponse])
def history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_ai_insights_history(db, current_user)