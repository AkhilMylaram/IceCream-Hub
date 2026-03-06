from sqlalchemy import create_engine, text
from app.models.recommendation import RecommendationResponse
import logging

import os
logger = logging.getLogger("recommendation_service")
db_url = os.environ.get("DATABASE_URL", "mysql+pymysql://icecream_user:icecream_password@localhost:3306/recommendation_db")
engine = create_engine(db_url)

def init_db():
    with engine.begin() as conn:
        conn.execute(text("""
            CREATE TABLE IF NOT EXISTS product_stats (
                product_id INT PRIMARY KEY,
                views INT DEFAULT 0,
                purchases INT DEFAULT 0
            )
        """))

def get_popular_recommendations():
    with engine.connect() as conn:
        result = conn.execute(text("SELECT product_id FROM product_stats ORDER BY purchases DESC LIMIT 5"))
        products = [row[0] for row in result]
    
    if not products:
        products = [1, 2, 3] 
        
    return [RecommendationResponse(product_id=pid, reason="Popular item") for pid in products]

def get_personalized_recommendations(user_id: int):
    return [RecommendationResponse(product_id=4, reason=f"Recommended for user {user_id}")]
    
def get_related_recommendations(product_id: int):
    return [RecommendationResponse(product_id=product_id+1, reason=f"Related to product {product_id}")]
