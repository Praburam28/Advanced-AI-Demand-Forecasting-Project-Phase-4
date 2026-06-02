import os
import uuid

from sqlalchemy.orm import Session

from app.models.report import Report
from app.models.user import User
from app.models.dataset import Dataset
from app.models.forecast import Forecast
from app.models.ai_insight import AIInsight
from app.reports.pdf_generator import generate_dashboard_summary_pdf
from app.services.notification_service import generate_report_notification
from app.services.user_service import create_activity_log


def generate_dashboard_report(db: Session, current_user: User, report_name: str, report_type: str):
    total_datasets = db.query(Dataset).count()
    total_forecasts = db.query(Forecast).count()
    total_ai_insights = db.query(AIInsight).count()

    latest_forecast = db.query(Forecast).order_by(Forecast.id.desc()).first()

    data = {
        "Total Datasets": total_datasets,
        "Total Forecasts": total_forecasts,
        "Total AI Insights": total_ai_insights,
        "Latest Predicted Demand": latest_forecast.predicted_demand if latest_forecast else 0,
        "Latest Confidence Score": latest_forecast.confidence_score if latest_forecast else 0,
        "Latest Trend": latest_forecast.trend if latest_forecast else "No forecast available"
    }

    filename = f"{uuid.uuid4()}.pdf"
    file_path = f"generated_reports/{filename}"

    os.makedirs("generated_reports", exist_ok=True)

    generate_dashboard_summary_pdf(
        file_path=file_path,
        title=report_name,
        data=data
    )

    report = Report(
        user_id=current_user.id,
        report_name=report_name,
        report_type=report_type,
        file_path=file_path,
        status="completed"
    )

    db.add(report)
    db.commit()
    db.refresh(report)

    generate_report_notification(
        db=db,
        current_user=current_user,
        report_name=report_name
    )

    create_activity_log(
        db=db,
        user_id=current_user.id,
        action="REPORT_GENERATED",
        module="REPORTS",
        description=f"Generated report {report_name}"
    )

    return report


def get_reports(db: Session, current_user: User):
    if current_user.role == "admin":
        return db.query(Report).order_by(Report.id.desc()).all()

    return (
        db.query(Report)
        .filter(Report.user_id == current_user.id)
        .order_by(Report.id.desc())
        .all()
    )