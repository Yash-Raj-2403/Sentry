from typing import List, Optional
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    """
    Application settings loaded from environment variables.
    """
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

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
    BACKEND_CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:5173", "http://localhost:8000"]
    
    # OpenAI (Create a .env file with OPENAI_API_KEY)
    OPENAI_API_KEY: Optional[str] = None
    OPENAI_MODEL: str = "gpt-4-turbo-preview"

    # Groq (High-performance inference)
    GROQ_API_KEY: Optional[str] = None
    GROQ_MODEL: str = "mixtral-8x7b-32768"

    # Supabase (External DB & Auth if used)
    SUPABASE_URL: Optional[str] = None
    SUPABASE_KEY: Optional[str] = None

settings = Settings()

settings = Settings()
