from typing import Dict, Any
import logging
from app.agents.state import AgentState

logger = logging.getLogger(__name__)

class DecisionAgent:
    """
    Calculates final risk score and decides on response actions.
    """
    async def decide(self, state: Dict) -> Dict:
        try:
            investigation_log = state.get("investigation_log", [])
            risk_score = state.get("risk_score", 0.0)
            actions_queue = state.get("actions_queue", [])
            
            # Decision Matrix
            # Risk = Anomaly Score (Detection) * Velocity (Rate) * Asset Crit (Static 1.0)
            
            investigation_log.append(f"DECISION: Evaluating risk score {risk_score:.2f}")
            
            if risk_score > 0.8:
                action = "isolate_host"
                investigation_log.append("DECISION: CRITICAL RISK DETECTED. Recommending host isolation.")
            elif risk_score > 0.5:
                action = "block_ip"
                investigation_log.append(f"DECISION: HIGH RISK. Recommending IP Block for {state.get('incident', {}).get('attacker_ip')}")
            else:
                action = "monitor"
                investigation_log.append("DECISION: LOW RISK. Continuing to monitor.")
                
            if action != "monitor":
                actions_queue.append(action)
                
            state["risk_score"] = risk_score
            state["actions_queue"] = actions_queue
            state["investigation_log"] = investigation_log
            state["current_step"] = "response" if actions_queue else "end"
            
            return state
            
        except Exception as e:
            logger.error(f"Decision error: {e}")
            return state
