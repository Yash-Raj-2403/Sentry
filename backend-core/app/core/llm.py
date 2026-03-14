from typing import Optional
from langchain_openai import ChatOpenAI
from langchain_groq import ChatGroq
from app.core.config import Settings
import logging

logger = logging.getLogger(__name__)

settings = Settings()

def get_llm():
    """
    Factory function to return the configured LLM instance.
    Prioritizes Groq if configured, then OpenAI.
    """
    if settings.GROQ_API_KEY:
        logger.info(f"Using Groq LLM with model {settings.GROQ_MODEL}")
        return ChatGroq(
            api_key=settings.GROQ_API_KEY,
            model_name=settings.GROQ_MODEL,
            temperature=0
        )
    
    if settings.OPENAI_API_KEY:
        logger.info(f"Using OpenAI LLM with model {settings.OPENAI_MODEL}")
        return ChatOpenAI(
            api_key=settings.OPENAI_API_KEY,
            model=settings.OPENAI_MODEL,
            temperature=0
        )
    
    logger.warning("No LLM API keys found (Groq or OpenAI). Agents will fail if they try to invoke LLM.")
    return None
