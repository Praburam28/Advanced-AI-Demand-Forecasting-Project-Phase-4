from fastapi import APIRouter, Depends, UploadFile, File
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user, require_admin
from app.models.user import User

from app.schemas.dataset_schema import DatasetResponse

from app.services.dataset_service import (
    upload_dataset,
    get_all_datasets,
    get_user_datasets
)


router = APIRouter(
    prefix="/datasets",
    tags=["Dataset Management"]
)


@router.post("/upload", response_model=DatasetResponse)
def upload(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return upload_dataset(db, current_user, file)


@router.get("/", response_model=list[DatasetResponse])
def all_datasets(
    db: Session = Depends(get_db),
    admin_user: User = Depends(require_admin)
):
    return get_all_datasets(db)


@router.get("/my-datasets", response_model=list[DatasetResponse])
def my_datasets(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_user_datasets(db, current_user.id)