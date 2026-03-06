from fastapi import APIRouter, Header, Depends, HTTPException
from app.models.cart import Cart, CartItem
from app.services.cart_service import CartService
import logging

logger = logging.getLogger("cart_router")
router = APIRouter(prefix="/api/cart", tags=["cart"])
cart_service = CartService()

@router.get("/{user_id}", response_model=Cart)
def get_cart(user_id: int):
    return cart_service.get_cart(user_id)

@router.post("/{user_id}/items", response_model=Cart)
def add_item(user_id: int, item: CartItem):
    logger.info(f"Adding item {item.product_id} to cart of user {user_id}")
    return cart_service.add_item(user_id, item)

@router.put("/{user_id}/items/{product_id}", response_model=Cart)
def update_item(user_id: int, product_id: int, quantity: int):
    logger.info(f"Updating item {product_id} in cart of user {user_id} to {quantity}")
    return cart_service.update_item_quantity(user_id, product_id, quantity)

@router.delete("/{user_id}/items/{product_id}", response_model=Cart)
def remove_item(user_id: int, product_id: int):
    logger.info(f"Removing item {product_id} from cart of user {user_id}")
    return cart_service.remove_item(user_id, product_id)

@router.delete("/{user_id}", status_code=204)
def clear_cart(user_id: int):
    cart_service.clear_cart(user_id)
