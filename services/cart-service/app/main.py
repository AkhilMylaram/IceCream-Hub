from fastapi import FastAPI, Request
from app.routers import cart
import uuid
import logging
import contextvars

request_id_context = contextvars.ContextVar("request_id", default="")

class RequestIdFilter(logging.Filter):
    def filter(self, record):
        record.request_id = request_id_context.get()
        return True

logging.basicConfig(
    level=logging.INFO,
    format="[%(asctime)s] [cart-service] [%(levelname)s] [%(request_id)s] %(name)s - %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S"
)
for handler in logging.root.handlers:
    handler.addFilter(RequestIdFilter())

from prometheus_client import make_asgi_app

app = FastAPI(title="IceCream Hub Cart Service")

metrics_app = make_asgi_app()
app.mount("/metrics", metrics_app)

@app.middleware("http")
async def request_id_middleware(request: Request, call_next):
    req_id = request.headers.get("X-Request-ID")
    if not req_id:
        req_id = str(uuid.uuid4())[:8]
    
    request_id_context.set(req_id)
    response = await call_next(request)
    response.headers["X-Request-ID"] = req_id
    return response

app.include_router(cart.router)
