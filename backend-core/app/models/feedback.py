from sqlmodel import Field, SQLModel
from datetime import datetime, timezone
from typing import Optional


class DecisionWeight(SQLModel, table=True):
    """
    Persists the learned weights for the DecisionAgent's risk formula.
    These weights are updated each time an admin submits a False Positive flag.
    """
    __tablename__ = "decision_weights"

    id: Optional[int] = Field(default=None, primary_key=True)
    # Multiplier applied to the raw anomaly score from DetectionAgent
    anomaly_weight: float = Field(default=1.0)
    # Multiplier applied when burst/velocity traffic is seen
    velocity_weight: float = Field(default=1.5)
    # Multiplier applied based on the absolute asset criticality
    criticality_weight: float = Field(default=1.0)
    # Running count of false-positive feedback used to track learning convergence
    false_positive_count: int = Field(default=0)
    # Running count of true-positive feedback  
    true_positive_count: int = Field(default=0)
    last_updated: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_by: Optional[str] = Field(default=None)  # admin username


class FeedbackEvent(SQLModel, table=True):
    """
    Immutable audit log of every feedback submission from an admin.
    Useful for debugging model drift and replaying weight adjustments.
    """
    __tablename__ = "feedback_events"

    id: Optional[int] = Field(default=None, primary_key=True)
    incident_id: int = Field(index=True)
    feedback_type: str  # "false_positive", "true_positive", "benign"
    admin_username: str
    notes: Optional[str] = None
    # Snapshot the risk score at the time of flagging for auditing
    incident_risk_score: float = 0.0
    # Weight deltas applied as a result of this feedback
    delta_anomaly_weight: float = 0.0
    delta_velocity_weight: float = 0.0
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
