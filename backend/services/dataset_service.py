import os
import pandas as pd

from fastapi import HTTPException, UploadFile
from sqlalchemy.orm import Session

from app.models.dataset import Dataset
from app.models.user import User
from app.services.user_service import create_activity_log
from app.utils.file_handler import validate_file, save_uploaded_file


def upload_dataset(
    db: Session,
    current_user: User,
    file: UploadFile
):
    is_valid, message = validate_file(file)

    if not is_valid:
        raise HTTPException(
            status_code=400,
            detail=message
        )

    unique_filename, file_path = save_uploaded_file(file)

    extension = os.path.splitext(file.filename)[1].lower()

    try:
        if extension == ".csv":
            df = pd.read_csv(file_path)

        elif extension == ".xlsx":
            df = pd.read_excel(file_path)

        total_rows = len(df)
        total_columns = len(df.columns)

    except Exception:
        raise HTTPException(
            status_code=400,
            detail="Failed to process dataset"
        )

    dataset = Dataset(
        user_id=current_user.id,
        file_name=unique_filename,
        original_file_name=file.filename,
        file_type=extension,
        file_size=str(os.path.getsize(file_path)),
        total_rows=total_rows,
        total_columns=total_columns,
        processing_status="processed"
    )

    db.add(dataset)
    db.commit()
    db.refresh(dataset)

    create_activity_log(
        db=db,
        user_id=current_user.id,
        action="DATASET_UPLOADED",
        module="DATASET",
        description=f"Uploaded dataset {file.filename}"
    )

    return dataset


def get_all_datasets(db: Session):
    return db.query(Dataset).order_by(Dataset.id.desc()).all()


def get_user_datasets(db: Session, user_id: int):
    return (
        db.query(Dataset)
        .filter(Dataset.user_id == user_id)
        .order_by(Dataset.id.desc())
        .all()
    )