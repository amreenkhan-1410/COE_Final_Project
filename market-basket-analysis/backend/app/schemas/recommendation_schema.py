from typing import List

from pydantic import BaseModel, Field


class RecommendationRequest(BaseModel):
    basket: List[str]


class RecommendationItem(BaseModel):
    name: str
    reason: str
    strength: str
    context_items: List[str] = Field(default_factory=list)


class RecommendationResponse(BaseModel):
    recommendations: List[RecommendationItem]
