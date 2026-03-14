from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.api.api import api_router
from app.core.config import settings
from app.db.session import init_db
import app.models # Important: Import models to register them with SQLModel metadata
import asyncio
from app.websocket_listener import listen_for_ws_updates

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Initialize DB
    await init_db()
    
    # Start Redis Pub/Sub listener for WebSockets
    ws_task = asyncio.create_task(listen_for_ws_updates())
    
    yield
    
    # Shutdown: Clean up resources (if any)
    ws_task.cancel()

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan,
)

# Set all CORS enabled origins
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {"message": "Welcome to Sentry Backend API", "docs": "/docs"}
