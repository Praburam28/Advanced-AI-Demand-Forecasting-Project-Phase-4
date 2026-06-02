from app.tasks.celery_app import celery_app
from app.database import SessionLocal

from app.models.user import User

from app.services.forecast_service import create_forecast
from app.services.report_service import generate_dashboard_report


@celery_app.task(name="run_forecast_task")
def run_forecast_task(
    user_id: int,
    dataset_id: int,
    model_name: str,
    forecast_period: int
):
    db = SessionLocal()

    try:
        user = db.query(User).filter(User.id == user_id).first()

        if not user:
            return {
                "status": "failed",
                "message": "User not found"
            }

        forecast = create_forecast(
            db=db,
            current_user=user,
            dataset_id=dataset_id,
            model_name=model_name,
            forecast_period=forecast_period
        )

        return {
            "status": "success",
            "forecast_id": forecast.id
        }

    except Exception as e:
        return {
            "status": "failed",
            "message": str(e)
        }

    finally:
        db.close()


@celery_app.task(name="generate_report_task")
def generate_report_task(
    user_id: int,
    report_name: str,
    report_type: str
):
    db = SessionLocal()

    try:
        user = db.query(User).filter(User.id == user_id).first()

        if not user:
            return {
                "status": "failed",
                "message": "User not found"
            }

        report = generate_dashboard_report(
            db=db,
            current_user=user,
            report_name=report_name,
            report_type=report_type
        )

        return {
            "status": "success",
            "report_id": report.id
        }

    except Exception as e:
        return {
            "status": "failed",
            "message": str(e)
        }

    finally:
        db.close()