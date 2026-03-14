from typing import Dict, Any, List
import logging
import json
from datetime import datetime, timedelta
from app.core.supabase import get_supabase_client

logger = logging.getLogger(__name__)

class DetectionAgent:
    """
    Analyzes raw events for suspicious patterns using Supabase for persistent memory.
    """
    def __init__(self):
        # We access Supabase client lazily or in methods to avoid strict dependency on init
        self.client = None

    def _get_client(self):
        if not self.client:
           self.client = get_supabase_client()
        return self.client

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
            
            client = self._get_client()

            if client:
                # --- Burst Detection Logic (Supabase Persistent) ---
                try:
                    # Check recent activity window (e.g. 1 minute)
                    # We store total count, reset if last_seen > 1 min ago
                    row = client.table("detection_rate_limit").select("*").eq("ip_address", source_ip).execute()
                    current_data = row.data[0] if row.data else None
                    
                    new_count = 1
                    is_new_window = True

                    if current_data:
                        last_seen = datetime.fromisoformat(current_data["last_seen"].replace('Z', '+00:00'))
                        # Simple check: if last seen within 60s, increment
                        if (datetime.now(last_seen.tzinfo) - last_seen).total_seconds() < 60:
                            new_count = current_data["request_count"] + 1
                            is_new_window = False
                    
                    # Upsert
                    client.table("detection_rate_limit").upsert({
                        "ip_address": source_ip,
                        "request_count": new_count,
                        "last_seen": datetime.utcnow().isoformat()
                    }).execute()
                    
                    if new_count > 20: 
                        risk_increment += 0.4
                        anomaly_detected = True
                        investigation_log.append(f"DETECTED: Burst traffic from {source_ip} (>20 conns/min)")
                        # Reset count to avoid spamming alerts? 
                        # In robust system, maybe set a cooldown flag.
                        # For now, we continually flag it as high risk.

                except Exception as db_err:
                    logger.error(f"Supabase detection error (burst): {db_err}")


                # --- Port Scan Logic (Supabase Persistent) ---
                if dest_port:
                    try:
                        # Get existing scan record for this pair
                        row = client.table("detection_port_scans")\
                            .select("*")\
                            .eq("source_ip", source_ip)\
                            .eq("dest_ip", dest_ip)\
                            .execute()
                        
                        current_scan = row.data[0] if row.data else None
                        
                        scanned_ports = []
                        if current_scan:
                            scanned_ports = current_scan.get("scanned_ports") or []
                        
                        if dest_port not in scanned_ports:
                            scanned_ports.append(dest_port)
                            # Update DB
                            client.table("detection_port_scans").upsert({
                                "source_ip": source_ip,
                                "dest_ip": dest_ip,
                                "scanned_ports": scanned_ports,
                                "updated_at": datetime.utcnow().isoformat()
                            }, on_conflict="source_ip,dest_ip").execute()
                        
                        if len(scanned_ports) > 5:
                            risk_increment += 0.6
                            anomaly_detected = True
                            investigation_log.append(f"DETECTED: Port scan via {source_ip} targeting {dest_ip} (Ports: {scanned_ports})")

                    except Exception as db_err:
                        logger.error(f"Supabase detection error (port scan): {db_err}")
                        # Fallback: Check raw payload for keywords if DB fails
                        raw_payload = event_data.get("raw_payload", "").lower()
                        if "ssh" in raw_payload or "honeypot" in raw_payload:
                             risk_increment += 0.8
                             anomaly_detected = True
                             investigation_log.append(f"DETECTED (Fallback): Honeypot triggered by {source_ip}")
                        elif "suspicious" in raw_payload or "auth attempt" in raw_payload:
                             risk_increment += 0.9
                             anomaly_detected = True
                             investigation_log.append(f"DETECTED (Fallback): Suspicious activity from {source_ip}")

            else:
                 logger.warning("Supabase client not available, skipping persistent detection logic.")

            # Update State
            input_severity = event_data.get("severity", "low").lower()
            if input_severity == "high":
                 risk_increment += 0.8
                 anomaly_detected = True
                 investigation_log.append(f"DETECTED: High severity event reported by source {event_data.get('source', 'sensor')}")

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
