"""
FeedbackService: Handles admin False Positive / True Positive submissions.

When an admin flags an incident as a False Positive:
1.  The incident's `feedback` field is updated to "false_positive".
2.  The global DecisionWeight record is updated using a small learning-rate
    step: weights are slightly reduced so the agent becomes less aggressive
    in the future for similar event profiles.
3.  An immutable FeedbackEvent audit record is written.

Weight Update Formula (gradient-descent-inspired, online learning):
  new_weight = old_weight * (1 - LEARNING_RATE)   # for false_positive
  new_weight = old_weight * (1 + LEARNING_RATE)   # for true_positive (reinforce)
  weights are clamped to [MIN_WEIGHT, MAX_WEIGHT] to avoid runaway values.
"""

import logging
from typing import Optional
from datetime import datetime, timezone

from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select

from app.models.incident import Incident
from app.models.feedback import DecisionWeight, FeedbackEvent

logger = logging.getLogger(__name__)

# ── Hyper-parameters ──────────────────────────────────────────────────────────
LEARNING_RATE = 0.05   # How aggressively weights shift per feedback event
MIN_WEIGHT = 0.3       # Floor – never suppress risk below 30 % of original
MAX_WEIGHT = 2.0       # Ceiling – never amplify beyond 2×


async def _get_or_create_weights(session: AsyncSession) -> DecisionWeight:
    """Return the single global weight row, creating it with defaults if absent."""
    result = await session.execute(select(DecisionWeight).limit(1))
    row = result.scalars().first()
    if row is None:
        row = DecisionWeight()
        session.add(row)
        await session.commit()
        await session.refresh(row)
    return row


async def submit_feedback(
    incident_id: int,
    feedback_type: str,        # "false_positive" | "true_positive" | "benign"
    admin_username: str,
    notes: Optional[str],
    session: AsyncSession,
) -> dict:
    """
    Core feedback handler called from the API endpoint.
    Returns a summary dict describing what changed.
    """
    # ── 1. Retrieve and validate the incident ─────────────────────────────────
    result = await session.execute(select(Incident).where(Incident.id == incident_id))
    incident = result.scalars().first()
    if not incident:
        raise ValueError(f"Incident {incident_id} not found")

    prior_risk = incident.risk_score

    # ── 2. Update the incident's feedback flag ────────────────────────────────
    incident.feedback = feedback_type
    session.add(incident)

    # ── 3. Load (or bootstrap) global decision weights ────────────────────────
    weights = await _get_or_create_weights(session)

    delta_anomaly = 0.0
    delta_velocity = 0.0

    if feedback_type == "false_positive":
        # The model was too aggressive → reduce sensitivity
        new_anomaly = max(MIN_WEIGHT, weights.anomaly_weight * (1 - LEARNING_RATE))
        new_velocity = max(MIN_WEIGHT, weights.velocity_weight * (1 - LEARNING_RATE))
        delta_anomaly = new_anomaly - weights.anomaly_weight
        delta_velocity = new_velocity - weights.velocity_weight
        weights.anomaly_weight = new_anomaly
        weights.velocity_weight = new_velocity
        weights.false_positive_count += 1
        logger.info(
            f"[FeedbackService] FP on incident {incident_id} → "
            f"anomaly_weight={new_anomaly:.4f}, velocity_weight={new_velocity:.4f}"
        )

    elif feedback_type == "true_positive":
        # The model was correct → reinforce sensitivity (up to ceiling)
        new_anomaly = min(MAX_WEIGHT, weights.anomaly_weight * (1 + LEARNING_RATE))
        new_velocity = min(MAX_WEIGHT, weights.velocity_weight * (1 + LEARNING_RATE))
        delta_anomaly = new_anomaly - weights.anomaly_weight
        delta_velocity = new_velocity - weights.velocity_weight
        weights.anomaly_weight = new_anomaly
        weights.velocity_weight = new_velocity
        weights.true_positive_count += 1
        logger.info(
            f"[FeedbackService] TP on incident {incident_id} → "
            f"anomaly_weight={new_anomaly:.4f}, velocity_weight={new_velocity:.4f}"
        )

    # "benign" feedback: mark the incident only, no weight change needed
    weights.last_updated = datetime.now(timezone.utc)
    weights.updated_by = admin_username
    session.add(weights)

    # ── 4. Write immutable audit record ──────────────────────────────────────
    audit = FeedbackEvent(
        incident_id=incident_id,
        feedback_type=feedback_type,
        admin_username=admin_username,
        notes=notes,
        incident_risk_score=prior_risk,
        delta_anomaly_weight=delta_anomaly,
        delta_velocity_weight=delta_velocity,
    )
    session.add(audit)
    await session.commit()

    return {
        "incident_id": incident_id,
        "feedback_applied": feedback_type,
        "updated_weights": {
            "anomaly_weight": weights.anomaly_weight,
            "velocity_weight": weights.velocity_weight,
            "criticality_weight": weights.criticality_weight,
        },
        "delta": {
            "anomaly_weight": delta_anomaly,
            "velocity_weight": delta_velocity,
        },
        "total_feedback": {
            "false_positives": weights.false_positive_count,
            "true_positives": weights.true_positive_count,
        },
    }


async def get_current_weights(session: AsyncSession) -> DecisionWeight:
    """Convenience helper – returns the current weight row."""
    return await _get_or_create_weights(session)
