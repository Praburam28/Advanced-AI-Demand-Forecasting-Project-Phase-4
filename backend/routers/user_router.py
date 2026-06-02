from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user, require_admin
from app.models.user import User
from app.schemas.user_schema import (
    UserResponse,
    ProfileUpdateRequest,
    AccountStatusUpdateRequest
)
from app.services.user_service import (
    get_all_users,
    get_profile,
    update_profile,
    update_account_status,
    get_user_activity_logs
)


router = APIRouter(
    prefix="/users",
    tags=["User Management"]
)


@router.get("/me", response_model=UserResponse)
def my_profile(current_user: User = Depends(get_current_user)):
    return get_profile(current_user)


@router.put("/me", response_model=UserResponse)
def edit_profile(
    request: ProfileUpdateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return update_profile(db, current_user, request)


@router.get("/", response_model=list[UserResponse])
def users_list(
    db: Session = Depends(get_db),
    admin_user: User = Depends(require_admin)
):
    return get_all_users(db)


@router.put("/{user_id}/status", response_model=UserResponse)
def change_account_status(
    user_id: int,
    request: AccountStatusUpdateRequest,
    db: Session = Depends(get_db),
    admin_user: User = Depends(require_admin)
):
    return update_account_status(db, user_id, request, admin_user)


@router.get("/{user_id}/activity")
def user_activity(
    user_id: int,
    db: Session = Depends(get_db),
    admin_user: User = Depends(require_admin)
):
    return get_user_activity_logs(db, user_id)