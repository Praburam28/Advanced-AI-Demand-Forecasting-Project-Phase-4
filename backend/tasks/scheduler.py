from datetime import datetime, timedelta, timezone

from apscheduler.schedulers.background import BackgroundScheduler

from app.database import SessionLocal
from app.models.automation import AutomationSchedule
from app.models.user import User
from app.services.forecast_service import create_forecast


scheduler = BackgroundScheduler()


def run_due_automation_jobs():
    db = SessionLocal()

    try:
        now = datetime.now(timezone.utc)

        schedules = db.query(AutomationSchedule).filter(
            AutomationSchedule.is_active == True,
            AutomationSchedule.next_run_at <= now
        ).all()

        for schedule in schedules:
            user = db.query(User).filter(User.id == schedule.user_id).first()

            if user:
                try:
                    create_forecast(
                        db=db,
                        current_user=user,
                        dataset_id=schedule.dataset_id,
                        model_name=schedule.model_name,
                        forecast_period=schedule.forecast_period
                    )

                    schedule.last_run_at = now
                    schedule.next_run_at = now + timedelta(
                        minutes=schedule.interval_minutes
                    )

                    db.commit()

                except Exception:
                    schedule.next_run_at = now + timedelta(
                        minutes=schedule.interval_minutes
                    )
                    db.commit()

    finally:
        db.close()


def start_scheduler():
    if not scheduler.running:
        scheduler.add_job(
            run_due_automation_jobs,
            "interval",
            minutes=1,
            id="automation_forecast_runner",
            replace_existing=True
        )

        scheduler.start()


def shutdown_scheduler():
    if scheduler.running:
        scheduler.shutdown()