from pydantic import BaseModel
from typing import List, Optional

class CartItem(BaseModel):
    product_id: int
    name: str
    price: float
    quantity: int
    image_url: Optional[str] = None

class Cart(BaseModel):
    user_id: int
    items: List[CartItem] = []
    total_price: float = 0.0
