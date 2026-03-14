from typing import Optional
from supabase import create_client, Client
from app.core.config import settings

def get_supabase_client() -> Optional[Client]:
    """
    Returns an authenticated Supabase client if configured.
    """
    if settings.SUPABASE_URL and settings.SUPABASE_KEY:
        try:
            return create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
        except Exception as e:
            print(f"Failed to initialize Supabase client: {e}")
            return None
    return None
