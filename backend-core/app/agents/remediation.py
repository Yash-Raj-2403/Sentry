from typing import Dict, Any
import logging
import subprocess

logger = logging.getLogger(__name__)

class RemediationAgent:
    """
    Handles automated recovery and system healing post-mitigation.
    E.g., Config rollbacks, restoring corrupted databases, and snapshot restorations.
    """
    def __init__(self):
        self.IS_DRY_RUN = True

    def _execute_recovery(self, cmd: list) -> str:
        """Helper to run system recovery shell commands safely"""
        if self.IS_DRY_RUN:
            return f"[DRY-RUN Recovery] Would have executed: {' '.join(cmd)}"
        try:
            result = subprocess.run(cmd, capture_output=True, text=True, check=True)
            return f"Recovery Success: {result.stdout.strip()}"
        except subprocess.CalledProcessError as e:
            return f"Recovery Failed: {e.stderr.strip()}"

    async def remediate(self, state: Dict) -> Dict:
        try:
            investigation_log = state.get("investigation_log", [])
            actions = state.get("actions_queue", [])
            event_type = state.get("event_data", {}).get("event_type", "")
            incident_title = str(state.get("incident", {}).get("title", "")).lower()
            
            remediation_performed = False

            investigation_log.append("REMEDIATION: Analyzing system state for post-attack recovery...")

            # 1. Configuration File Healing (e.g. Hacker tampered with /etc/passwd or SSH keys)
            if "file_tampering" in event_type or "privilege_escalation" in incident_title:
                investigation_log.append("REMEDIATION: Detected configuration tampering. Initiating config rollback.")
                
                # Command replaces the tampered shadow file with our secure, read-only backup vault copy.
                cmd = ["sudo", "cp", "/var/sentry_vault/shadow.bak", "/etc/shadow"]
                result = self._execute_recovery(cmd)
                
                investigation_log.append(f"REMEDIATION: Core identity config rollback -> {result}")
                remediation_performed = True

            # 2. Ransomware / Mass Directory Deletion Recovery (Snapshot Revert)
            if "ransomware" in incident_title or "mass_delete" in event_type:
                investigation_log.append("REMEDIATION: Catastrophic file manipulation detected. Triggering ZFS/Btrfs snapshot rollback.")
                
                # Command invokes the file system to revert the entire drive state back to 5 minutes ago automatically
                cmd = ["sudo", "zfs", "rollback", "pool/data@sentry_safe_state"]
                result = self._execute_recovery(cmd)

                investigation_log.append(f"REMEDIATION: File system reverted to safe snapshot -> {result}")
                remediation_performed = True
                
            # 3. Rogue Account / Credential Purging
            if "persistence" in incident_title or "backdoor" in event_type:
                investigation_log.append("REMEDIATION: Detected unauthorized persistence mechanisms.")
                
                # Example: Hacker created user 'haxor'. We delete the user and their home directory.
                suspect_user = state.get("event_data", {}).get("suspect_user", "unknown_rogue_user")
                if suspect_user != "unknown_rogue_user":
                    cmd = ["sudo", "userdel", "-f", suspect_user]
                    result = self._execute_recovery(cmd)
                    investigation_log.append(f"REMEDIATION: Purged rogue back-door account ({suspect_user}) -> {result}")
                    remediation_performed = True

            if not remediation_performed:
                investigation_log.append("REMEDIATION: No critical system corruption vectors identified. Operating system appears stable.")

            state["investigation_log"] = investigation_log
            state["current_step"] = "explanation"
            
            return state
            
        except Exception as e:
            logger.error(f"Remediation error: {e}")
            state["investigation_log"].append(f"REMEDIATION ERROR: {str(e)}")
            return state
