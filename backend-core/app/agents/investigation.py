from typing import Dict, Any
import logging
from app.agents.state import AgentState
from app.core.llm import get_llm
from langchain_core.messages import SystemMessage, HumanMessage

logger = logging.getLogger(__name__)

class InvestigationAgent:
    """
    Queries logs and builds evidence for detected incidents.
    """
    def __init__(self):
        self.llm = get_llm()

    async def investigate(self, state: Dict) -> Dict:
        try:
            investigation_log = state.get("investigation_log", [])
            incident = state.get("incident")
            
            if not incident:
                logger.info("No incident to investigate. Skipping.")
                state["current_step"] = "end"
                return state
                
            investigation_log.append("INVESTIGATING: Analyzing historical patterns for IP " + incident.get("attacker_ip", "unknown"))
            
            attacker_ip = incident.get("attacker_ip")
            
            # Use LLM for "Intel" if available
            if self.llm:
                try:
                    prompt = f"Analyze the following IP address in the context of a cybersecurity incident: {attacker_ip}. Is this a private IP or public? Be concise."
                    messages = [
                        SystemMessage(content="You are a simplified Threat Intelligence Analyst."),
                        HumanMessage(content=prompt)
                    ]
                    response = await self.llm.ainvoke(messages)
                    investigation_log.append(f"AI ANALYST: {response.content}")
                except Exception as e:
                    logger.error(f"LLM Error: {e}")
                    investigation_log.append("AI ANALYST: Offline (Check API Key)")
            
            # Mock reasoning: checking "Threat Intelligence"
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
