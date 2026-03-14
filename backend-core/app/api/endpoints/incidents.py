from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import select
from sqlalchemy import desc
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.incident import Incident
from app.db.session import get_session

router = APIRouter()

@router.get("/", response_model=List[Incident])
async def read_incidents(skip: int = 0, limit: int = 100, session: AsyncSession = Depends(get_session)):
    result = await session.execute(
        select(Incident).order_by(desc(Incident.created_at)).offset(skip).limit(limit)
    )
    return result.scalars().all()

@router.post("/", response_model=Incident)
async def create_incident(incident: Incident, session: AsyncSession = Depends(get_session)):
    session.add(incident)
    await session.commit()
    await session.refresh(incident)
    return incident
