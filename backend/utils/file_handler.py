import os
import shutil
import uuid
from fastapi import HTTPException


ALLOWED_EXTENSIONS = [".csv", ".xlsx"]
MAX_FILE_SIZE = 10 * 1024 * 1024


def validate_file(file):
    extension = os.path.splitext(file.filename)[1].lower()

    if extension not in ALLOWED_EXTENSIONS:
        return False, "Only CSV and XLSX files are allowed"

    file.file.seek(0, os.SEEK_END)
    file_size = file.file.tell()
    file.file.seek(0)

    if file_size > MAX_FILE_SIZE:
        return False, "File size must be less than 10 MB"

    return True, "Valid file"


def save_uploaded_file(file):
    extension = os.path.splitext(file.filename)[1].lower()

    unique_filename = f"{uuid.uuid4()}{extension}"
    folder_path = "uploads/datasets"
    os.makedirs(folder_path, exist_ok=True)

    file_path = f"{folder_path}/{unique_filename}"

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return unique_filename, file_path