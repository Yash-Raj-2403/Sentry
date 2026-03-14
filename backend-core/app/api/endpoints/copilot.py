from fastapi import APIRouter
from pydantic import BaseModel
from typing import List

from langchain_core.messages import SystemMessage, HumanMessage, AIMessage
from app.core.llm import get_llm

router = APIRouter()

SYSTEM_PROMPT = (
    "You are CyberHelm Copilot, an expert AI security analyst assistant embedded in "
    "the Sentry SOC platform. Help analysts investigate incidents, understand MITRE "
    "ATT&CK techniques, analyse threats, and suggest remediation steps. "
    "Be concise, technical, and actionable."
)


class ChatMessage(BaseModel):
    role: str   # "user" | "assistant"
    content: str


class ChatRequest(BaseModel):
    message: str
    history: List[ChatMessage] = []


class ChatResponse(BaseModel):
    reply: str


@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    llm = get_llm()
    if llm is None:
        return ChatResponse(
            reply="Groq API key is not configured. Set GROQ_API_KEY in backend-core/.env and restart."
        )

    messages = [SystemMessage(content=SYSTEM_PROMPT)]
    for msg in request.history[-10:]:
        if msg.role == "user":
            messages.append(HumanMessage(content=msg.content))
        elif msg.role == "assistant":
            messages.append(AIMessage(content=msg.content))
    messages.append(HumanMessage(content=request.message))

    response = await llm.ainvoke(messages)
    return ChatResponse(reply=response.content)
