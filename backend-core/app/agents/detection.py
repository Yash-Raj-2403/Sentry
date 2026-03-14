from typing import Dict, Any
import logging
from app.models.incident import Incident
from app.models.event import SecurityEvent

logger = logging.getLogger(__name__)

class DetectionAgent:
    """
    Analyzes raw events for suspicious patterns.
    """
    def __init__(self):
        self.connection_counts = {}
        self.port_scan_state = {}

    async def analyze_event(self, state: Dict) -> Dict:
        """
        Main entry point for detection node.
        Receives an AgentState and modifies it.
        """
        try:
            event_data = state["event_data"]
            # Fallback for simple dict state
            investigation_log = state.get("investigation_log", [])
            risk_score = state.get("risk_score", 0.0)
            
            source_ip = event_data.get("source_ip", "unknown")
            dest_ip = event_data.get("destination_ip", "unknown")
            dest_port = event_data.get("destination_port", 0)
            
            risk_increment = 0.0
            anomaly_detected = False
            
            # --- Burst Detection Logic (Stateful simulation) ---
            # In a real system, this state lives in Redis
            count = self.connection_counts.get(source_ip, 0) + 1
            self.connection_counts[source_ip] = count
            
            if count > 20: # Lower threshold for demo
                 # Reset to avoid spam
                self.connection_counts[source_ip] = 0
                risk_increment += 0.4
                anomaly_detected = True
                investigation_log.append(f"DETECTED: Burst traffic from {source_ip} (>20 conns/min)")
                
            # --- Port Scan Logic ---
            if dest_port:
                pair_key = f"{source_ip}->{dest_ip}"
                if pair_key not in self.port_scan_state:
                    self.port_scan_state[pair_key] = set()
                
                self.port_scan_state[pair_key].add(dest_port)
                
                if len(self.port_scan_state[pair_key]) > 5: # Lower threshold for demo
                    risk_increment += 0.6
                    anomaly_detected = True
                    ports_scanned = list(self.port_scan_state[pair_key])
                    investigation_log.append(f"DETECTED: Port scan via {source_ip} targeting {dest_ip} (Ports: {ports_scanned})")
                    # Reset
                    self.port_scan_state[pair_key] = set()

            # Update State
            input_severity = event_data.get("severity", "low").lower()
            if input_severity == "high":
                 risk_increment += 0.8
                 anomaly_detected = True
                 investigation_log.append(f"DETECTED: High severity event reported by source {event_data.get('source')}")

            state["risk_score"] = min(1.0, risk_score + risk_increment)
            state["investigation_log"] = investigation_log
            
            # Create Incident Context if suspicious
            if anomaly_detected or state["risk_score"] > 0.3:
                # If incident object doesn't exist, create a draft
                if not state.get("incident"):
                    state["incident"] = {
                        "title": f"Suspicious Activity from {source_ip}",
                        "severity": "medium",
                        "attacker_ip": source_ip,
                        "description": "Automated detection triggered investigation.",
                        "risk_score": state["risk_score"]
                    }
                else:
                    # Update existing incident draft
                    state["incident"]["risk_score"] = state["risk_score"]
            
            state["current_step"] = "investigation"
            return state

        except Exception as e:
            logger.error(f"Detection error: {e}")
            return state

    # Legacy method for direct execution (kept for compatibility)
    async def legacy_analyze(self, event_data: dict):
        pass
