import redis
import json
from app.models.cart import Cart, CartItem
import logging
from prometheus_client import Counter

logger = logging.getLogger("cart_service")
cart_additions_counter = Counter("cart_additions_total", "Total items added to cart")

import os

class CartService:
    def __init__(self, redis_host: str = None, redis_port: int = 6379):
        redis_host = redis_host or os.environ.get("REDIS_HOST", "localhost")
        redis_port = int(os.environ.get("REDIS_PORT", redis_port))
        self.r = redis.Redis(host=redis_host, port=redis_port, db=0, decode_responses=True)

    def _get_cart_key(self, user_id: int) -> str:
        return f"cart:{user_id}"

    def get_cart(self, user_id: int) -> Cart:
        logger.info(f"Fetching cart for user {user_id}")
        data = self.r.get(self._get_cart_key(user_id))
        if data:
            return Cart.model_validate_json(data)
        return Cart(user_id=user_id, items=[], total_price=0.0)

    def save_cart(self, cart: Cart):
        cart.total_price = sum(item.price * item.quantity for item in cart.items)
        self.r.set(self._get_cart_key(cart.user_id), cart.model_dump_json())
        logger.info(f"Saved cart for user {cart.user_id}")

    def add_item(self, user_id: int, item: CartItem) -> Cart:
        cart_additions_counter.inc(item.quantity)
        cart = self.get_cart(user_id)
        for existing_item in cart.items:
            if existing_item.product_id == item.product_id:
                existing_item.quantity += item.quantity
                self.save_cart(cart)
                return cart
        
        cart.items.append(item)
        self.save_cart(cart)
        return cart

    def update_item_quantity(self, user_id: int, product_id: int, quantity: int) -> Cart:
        cart = self.get_cart(user_id)
        for item in cart.items:
            if item.product_id == product_id:
                if quantity <= 0:
                    cart.items.remove(item)
                else:
                    item.quantity = quantity
                break
        self.save_cart(cart)
        return cart

    def remove_item(self, user_id: int, product_id: int) -> Cart:
        return self.update_item_quantity(user_id, product_id, 0)
        
    def clear_cart(self, user_id: int):
        self.r.delete(self._get_cart_key(user_id))
        logger.info(f"Cleared cart for user {user_id}")
