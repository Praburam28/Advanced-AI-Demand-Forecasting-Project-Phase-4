from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.dataset import Dataset
from app.models.user import User
from app.models.ai_insight import AIInsight
from app.ml.recommendation_engine import (
    load_dataset,
    detect_numeric_column,
    generate_product_recommendation,
    analyze_buying_behavior,
    generate_inventory_optimization
)
from app.ml.demand_spike_predictor import (
    predict_demand_spike,
    predict_low_stock
)
from app.services.user_service import create_activity_log


def generate_ai_insights(db: Session, current_user: User, dataset_id: int):
    dataset = db.query(Dataset).filter(Dataset.id == dataset_id).first()

    if not dataset:
        raise HTTPException(status_code=404, detail="Dataset not found")

    file_path = f"uploads/datasets/{dataset.file_name}"

    try:
        df = load_dataset(file_path)

        demand_col = detect_numeric_column(
            df,
            ["demand", "sales", "quantity", "units_sold", "orders"]
        )

        if demand_col:
            demand_values = df[demand_col].dropna().astype(float).tolist()
        else:
            demand_values = []

        stock_col = None

        for col in df.columns:
            if col.lower() in ["stock", "inventory", "available_stock", "current_stock"]:
                stock_col = col
                break

        if stock_col:
            stock_values = df[stock_col].dropna().astype(float).tolist()
        else:
            stock_values = []

        spike_risk, spike_confidence = predict_demand_spike(demand_values)
        low_stock_risk, stock_confidence = predict_low_stock(demand_values, stock_values)

        confidence_score = round((spike_confidence + stock_confidence) / 2, 2)

        insight = AIInsight(
            user_id=current_user.id,
            dataset_id=dataset_id,
            insight_type="advanced_ai_insight",
            product_recommendation=generate_product_recommendation(df),
            buying_behavior=analyze_buying_behavior(df),
            demand_spike_risk=spike_risk,
            low_stock_risk=low_stock_risk,
            inventory_suggestion=generate_inventory_optimization(df),
            confidence_score=confidence_score
        )

        db.add(insight)
        db.commit()
        db.refresh(insight)

        create_activity_log(
            db=db,
            user_id=current_user.id,
            action="AI_INSIGHT_GENERATED",
            module="AI_INSIGHTS",
            description=f"Generated AI insights for dataset {dataset_id}"
        )

        return insight

    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"AI insight generation failed: {str(e)}"
        )


def get_ai_insights_history(db: Session, current_user: User):
    if current_user.role == "admin":
        return db.query(AIInsight).order_by(AIInsight.id.desc()).all()

    return (
        db.query(AIInsight)
        .filter(AIInsight.user_id == current_user.id)
        .order_by(AIInsight.id.desc())
        .all()
    )