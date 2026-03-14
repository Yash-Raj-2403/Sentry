from sqlmodel import Field, SQLModel
from datetime import datetime, timezone
from typing import Optional

class InvestigationStep(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    incident_id: int = Field(index=True)
    step_number: int
    agent_name: str
    action_taken: str
    result: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ResponseAction(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    incident_id: int = Field(index=True)
    action_type: str # blacklist_ip, isolate_host
    target: str
    status: str # pending, executed, failed
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
