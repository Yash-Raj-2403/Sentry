"""
LLM Factory: returns the configured Groq chat model.

Groq provides extremely fast inference via their LPU hardware.
Sign up for a free API key at https://console.groq.com.

Embeddings are handled separately by VectorMemoryService using the local
HuggingFace sentence-transformers model (no API key required).
"""

import logging
from app.core.config import settings

logger = logging.getLogger(__name__)


def get_llm():
    """
    Returns a ChatGroq instance if GROQ_API_KEY is set, otherwise None.
    Agents that require an LLM will log a warning and skip LLM steps gracefully.
    """
    if settings.GROQ_API_KEY:
        from langchain_groq import ChatGroq

        logger.info(f"[LLM] Using Groq · model={settings.GROQ_MODEL}")
        return ChatGroq(
            api_key=settings.GROQ_API_KEY,
            model_name=settings.GROQ_MODEL,
            temperature=0,
        )

    logger.warning(
        "[LLM] GROQ_API_KEY not set – LLM-powered agents will run in "
        "offline / fallback mode. Set GROQ_API_KEY in .env to enable."
    )
    return None
