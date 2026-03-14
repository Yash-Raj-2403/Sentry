from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from app.db.session import get_session
from app.models.event import SecurityEvent
from app.core.redis import get_redis_client, redis_client
import json

router = APIRouter()

@router.post("/", response_model=dict)
async def create_event(event: SecurityEvent, redis=Depends(get_redis_client)):
    """
    Ingest a new security event from a sensor.
    """
    try:
        # Push event to Redis Stream for processing
        stream_key = "sentry:events"
        event_data = event.model_dump(mode="json")
        # Ensure timestamp is string for JSON
        if event.timestamp:
            event_data["timestamp"] = event.timestamp.isoformat()
        
        # We need to flatten complex objects or jsonify them for Redis streams if storing as HASH
        # Simplest is to store the whole JSON payload
        await redis.xadd(stream_key, {"payload": json.dumps(event_data)})
        
        return {"status": "received", "event_id": event.id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
