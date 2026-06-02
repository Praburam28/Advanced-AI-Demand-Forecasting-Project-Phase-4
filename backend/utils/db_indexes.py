from sqlalchemy import Index

from app.models.user import User
from app.models.dataset import Dataset
from app.models.forecast import Forecast
from app.models.notification import Notification
from app.models.activity_log import ActivityLog


Index("idx_users_email", User.email)
Index("idx_datasets_user_id", Dataset.user_id)
Index("idx_forecasts_user_id", Forecast.user_id)
Index("idx_forecasts_dataset_id", Forecast.dataset_id)
Index("idx_notifications_user_id", Notification.user_id)
Index("idx_activity_logs_user_id", ActivityLog.user_id)