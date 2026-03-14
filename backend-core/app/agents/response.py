from typing import Dict, Any
import logging
import subprocess
from app.agents.state import AgentState

logger = logging.getLogger(__name__)

class ResponseAgent:
    """
    Executes mitigation actions (firewall block, isolation, process termination).
    """
    def __init__(self):
        # Set to False to actually execute system commands 
        # WARNING: Running with False may alter your local machine's network
        self.IS_DRY_RUN = True

    def _execute_command(self, cmd: list) -> str:
        """Helper to run shell commands safely"""
        if self.IS_DRY_RUN:
            # DEMO MODE: Simulating success for presentation
            return f"Success: Rule added to iptables (Simulation)"
        try:
            result = subprocess.run(cmd, capture_output=True, text=True, check=True)
            return f"Success: {result.stdout.strip()}"
        except subprocess.CalledProcessError as e:
            return f"Failed: {e.stderr.strip()}"

    async def execute(self, state: Dict) -> Dict:
        try:
            investigation_log = state.get("investigation_log", [])
            actions = state.get("actions_queue", [])
            event_data = state.get("event_data", {})
            attacker_ip = event_data.get("source_ip", "unknown")
            
            for action in actions:
                investigation_log.append(f"RESPONSE: Formatting action payload for '{action}'...")
                
                if action == "block_ip":
                    cmd = ["sudo", "iptables", "-A", "INPUT", "-s", attacker_ip, "-j", "DROP"]
                    result = self._execute_command(cmd)
                    investigation_log.append(f"RESPONSE: Firewall rule execution -> {result}")
                    
                elif action == "isolate_host":
                    # Drop interface down but leave admin/docker network up ideally
                    cmd = ["sudo", "ip", "link", "set", "eth0", "down"]
                    result = self._execute_command(cmd)
                    investigation_log.append(f"RESPONSE: Micro-segmentation network isolation -> {result}")

                elif action == "kill_process":
                    pid = str(event_data.get("pid", "0"))
                    cmd = ["sudo", "kill", "-9", pid]
                    result = self._execute_command(cmd)
                    investigation_log.append(f"RESPONSE: Process Assassination (PID: {pid}) -> {result}")
                    
            state["investigation_log"] = investigation_log
            state["current_step"] = "remediation"
            return state
            
        except Exception as e:
            logger.error(f"Response error: {e}")
            return state
