from typing import Dict, Any
import logging
from app.agents.state import AgentState

logger = logging.getLogger(__name__)

class ResponseAgent:
    """
    Executes mitigation actions (firewall block, etc.).
    """
    async def execute(self, state: Dict) -> Dict:
        try:
            investigation_log = state.get("investigation_log", [])
            actions = state.get("actions_queue", [])
            
            for action in actions:
                investigation_log.append(f"RESPONSE: Executing action {action}...")
                
                # MOCK Execution
                if action == "block_ip":
                    # os.system(f"iptables -A INPUT -s {ip} -j DROP")
                    investigation_log.append("RESPONSE: Firewall rule Added - OK")
                elif action == "isolate_host":
                    investigation_log.append("RESPONSE: Network Isolation Enabled - OK")
                    
            state["investigation_log"] = investigation_log
            state["current_step"] = "explanation"
            return state
            
        except Exception as e:
            logger.error(f"Response error: {e}")
            return state
