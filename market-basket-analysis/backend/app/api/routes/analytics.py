from fastapi import APIRouter
from app.services.analysis_service import get_analytics

router = APIRouter()

@router.get("/")
def get_analytics_data():
    return get_analytics()
