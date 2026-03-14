from typing import Dict, Any, TypedDict
from langgraph.graph import StateGraph, END
import logging

from app.agents.state import AgentState
from app.agents.detection import DetectionAgent
from app.agents.investigation import InvestigationAgent
from app.agents.decision import DecisionAgent
from app.agents.response import ResponseAgent
from app.agents.remediation import RemediationAgent
from app.agents.explanation import ExplanationAgent

logger = logging.getLogger(__name__)

# Initialize Agents
detection_agent = DetectionAgent()
investigation_agent = InvestigationAgent()
decision_agent = DecisionAgent()
response_agent = ResponseAgent()
remediation_agent = RemediationAgent()
explanation_agent = ExplanationAgent()

# Define Node Wrapper Functions (as pure async functions for LangGraph)
# LangGraph expects (state) -> state
async def run_detection(state):
    logger.info(f"Running NODE: Detection on {state.get('event_data', {}).get('event_type')}")
    # The agent class method modifies state in place or returns new state
    # Ensure compatible signature
    return await detection_agent.analyze_event(state)

async def run_investigation(state):
    logger.info("Running NODE: Investigation")
    return await investigation_agent.investigate(state)

async def run_decision(state):
    logger.info("Running NODE: Decision")
    return await decision_agent.decide(state)

async def run_response(state):
    logger.info("Running NODE: Response")
    return await response_agent.execute(state)

async def run_remediation(state):
    logger.info("Running NODE: Remediation")
    return await remediation_agent.remediate(state)

async def run_explanation(state):
    logger.info("Running NODE: Explanation")
    return await explanation_agent.explain(state)

# Define Conditional Logic
def route_after_detection(state):
    logger.info(f"Routing check. Risk: {state.get('risk_score')}, Incident: {state.get('incident')}")
    if state.get("incident"):
        return "investigation"
    logger.info("Routing to END")
    return "end"

def route_after_decision(state):
    if state.get("actions_queue"):
        return "response"
    return "end"


# Define the Graph
workflow = StateGraph(AgentState)

workflow.add_node("detection", run_detection)
workflow.add_node("investigation", run_investigation)
workflow.add_node("decision", run_decision)
workflow.add_node("response", run_response)
workflow.add_node("remediation", run_remediation)
workflow.add_node("explanation", run_explanation)

workflow.set_entry_point("detection")

workflow.add_conditional_edges(
    "detection",
    route_after_detection,
    {
        "investigation": "investigation",
        "end": END
    }
)

workflow.add_edge("investigation", "decision")

workflow.add_conditional_edges(
    "decision",
    route_after_decision,
    {
        "response": "response",
        "end": END
    }
)

workflow.add_edge("response", "remediation")
workflow.add_edge("remediation", "explanation")
workflow.add_edge("explanation", END)

# Compile
app = workflow.compile()
