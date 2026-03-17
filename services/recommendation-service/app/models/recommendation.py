from pydantic import BaseModel

class RecommendationResponse(BaseModel):
    product_id: int
    reason: str
