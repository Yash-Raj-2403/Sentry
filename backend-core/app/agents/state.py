from typing import List, Dict, TypedDict
from langchain_core.messages import BaseMessage
from app.models.incident import Incident
from app.models.actions import InvestigationStep

class AgentState(TypedDict):
    """
    Shared state for the cybersecurity agent graph.
    """
    event_data: Dict # Raw event payload
    incident: Incident # Incident context (if detected)
    investigation_log: List[str] # Chain of reasoning
    actions_queue: List[str] # Recommended actions
    risk_score: float
    current_step: str # detection, investigation, decision, response
