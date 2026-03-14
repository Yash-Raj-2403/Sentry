from sqlmodel import Field, SQLModel
from datetime import datetime, timezone
from typing import Optional, Dict, Any
from pydantic import ConfigDict

class SecurityEvent(SQLModel, table=False):
    """
    Represents a raw security event received from a sensor.
    Not stored in SQL DB permanently, passed to Redis/Agents.
    """
    id: Optional[str] = None # specific ID if needed
    source_ip: str
    destination_ip: Optional[str] = None
    destination_port: Optional[int] = None
    protocol: Optional[str] = "TCP"
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    event_type: str = "network_connection" # log_entry, network_connection, etc.
    raw_payload: Optional[str] = None
    metadata: Dict[str, Any] = Field(default_factory=dict, sa_column_kwargs={"type_": "JSON"})

    model_config = ConfigDict(arbitrary_types_allowed=True)
