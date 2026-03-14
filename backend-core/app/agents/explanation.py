from typing import Dict, Any
import logging
from app.agents.state import AgentState
from app.core.llm import get_llm
from langchain_core.messages import SystemMessage, HumanMessage

logger = logging.getLogger(__name__)

class ExplanationAgent:
    """
    Generates SOC report and explanation of incident.
    """
    def __init__(self):
        self.llm = get_llm()

    async def explain(self, state: Dict) -> Dict:
        try:
            investigation_log = state.get("investigation_log", [])
            incident = state.get("incident")
            
            if not incident:
                return state
                
            if self.llm:
                prompt = f"""
                You are a senior SOC analyst. Generate a concise incident report for the following event stream:
                {investigation_log}
                
                Requirements:
                1. Classify the attack type.
                2. Map to MITRE ATT&CK Technique ID (e.g. T1046).
                3. Provide 2-3 specific remediation steps.
                4. Format as Markdown.
                """
                
                try:
                    response = await self.llm.ainvoke([
                        SystemMessage(content="You generate professional cybersecurity incident reports."),
                        HumanMessage(content=prompt)
                    ])
                    report = response.content
                except Exception as e:
                    logger.error(f"LLM Generation Error: {e}")
                    report = "Error generating AI report. Please review logs manually."
            else:
                report = "AI Module Offline. Manual investigation required."
                
            # Append report to log for persistent storage
            investigation_log.append(f"SOC REPORT:\n{report}")
            state["investigation_log"] = investigation_log
            
            # Store final report in incident object if needed by frontend
            if state.get("incident"):
                state["incident"]["description"] = report[:500] + "..." # Truncate for summary

            return state
        except Exception as e:
            logger.error(f"Explanation error: {e}")
            return state
            
        except Exception as e:
            logger.error(f"Explanation error: {e}")
            return state
