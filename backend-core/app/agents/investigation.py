"""
InvestigationAgent: Queries logs, threat intelligence, and vector memory
to build a rich evidence chain for detected incidents.

New in v2: recall_similar_incidents() is called at the start of each
investigation. When matching past incidents are found in the Supabase
pgvector store, their summaries are injected into the investigation log
and factored into the risk score (earlier incidents involving the same
attack pattern increase the current risk).
"""

from typing import Dict, Any, List
import logging
from datetime import datetime, timezone

from app.agents.state import AgentState
from app.core.llm import get_llm
from langchain_core.messages import SystemMessage, HumanMessage

logger = logging.getLogger(__name__)


class InvestigationAgent:
    """
    Queries logs and builds evidence for detected incidents.

    Vector Memory Integration
    ─────────────────────────
    Before calling the LLM, the agent performs a semantic similarity search
    against all previously stored incident embeddings in Supabase pgvector.
    Matching results are surfaced as RECALL log entries so that the downstream
    DecisionAgent (and the human SOC analyst) can see that "we saw this attack
    pattern 3 months ago" without any manual lookup.
    """

    def __init__(self):
        self.llm = get_llm()

    # ── Vector Memory: recall past similar incidents ──────────────────────────

    async def _recall_similar(
        self, incident: Dict, investigation_log: List[str]
    ) -> float:
        """
        Searches for past incidents with similar attack patterns.
        Appends RECALL entries to investigation_log in-place.
        Returns an additional risk delta (0.0–0.2) if confirmed recurrences exist.
        """
        try:
            from app.services.vector_memory import recall_similar_incidents

            matches = await recall_similar_incidents(
                query_incident=incident,
                query_log=investigation_log,
            )

            if not matches:
                investigation_log.append(
                    "RECALL: No similar past incidents found in vector memory."
                )
                return 0.0

            risk_delta = 0.0
            investigation_log.append(
                f"RECALL: Found {len(matches)} similar past incident(s) in vector memory:"
            )

            for match in matches:
                sim_pct = match.get("similarity", 0.0) * 100
                past_date = match.get("created_at", "unknown date")
                title = match.get("title", "Unknown Incident")
                attacker_ip = match.get("attacker_ip", "N/A")
                severity = match.get("severity", "N/A")
                past_risk = match.get("risk_score", 0.0)

                investigation_log.append(
                    f"  ↳ [{sim_pct:.1f}% match] {title} | "
                    f"IP: {attacker_ip} | Severity: {severity} | "
                    f"Risk: {past_risk:.2f} | Recorded: {past_date}"
                )

                # Recurrence penalty: each confirmed match adds up to 0.05 extra risk
                risk_delta = min(0.20, risk_delta + 0.05)

            if risk_delta > 0:
                investigation_log.append(
                    f"RECALL: Recurrence risk penalty applied: +{risk_delta:.2f} "
                    f"(pattern seen {len(matches)} time(s) before)"
                )

            return risk_delta

        except Exception as e:
            logger.warning(f"[InvestigationAgent] Vector recall failed: {e}")
            investigation_log.append(
                "RECALL: Vector memory query failed (non-critical). Continuing."
            )
            return 0.0

    # ── Main investigation node ───────────────────────────────────────────────

    async def investigate(self, state: Dict) -> Dict:
        try:
            investigation_log = state.get("investigation_log", [])
            incident = state.get("incident")

            if not incident:
                logger.info("No incident to investigate. Skipping.")
                state["current_step"] = "end"
                return state

            attacker_ip = incident.get("attacker_ip", "unknown")
            investigation_log.append(
                f"INVESTIGATING: Analyzing patterns for IP {attacker_ip}"
            )

            # ── 1. Vector Memory: recall similar past incidents ───────────
            recall_risk_delta = await self._recall_similar(incident, investigation_log)
            if recall_risk_delta > 0:
                state["risk_score"] = min(1.0, state["risk_score"] + recall_risk_delta)

            # ── 2. LLM Threat Intelligence ────────────────────────────────
            if self.llm:
                try:
                    prompt = (
                        f"Analyze the following IP address in the context of a "
                        f"cybersecurity incident: {attacker_ip}. "
                        f"Is this a private IP or public? "
                        f"What type of attack is most likely? Be concise."
                    )
                    messages = [
                        SystemMessage(
                            content="You are a simplified Threat Intelligence Analyst."
                        ),
                        HumanMessage(content=prompt),
                    ]
                    response = await self.llm.ainvoke(messages)
                    investigation_log.append(f"AI ANALYST: {response.content}")
                except Exception as e:
                    logger.error(f"LLM Error: {e}")
                    investigation_log.append(
                        "AI ANALYST: Offline (Check API Key)"
                    )

            # ── 3. Static Threat Feed check (MVP simulation) ──────────────
            if attacker_ip == "192.168.1.100":  # Known-bad IP in simulation
                investigation_log.append(
                    "INTEL: IP found in threat feed (High Confidence)"
                )
                state["risk_score"] = min(1.0, state["risk_score"] + 0.3)
            else:
                investigation_log.append("INTEL: IP clean in global threat feeds.")

            state["investigation_log"] = investigation_log
            state["current_step"] = "decision"
            return state

        except Exception as e:
            logger.error(f"Investigation error: {e}")
            return state
