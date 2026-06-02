from fastapi import APIRouter, Depends
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.models.report import Report
from app.schemas.report_schema import ReportCreateRequest, ReportResponse
from app.services.report_service import generate_dashboard_report, get_reports


router = APIRouter(
    prefix="/reports",
    tags=["Reports"]
)


@router.post("/generate", response_model=ReportResponse)
def generate_report(
    request: ReportCreateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return generate_dashboard_report(
        db=db,
        current_user=current_user,
        report_name=request.report_name,
        report_type=request.report_type
    )


@router.get("/", response_model=list[ReportResponse])
def reports(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_reports(db, current_user)


@router.get("/{report_id}/download")
def download_report(
    report_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    report = db.query(Report).filter(Report.id == report_id).first()

    return FileResponse(
        path=report.file_path,
        filename=report.report_name + ".pdf",
        media_type="application/pdf"
    )