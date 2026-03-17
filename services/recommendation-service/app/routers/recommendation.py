from fastapi import APIRouter
from app.services import recommendation_service
from typing import List
from app.models.recommendation import RecommendationResponse

router = APIRouter(prefix="/api/recommendations", tags=["recommendations"])

@router.get("/popular", response_model=List[RecommendationResponse])
def get_popular():
    return recommendation_service.get_popular_recommendations()

@router.get("/user/{user_id}", response_model=List[RecommendationResponse])
def get_personalized(user_id: int):
    return recommendation_service.get_personalized_recommendations(user_id)

@router.get("/product/{product_id}/related", response_model=List[RecommendationResponse])
def get_related(product_id: int):
    return recommendation_service.get_related_recommendations(product_id)
