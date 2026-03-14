from fastapi import APIRouter
from app.api.endpoints import incidents, users, agents

api_router = APIRouter()
api_router.include_router(incidents.router, prefix="/incidents", tags=["incidents"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(agents.router, prefix="/agents", tags=["agents"])
