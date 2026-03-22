from fastapi import APIRouter
from app.schemas.recommendation_schema import RecommendationRequest, RecommendationResponse
from app.services.recommendation_service import get_recommendations

router = APIRouter()

@router.post("/", response_model=RecommendationResponse)
def get_recommendation(request: RecommendationRequest):
    recommendations = get_recommendations(request.basket)
    return RecommendationResponse(recommendations=recommendations)