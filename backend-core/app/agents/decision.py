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
            
            anomaly_score = state.get("risk_score", 0.0) # Base anomaly from detection
            attack_velocity = 1.0 # Default multiplier
            asset_criticality = 1.0 # Default for standard asset
            
            # Simple heuristic for velocity based on previous detection count (stored in investigation log text for MVP)
            # In production, this would be computed from Redis sliding window
            if any("Burst" in log for log in investigation_log):
                attack_velocity = 1.5
            
            final_risk = min(1.0, anomaly_score * attack_velocity * asset_criticality)
            
            investigation_log.append(f"DECISION: Evaluating Risk Formula: {anomaly_score:.2f} (Anomaly) * {attack_velocity} (Velocity) * {asset_criticality} (Criticality) = {final_risk:.2f}")
            
            if final_risk > 0.8:
                action = "isolate_host"
                investigation_log.append("DECISION: CRITICAL RISK DETECTED. Recommending host isolation.")
            elif final_risk > 0.5:
                action = "block_ip"
                investigation_log.append(f"DECISION: HIGH RISK. Recommending IP Block for {state.get('incident', {}).get('attacker_ip')}")
            else:
                action = "monitor"
                investigation_log.append("DECISION: LOW RISK. Continuing to monitor.")
            
            state["risk_score"] = final_risk
                
            if action != "monitor":
                actions_queue.append(action)
                
            # Update state with FINAL calculated risk
            state["risk_score"] = final_risk
            state["actions_queue"] = actions_queue
            state["investigation_log"] = investigation_log
            state["current_step"] = "response" if actions_queue else "end"
            
            return state
            
        except Exception as e:
            logger.error(f"Decision error: {e}")
            return state
