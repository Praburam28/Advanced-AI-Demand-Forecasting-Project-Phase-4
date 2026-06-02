from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
from slowapi import _rate_limit_exceeded_handler

from app.config import settings
from app.database import Base, engine
from app.security.rate_limiter import limiter

from app.models.user import User
from app.models.activity_log import ActivityLog
from app.models.dataset import Dataset
from app.models.forecast import Forecast
from app.models.ai_insight import AIInsight
from app.models.automation import AutomationSchedule
from app.models.notification import Notification
from app.models.integration import Integration, WebhookEvent
from app.models.report import Report
from app.models.alert_setting import AlertSetting


from app.routers import auth_router
from app.routers import user_router
from app.routers import dataset_router
from app.routers import forecast_router
from app.routers import ai_insight_router
from app.routers import automation_router
from app.routers import notification_router
from app.routers import integration_router
from app.routers import report_router
from app.routers import dashboard_router
from app.routers import audit_router
from app.routers import task_router
from app.routers import websocket_router
from app.routers import alert_router


from app.routers.report_export_router import router as report_export_router

from app.tasks.scheduler import start_scheduler, shutdown_scheduler


app = FastAPI(
    title=settings.APP_NAME,
    version="4.0.0"
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(SlowAPIMiddleware)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


Base.metadata.create_all(bind=engine)


app.include_router(auth_router.router)
app.include_router(user_router.router)
app.include_router(dataset_router.router)
app.include_router(forecast_router.router)
app.include_router(ai_insight_router.router)
app.include_router(automation_router.router)
app.include_router(notification_router.router)
app.include_router(integration_router.router)
app.include_router(report_router.router)
app.include_router(dashboard_router.router)
app.include_router(audit_router.router)
app.include_router(task_router.router)
app.include_router(websocket_router.router)
app.include_router(alert_router.router)
app.include_router(report_export_router)

@app.on_event("startup")
def startup_event():
    start_scheduler()


@app.on_event("shutdown")
def shutdown_event():
    shutdown_scheduler()


@app.get("/")
def root():
    return {
        "message": "Advanced AI Demand Forecasting Phase 4 API is running"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "version": "4.0.0"
    }