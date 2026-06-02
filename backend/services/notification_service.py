import asyncio

from sqlalchemy.orm import Session

from app.models.notification import Notification
from app.models.user import User
from app.notifications.email_sender import send_email_notification
from app.websocket.connection_manager import manager


def send_websocket_notification(
    user_id: int,
    title: str,
    message: str,
    notification_type: str
):
    try:
        loop = asyncio.get_running_loop()
        loop.create_task(
            manager.send_personal_message(
                user_id,
                {
                    "title": title,
                    "message": message,
                    "notification_type": notification_type,
                    "is_read": False
                }
            )
        )
    except RuntimeError:
        pass


def create_notification(
    db: Session,
    user_id: int,
    title: str,
    message: str,
    notification_type: str = "system",
    send_email: bool = False,
    email: str = None
):
    notification = Notification(
        user_id=user_id,
        title=title,
        message=message,
        notification_type=notification_type,
        is_read=False
    )

    db.add(notification)
    db.commit()
    db.refresh(notification)

    send_websocket_notification(
        user_id=user_id,
        title=title,
        message=message,
        notification_type=notification_type
    )

    if send_email and email:
        send_email_notification(
            to_email=email,
            subject=title,
            body=message
        )

    return notification


def get_user_notifications(db: Session, current_user: User):
    return (
        db.query(Notification)
        .filter(Notification.user_id == current_user.id)
        .order_by(Notification.id.desc())
        .all()
    )


def mark_notification_as_read(
    db: Session,
    notification_id: int,
    current_user: User
):
    notification = (
        db.query(Notification)
        .filter(
            Notification.id == notification_id,
            Notification.user_id == current_user.id
        )
        .first()
    )

    if not notification:
        return {"message": "Notification not found"}

    notification.is_read = True

    db.commit()
    db.refresh(notification)

    return notification


def generate_forecast_completion_notification(
    db: Session,
    current_user: User,
    forecast_id: int
):
    return create_notification(
        db=db,
        user_id=current_user.id,
        title="Forecast Completed",
        message=f"Forecast generation completed successfully. Forecast ID: {forecast_id}",
        notification_type="forecast",
        send_email=True,
        email=current_user.email
    )


def generate_forecast_failure_notification(
    db: Session,
    current_user: User,
    reason: str
):
    return create_notification(
        db=db,
        user_id=current_user.id,
        title="Forecast Failed",
        message=f"Forecast generation failed. Reason: {reason}",
        notification_type="forecast_error",
        send_email=True,
        email=current_user.email
    )


def generate_threshold_alert(
    db: Session,
    current_user: User,
    message: str
):
    return create_notification(
        db=db,
        user_id=current_user.id,
        title="Threshold Alert",
        message=message,
        notification_type="threshold_alert",
        send_email=False
    )


def generate_report_notification(
    db: Session,
    current_user: User,
    report_name: str
):
    return create_notification(
        db=db,
        user_id=current_user.id,
        title="Report Generated",
        message=f"Report '{report_name}' generated successfully.",
        notification_type="report",
        send_email=True,
        email=current_user.email
    )