from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import require_admin
from app.models.activity_log import ActivityLog
from app.models.user import User


router = APIRouter(
    prefix="/audit",
    tags=["Audit Logs"]
)


@router.get("/logs")
def get_audit_logs(
    db: Session = Depends(get_db),
    admin_user: User = Depends(require_admin)
):
    return (
        db.query(ActivityLog)
        .order_by(ActivityLog.id.desc())
        .limit(100)
        .all()
    )