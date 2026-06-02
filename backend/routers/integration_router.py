from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import User

from app.schemas.integration_schema import (
    IntegrationCreateRequest,
    IntegrationUpdateRequest,
    IntegrationResponse,
    WebhookRequest
)

from app.services.integration_service import (
    create_integration,
    get_integrations,
    update_integration,
    test_integration,
    sync_integration,
    receive_webhook
)


router = APIRouter(
    prefix="/integrations",
    tags=["Enterprise Integrations"]
)


@router.post("/", response_model=IntegrationResponse)
def create(
    request: IntegrationCreateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return create_integration(
        db,
        current_user,
        request
    )


@router.get("/", response_model=list[IntegrationResponse])
def list_integrations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_integrations(
        db,
        current_user
    )


@router.put("/{integration_id}", response_model=IntegrationResponse)
def update(
    integration_id: int,
    request: IntegrationUpdateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return update_integration(
        db,
        current_user,
        integration_id,
        request
    )


@router.post("/{integration_id}/test")
def test(
    integration_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return test_integration(
        db,
        current_user,
        integration_id
    )


@router.post("/{integration_id}/sync")
def sync(
    integration_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return sync_integration(
        db,
        current_user,
        integration_id
    )


@router.post("/webhook")
def webhook(
    request: WebhookRequest,
    db: Session = Depends(get_db)
):
    return receive_webhook(
        db=db,
        source=request.source,
        event_type=request.event_type,
        payload=request.payload
    )