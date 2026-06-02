import json
from datetime import datetime, timezone

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.integration import Integration, WebhookEvent
from app.models.user import User
from app.schemas.integration_schema import (
    IntegrationCreateRequest,
    IntegrationUpdateRequest
)
from app.integrations.external_api import (
    test_external_connection,
    fetch_external_inventory
)
from app.services.user_service import create_activity_log


def create_integration(
    db: Session,
    current_user: User,
    request: IntegrationCreateRequest
):
    integration = Integration(
        user_id=current_user.id,
        name=request.name,
        integration_type=request.integration_type,
        api_url=request.api_url,
        api_key=request.api_key,
        status="inactive",
        is_active=True
    )

    db.add(integration)
    db.commit()
    db.refresh(integration)

    create_activity_log(
        db=db,
        user_id=current_user.id,
        action="INTEGRATION_CREATED",
        module="ENTERPRISE_INTEGRATION",
        description=f"Created integration {request.name}"
    )

    return integration


def get_integrations(db: Session, current_user: User):
    if current_user.role == "admin":
        return db.query(Integration).order_by(Integration.id.desc()).all()

    return (
        db.query(Integration)
        .filter(Integration.user_id == current_user.id)
        .order_by(Integration.id.desc())
        .all()
    )


def update_integration(
    db: Session,
    current_user: User,
    integration_id: int,
    request: IntegrationUpdateRequest
):
    integration = (
        db.query(Integration)
        .filter(Integration.id == integration_id)
        .first()
    )

    if not integration:
        raise HTTPException(
            status_code=404,
            detail="Integration not found"
        )

    if current_user.role != "admin" and integration.user_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Access denied"
        )

    update_data = request.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(integration, key, value)

    db.commit()
    db.refresh(integration)

    create_activity_log(
        db=db,
        user_id=current_user.id,
        action="INTEGRATION_UPDATED",
        module="ENTERPRISE_INTEGRATION",
        description=f"Updated integration {integration.name}"
    )

    return integration


def test_integration(
    db: Session,
    current_user: User,
    integration_id: int
):
    integration = (
        db.query(Integration)
        .filter(Integration.id == integration_id)
        .first()
    )

    if not integration:
        raise HTTPException(
            status_code=404,
            detail="Integration not found"
        )

    if current_user.role != "admin" and integration.user_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Access denied"
        )

    if not integration.api_url:
        raise HTTPException(
            status_code=400,
            detail="API URL is required"
        )

    result = test_external_connection(
        integration.api_url,
        integration.api_key
    )

    integration.status = "active" if result["success"] else "failed"
    integration.last_sync_status = "connection_test"
    integration.last_sync_message = result["message"]
    integration.last_synced_at = datetime.now(timezone.utc)

    db.commit()
    db.refresh(integration)

    create_activity_log(
        db=db,
        user_id=current_user.id,
        action="INTEGRATION_TESTED",
        module="ENTERPRISE_INTEGRATION",
        description=f"Tested integration {integration.name}"
    )

    return {
        "message": "Connection test completed",
        "result": result,
        "integration": integration
    }


def sync_integration(
    db: Session,
    current_user: User,
    integration_id: int
):
    integration = (
        db.query(Integration)
        .filter(Integration.id == integration_id)
        .first()
    )

    if not integration:
        raise HTTPException(
            status_code=404,
            detail="Integration not found"
        )

    if current_user.role != "admin" and integration.user_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Access denied"
        )

    if not integration.api_url:
        raise HTTPException(
            status_code=400,
            detail="API URL is required"
        )

    try:
        data = fetch_external_inventory(
            integration.api_url,
            integration.api_key
        )

        integration.last_sync_status = "success"
        integration.last_sync_message = "External inventory data synced successfully"
        integration.last_synced_at = datetime.now(timezone.utc)
        integration.status = "active"

        db.commit()
        db.refresh(integration)

        create_activity_log(
            db=db,
            user_id=current_user.id,
            action="INTEGRATION_SYNCED",
            module="ENTERPRISE_INTEGRATION",
            description=f"Synced integration {integration.name}"
        )

        return {
            "message": "Sync completed",
            "records_preview": data[:5] if isinstance(data, list) else data
        }

    except Exception as e:
        integration.last_sync_status = "failed"
        integration.last_sync_message = str(e)
        integration.last_synced_at = datetime.now(timezone.utc)
        integration.status = "failed"

        db.commit()

        raise HTTPException(
            status_code=400,
            detail=f"Sync failed: {str(e)}"
        )


def receive_webhook(
    db: Session,
    source: str,
    event_type: str,
    payload: dict
):
    event = WebhookEvent(
        source=source,
        event_type=event_type,
        payload=json.dumps(payload),
        status="received"
    )

    db.add(event)
    db.commit()
    db.refresh(event)

    return {
        "message": "Webhook received successfully",
        "event_id": event.id
    }