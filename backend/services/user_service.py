from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.user import User
from app.models.activity_log import ActivityLog
from app.schemas.user_schema import ProfileUpdateRequest, AccountStatusUpdateRequest


def create_activity_log(
    db: Session,
    user_id: int,
    action: str,
    module: str,
    description: str = None,
    ip_address: str = None
):
    log = ActivityLog(
        user_id=user_id,
        action=action,
        module=module,
        description=description,
        ip_address=ip_address
    )

    db.add(log)
    db.commit()

    return log


def get_all_users(db: Session):
    return db.query(User).order_by(User.id.desc()).all()


def get_profile(current_user: User):
    return current_user


def update_profile(
    db: Session,
    current_user: User,
    request: ProfileUpdateRequest
):
    if request.email and request.email != current_user.email:
        existing_user = db.query(User).filter(User.email == request.email).first()

        if existing_user:
            raise HTTPException(
                status_code=400,
                detail="Email already in use"
            )

        current_user.email = request.email

    if request.full_name:
        current_user.full_name = request.full_name

    db.commit()
    db.refresh(current_user)

    create_activity_log(
        db=db,
        user_id=current_user.id,
        action="PROFILE_UPDATED",
        module="USER",
        description="User updated profile information"
    )

    return current_user


def update_account_status(
    db: Session,
    user_id: int,
    request: AccountStatusUpdateRequest,
    admin_user: User
):
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    user.account_status = request.account_status
    user.is_active = request.is_active

    db.commit()
    db.refresh(user)

    create_activity_log(
        db=db,
        user_id=admin_user.id,
        action="ACCOUNT_STATUS_UPDATED",
        module="ADMIN",
        description=f"Updated status for user {user.email}"
    )

    return user


def get_user_activity_logs(db: Session, user_id: int):
    return (
        db.query(ActivityLog)
        .filter(ActivityLog.user_id == user_id)
        .order_by(ActivityLog.created_at.desc())
        .all()
    )