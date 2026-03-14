from typing import List, Optional
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    Application settings loaded from environment variables.
    """
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    PROJECT_NAME: str = "Sentry: Multi-Agent Cybersecurity Defense Platform"
    API_V1_STR: str = "/api/v1"

    # Security
    SECRET_KEY: str = "supersecretkeychangeinproduction"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # Database
    DATABASE_URL: str = "sqlite:///./sentry_db.sqlite"

    # Redis (Messaging & Caching)
    REDIS_URL: str = "redis://localhost:6379/0"

    # CORS
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:8000",
    ]

    # ── LLM: Groq (high-performance inference) ─────────────────────────────
    # Sign up at https://console.groq.com to get a free API key.
    GROQ_API_KEY: Optional[str] = None
    GROQ_MODEL: str = "llama-3.3-70b-versatile"

    # ── Embeddings: HuggingFace sentence-transformers (runs 100% locally) ──
    # No API key required.  The model is downloaded from the HuggingFace Hub
    # on first use and cached in ~/.cache/huggingface.
    # Supported values (384-dim): "sentence-transformers/all-MiniLM-L6-v2"  ← default
    # Supported values (768-dim): "sentence-transformers/all-mpnet-base-v2"
    # If you change the model make sure its output dimension matches the
    # VECTOR(N) column in your Supabase DDL (see vector_memory.py).
    HF_EMBEDDING_MODEL: str = "sentence-transformers/all-MiniLM-L6-v2"
    # Dimensions produced by the chosen HF model (384 for MiniLM, 768 for mpnet).
    HF_EMBEDDING_DIM: int = 384

    # ── Supabase (pgvector incident memory) ────────────────────────────────
    # Required for InvestigationAgent vector recall.
    # See app/services/vector_memory.py for the one-time DDL to run in Supabase.
    SUPABASE_URL: Optional[str] = None
    SUPABASE_KEY: Optional[str] = None


settings = Settings()
