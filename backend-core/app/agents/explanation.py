from typing import Dict, Any
import logging
from app.agents.state import AgentState

logger = logging.getLogger(__name__)

class ExplanationAgent:
    """
    Generates SOC report and explanation of incident.
    """
    async def explain(self, state: Dict) -> Dict:
        try:
            investigation_log = state.get("investigation_log", [])
            incident = state.get("incident")
            
            if incident:
                # LLM would normally generate this from the log
                report = f"INCIDENT REPORT\n" \
                         f"Target: Asset-1\n" \
                         f"Attacker: {incident.get('attacker_ip')}\n" \
                         f"Technique: Port Scan/Brute Force (T1046)\n" \
                         f"Summary: The system detected multiple failed connection attempts and potential reconnaissance activity. " \
                         f"Risk score escalated to {state['risk_score']:.2f} due to threat intelligence correlation."
                
                investigation_log.append(report)
            
            state["investigation_log"] = investigation_log
            state["current_step"] = "finish"
            return state
            
        except Exception as e:
            logger.error(f"Explanation error: {e}")
            return state
