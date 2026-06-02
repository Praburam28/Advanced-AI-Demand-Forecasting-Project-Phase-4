import os
import pandas as pd

from fastapi import APIRouter, Depends
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.services.dashboard_service import get_dashboard_summary
from app.reports.pdf_generator import generate_dashboard_summary_pdf


router = APIRouter(
    prefix="/reports/dashboard",
    tags=["Dashboard Reports"]
)


@router.get("/pdf")
def export_dashboard_pdf(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    os.makedirs("generated_reports", exist_ok=True)

    summary = get_dashboard_summary(db, current_user)

    file_path = "generated_reports/dashboard_summary.pdf"

    data = {
        "Total Datasets": summary["kpis"]["total_datasets"],
        "Total Forecasts": summary["kpis"]["total_forecasts"],
        "Total AI Insights": summary["kpis"]["total_ai_insights"],
        "Total Reports": summary["kpis"]["total_reports"],
        "Latest Predicted Demand": summary["kpis"]["latest_predicted_demand"],
        "Latest Confidence Score": summary["kpis"]["average_confidence_score"],
        "Latest Trend": "Available"
    }

    generate_dashboard_summary_pdf(
        file_path=file_path,
        title="Dashboard Summary Report",
        data=data
    )

    return FileResponse(
        file_path,
        media_type="application/pdf",
        filename="dashboard_summary.pdf"
    )


@router.get("/excel")
def export_dashboard_excel(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    os.makedirs("generated_reports", exist_ok=True)

    summary = get_dashboard_summary(db, current_user)

    file_path = "generated_reports/dashboard_summary.xlsx"

    kpis = summary["kpis"]

    df = pd.DataFrame([
        {
            "Metric": "Total Datasets",
            "Value": kpis["total_datasets"]
        },
        {
            "Metric": "Total Forecasts",
            "Value": kpis["total_forecasts"]
        },
        {
            "Metric": "Total AI Insights",
            "Value": kpis["total_ai_insights"]
        },
        {
            "Metric": "Total Reports",
            "Value": kpis["total_reports"]
        },
        {
            "Metric": "Average Confidence Score",
            "Value": kpis["average_confidence_score"]
        },
        {
            "Metric": "Latest Predicted Demand",
            "Value": kpis["latest_predicted_demand"]
        },
    ])

    with pd.ExcelWriter(file_path, engine="openpyxl") as writer:
        df.to_excel(writer, index=False, sheet_name="Dashboard Summary")

        pd.DataFrame(
            summary.get("model_ranking", [])
        ).to_excel(
            writer,
            index=False,
            sheet_name="Model Ranking"
        )

        pd.DataFrame(
            summary.get("accuracy_trends", [])
        ).to_excel(
            writer,
            index=False,
            sheet_name="Forecast Analytics"
        )

    return FileResponse(
        file_path,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        filename="dashboard_summary.xlsx"
    )