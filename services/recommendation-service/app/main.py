from fastapi import FastAPI, Request
from app.routers import recommendation
from app.services.recommendation_service import init_db
from prometheus_client import make_asgi_app
import uuid
import logging
import contextvars
import asyncio
import os
import json
from aiokafka import AIOKafkaConsumer
from app.services.recommendation_service import record_purchase, init_db

request_id_context = contextvars.ContextVar("request_id", default="")

class RequestIdFilter(logging.Filter):
    def filter(self, record):
        record.request_id = request_id_context.get()
        return True

logging.basicConfig(
    level=logging.INFO,
    format="[%(asctime)s] [recommendation-service] [%(levelname)s] [%(request_id)s] %(name)s - %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S"
)
for handler in logging.root.handlers:
    handler.addFilter(RequestIdFilter())

init_db()

logger = logging.getLogger("recommendation_service")

async def consume_orders():
    # Increased wait time for Kafka to be fully ready in slow environments
    await asyncio.sleep(15)
    
    kafka_host = os.environ.get("KAFKA_HOST", "kafka:9092")
    logger.info(f"Connecting Kafka Consumer to {kafka_host}...")
    
    consumer = AIOKafkaConsumer(
        "order-placed",
        bootstrap_servers=kafka_host,
        group_id="recommendation-group",
        auto_offset_reset='earliest'
    )
    
    try:
        await consumer.start()
        logger.info("Kafka Consumer started on topic 'order-placed'")
        async for msg in consumer:
            try:
                order_data = json.loads(msg.value)
                logger.info(f"Received order event: {order_data}")
                for item in order_data.get("items", []):
                    record_purchase(item["productId"], item["quantity"])
            except Exception as e:
                logger.error(f"Error processing Kafka message: {e}")
    except Exception as e:
        logger.error(f"Kafka Consumer failed to start: {e}")
    finally:
        await consumer.stop()

from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Start Kafka consumer in the background
    task = asyncio.create_task(consume_orders())
    yield
    # Cleanup (optional, but good practice)
    task.cancel()
    try:
        await task
    except asyncio.CancelledError:
        logger.info("Kafka consumer task cancelled")

app = FastAPI(title="IceCream Hub Recommendation Service", lifespan=lifespan)

metrics_app = make_asgi_app()
app.mount("/metrics", metrics_app)

@app.middleware("http")
async def request_id_middleware(request: Request, call_next):
    req_id = request.headers.get("X-Request-ID")
    if not req_id:
        req_id = uuid.uuid4().hex[:8]
    
    request_id_context.set(req_id)
    response = await call_next(request)
    response.headers["X-Request-ID"] = req_id
    return response

app.include_router(recommendation.router)
