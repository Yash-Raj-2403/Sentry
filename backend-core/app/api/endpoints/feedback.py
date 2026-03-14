"""
Feedback API Endpoint

POST /api/v1/feedback/{incident_id}
  Body: { feedback_type, admin_username, notes }
  → Applies weight update to DecisionAgent, writes audit log.

GET  /api/v1/feedback/weights
  → Returns the current DecisionAgent weight record.

GET  /api/v1/feedback/history
  → Returns the full audit log of all feedback events.
"""

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select

from app.db.session import get_session
from app.models.feedback import DecisionWeight, FeedbackEvent
from app.services.feedback_service import submit_feedback, get_current_weights

router = APIRouter()


# ── Request / Response Schemas ────────────────────────────────────────────────

class FeedbackRequest(BaseModel):
    feedback_type: str = Field(
        ...,
        description="One of: 'false_positive', 'true_positive', 'benign'",
        examples=["false_positive"],
    )
    admin_username: str = Field(
        ...,
        description="Username of the administrator submitting the feedback",
        examples=["admin"],
    )
    notes: Optional[str] = Field(
        None,
        description="Optional human-readable note explaining the classification",
    )


class FeedbackResponse(BaseModel):
    incident_id: int
    feedback_applied: str
    updated_weights: dict
    delta: dict
    total_feedback: dict


# ── Endpoints ─────────────────────────────────────────────────────────────────

@router.post("/{incident_id}", response_model=FeedbackResponse, status_code=200)
async def flag_incident(
    incident_id: int,
    body: FeedbackRequest,
    session: AsyncSession = Depends(get_session),
):
    """
    Flag an incident as a False Positive, True Positive, or Benign.

    - **false_positive**: The alert was wrong → DecisionAgent becomes less
      aggressive (anomaly & velocity weights reduced by 5%).
    - **true_positive**: The alert was correct → DecisionAgent reinforced
      (weights increased by 5%).
    - **benign**: Mark as benign without weight update.

    Every submission is written to an immutable audit log (`feedback_events`
    table) regardless of type.
    """
    valid_types = {"false_positive", "true_positive", "benign"}
    if body.feedback_type not in valid_types:
        raise HTTPException(
            status_code=422,
            detail=f"feedback_type must be one of {valid_types}",
        )

    try:
        result = await submit_feedback(
            incident_id=incident_id,
            feedback_type=body.feedback_type,
            admin_username=body.admin_username,
            notes=body.notes,
            session=session,
        )
        return result
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Feedback processing failed: {e}")


@router.get("/weights", response_model=DecisionWeight)
async def get_weights(session: AsyncSession = Depends(get_session)):
    """
    Returns the current learned weights of the DecisionAgent.
    Useful for admin dashboards to visualize model drift over time.
    """
    weights = await get_current_weights(session)
    return weights


@router.get("/history", response_model=List[FeedbackEvent])
async def get_feedback_history(
    skip: int = 0,
    limit: int = 100,
    session: AsyncSession = Depends(get_session),
):
    """
    Returns the full audit log of all admin feedback events in reverse
    chronological order.
    """
    result = await session.execute(
        select(FeedbackEvent)
        .order_by(FeedbackEvent.created_at.desc())
        .offset(skip)
        .limit(limit)
    )
    return result.scalars().all()
