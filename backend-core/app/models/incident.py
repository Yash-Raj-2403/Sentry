from sqlmodel import Field, SQLModel
from datetime import datetime, timezone
from typing import Optional

class Incident(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str = Field(index=True)
    severity: str  # low, medium, high, critical
    status: str = "new" # new, investigating, resolved, closed
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    description: Optional[str] = None
    attacker_ip: Optional[str] = None
    risk_score: float = 0.0
