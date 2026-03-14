import asyncio
import json
import logging
from app.api.endpoints.websockets import manager
from app.core.redis import get_redis_client

logger = logging.getLogger(__name__)

async def listen_for_ws_updates():
    """
    Subscribes to the Redis Pub/Sub channel 'sentry_ws_updates'
    and broadcasts incoming messages to all connected FastAPI websockets.
    """
    redis = await get_redis_client()
    pubsub = redis.pubsub()
    await pubsub.subscribe("sentry_ws_updates")
    
    logger.info("Started WebSocket Pub/Sub listener on 'sentry_ws_updates'")
    
    try:
        async for message in pubsub.listen():
            if message["type"] == "message":
                try:
                    data = json.loads(message["data"])
                    await manager.broadcast(data)
                except json.JSONDecodeError:
                    logger.error("Failed to decode WS message from Redis")
                except Exception as e:
                    logger.error(f"Error broadcasting WS message: {e}")
    except asyncio.CancelledError:
        logger.info("WebSocket Pub/Sub listener task cancelled")
    finally:
        await pubsub.unsubscribe("sentry_ws_updates")
