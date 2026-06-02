from sqlalchemy.orm import Session

from app.models.alert_setting import AlertSetting
from app.models.user import User
from app.schemas.alert_schema import AlertSettingRequest
from app.services.notification_service import create_notification


def get_or_create_alert_settings(
    db: Session,
    current_user: User
):
    setting = (
        db.query(AlertSetting)
        .filter(AlertSetting.user_id == current_user.id)
        .first()
    )

    if setting:
        return setting

    setting = AlertSetting(user_id=current_user.id)

    db.add(setting)
    db.commit()
    db.refresh(setting)

    return setting


def update_alert_settings(
    db: Session,
    current_user: User,
    request: AlertSettingRequest
):
    setting = get_or_create_alert_settings(db, current_user)

    setting.demand_spike_threshold = request.demand_spike_threshold
    setting.low_stock_threshold = request.low_stock_threshold
    setting.confidence_threshold = request.confidence_threshold
    setting.email_alerts_enabled = request.email_alerts_enabled
    setting.in_app_alerts_enabled = request.in_app_alerts_enabled

    db.commit()
    db.refresh(setting)

    return setting


def evaluate_forecast_alerts(
    db: Session,
    current_user: User,
    predicted_demand: float,
    confidence_score: float,
    available_stock: float = None
):
    setting = get_or_create_alert_settings(db, current_user)

    alerts = []

    if predicted_demand >= setting.demand_spike_threshold:
        alerts.append(
            f"Demand spike detected. Predicted demand {predicted_demand} is above threshold {setting.demand_spike_threshold}."
        )

    if confidence_score <= setting.confidence_threshold:
        alerts.append(
            f"Low forecast confidence detected. Confidence {confidence_score}% is below threshold {setting.confidence_threshold}%."
        )

    if available_stock is not None and available_stock <= setting.low_stock_threshold:
        alerts.append(
            f"Low stock alert. Available stock {available_stock} is below threshold {setting.low_stock_threshold}."
        )

    for message in alerts:
        if setting.in_app_alerts_enabled:
            create_notification(
                db=db,
                user_id=current_user.id,
                title="Configurable Alert Triggered",
                message=message,
                notification_type="configurable_alert",
                send_email=setting.email_alerts_enabled,
                email=current_user.email
            )

    return alerts