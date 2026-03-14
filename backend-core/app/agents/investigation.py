from typing import Dict, Any
import logging
from app.agents.state import AgentState

logger = logging.getLogger(__name__)

class InvestigationAgent:
    """
    Queries logs and builds evidence for detected incidents.
    """
    async def investigate(self, state: Dict) -> Dict:
        try:
            investigation_log = state.get("investigation_log", [])
            incident = state.get("incident")
            
            if not incident:
                logger.info("No incident to investigate. Skipping.")
                state["current_step"] = "end"
                return state
                
            investigation_log.append("INVESTIGATING: Analyzing historical patterns for IP " + incident.get("attacker_ip", "unknown"))
            
            # Mock reasoning: checking "Threat Intelligence"
            attacker_ip = incident.get("attacker_ip")
            if attacker_ip == "192.168.1.100": # Simulation: known bad IP
                investigation_log.append("INTEL: IP found in threat feed (High Confidence)")
                state["risk_score"] = min(1.0, state["risk_score"] + 0.3)
            else:
                investigation_log.append("INTEL: IP clean in global threat feeds.")
                
            state["investigation_log"] = investigation_log
            state["current_step"] = "decision"
            return state
            
        except Exception as e:
            logger.error(f"Investigation error: {e}")
            return state
