from fastapi import APIRouter
from app.api.routes import health, recommendation, analytics

api_router = APIRouter()
api_router.include_router(health.router, prefix="/health", tags=["health"])
api_router.include_router(recommendation.router, prefix="/recommendation", tags=["recommendation"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["analytics"])
