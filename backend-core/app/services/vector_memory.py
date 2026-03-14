"""
VectorMemoryService: Stores and retrieves incident embeddings via Supabase pgvector.

Embedding provider:  HuggingFace sentence-transformers (local, no API key needed)
  Default model:     sentence-transformers/all-MiniLM-L6-v2   → 384-dim vectors
  Alternative:       sentence-transformers/all-mpnet-base-v2  → 768-dim vectors
  Model is cached in ~/.cache/huggingface after the first download.

Vector DB:  Supabase pgvector
Chat LLM:   Groq (configured separately in llm.py)

─────────────────────────────────────────────────────────────────────────────
Supabase one-time DDL  (run once in your Supabase SQL Editor)
─────────────────────────────────────────────────────────────────────────────

  -- 1. Enable the pgvector extension
  CREATE EXTENSION IF NOT EXISTS vector;

  -- 2. Create the embeddings table
  --    VECTOR(384) matches all-MiniLM-L6-v2.
  --    Change to VECTOR(768) if you switch to all-mpnet-base-v2.
  CREATE TABLE IF NOT EXISTS incident_embeddings (
      id                    BIGSERIAL PRIMARY KEY,
      incident_id           INTEGER NOT NULL,
      title                 TEXT,
      attacker_ip           TEXT,
      severity              TEXT,
      risk_score            FLOAT,
      investigation_summary TEXT,
      embedding             VECTOR(384),
      created_at            TIMESTAMPTZ DEFAULT NOW()
  );

  -- 3. IVFFlat index for fast approximate nearest-neighbour cosine search
  CREATE INDEX ON incident_embeddings
      USING ivfflat (embedding vector_cosine_ops)
      WITH (lists = 100);

  -- 4. PL/pgSQL RPC helper called by recall_similar_incidents()
  CREATE OR REPLACE FUNCTION match_incident_embeddings(
      query_embedding VECTOR(384),
      match_threshold FLOAT,
      match_count     INT
  )
  RETURNS TABLE (
      incident_id           INTEGER,
      title                 TEXT,
      attacker_ip           TEXT,
      severity              TEXT,
      risk_score            FLOAT,
      investigation_summary TEXT,
      similarity            FLOAT
  )
  LANGUAGE plpgsql
  AS $$
  BEGIN
    RETURN QUERY
    SELECT
      ie.incident_id,
      ie.title,
      ie.attacker_ip,
      ie.severity,
      ie.risk_score,
      ie.investigation_summary,
      1 - (ie.embedding <=> query_embedding) AS similarity
    FROM incident_embeddings ie
    WHERE 1 - (ie.embedding <=> query_embedding) > match_threshold
    ORDER BY ie.embedding <=> query_embedding
    LIMIT match_count;
  END;
  $$;

─────────────────────────────────────────────────────────────────────────────
"""

import asyncio
import logging
from functools import lru_cache
from typing import Dict, Any, List, Optional

from app.core.config import settings

logger = logging.getLogger(__name__)

# ── Tunable constants ─────────────────────────────────────────────────────────
# Dimensionality is read from settings so a single env-var change is enough.
EMBEDDING_DIM: int = settings.HF_EMBEDDING_DIM

# Cosine-similarity threshold to consider a past incident "relevant"
# (range 0–1; higher = stricter match).
SIMILARITY_THRESHOLD: float = 0.70

# Maximum number of past incidents to surface per query.
MAX_RESULTS: int = 5


# ── Embedding model (lazy-loaded singleton) ───────────────────────────────────

@lru_cache(maxsize=1)
def _get_embedder():
    """
    Returns a cached HuggingFaceEmbeddings instance.
    The model is downloaded from the Hub on first call then cached locally.
    Using lru_cache ensures we only load the model weights once per process.
    """
    try:
        from langchain_huggingface import HuggingFaceEmbeddings

        logger.info(
            f"[VectorMemory] Loading HuggingFace embedding model: "
            f"{settings.HF_EMBEDDING_MODEL}"
        )
        embedder = HuggingFaceEmbeddings(
            model_name=settings.HF_EMBEDDING_MODEL,
            model_kwargs={"device": "cpu"},   # use "cuda" if GPU is available
            encode_kwargs={"normalize_embeddings": True},  # cosine-similarity-ready
        )
        logger.info("[VectorMemory] Embedding model loaded successfully.")
        return embedder
    except Exception as e:
        logger.error(f"[VectorMemory] Failed to load HuggingFace embedder: {e}")
        return None


# ── Text builder ─────────────────────────────────────────────────────────────

def _build_incident_text(incident: Dict[str, Any], investigation_log: List[str]) -> str:
    """
    Produces a rich text blob for embedding.
    Combining structured fields + investigation narrative gives far better
    semantic recall than embedding just the title.
    """
    first_ten: List[str] = investigation_log[:10]
    log_summary = " | ".join(first_ten)
    return (
        f"Title: {incident.get('title', 'Unknown')}. "
        f"Attacker IP: {incident.get('attacker_ip', 'Unknown')}. "
        f"Severity: {incident.get('severity', 'Unknown')}. "
        f"Risk Score: {incident.get('risk_score', 0.0):.2f}. "
        f"Investigation: {log_summary}"
    )


# ── Embedding helper ─────────────────────────────────────────────────────────

async def _get_embedding(text: str) -> Optional[List[float]]:
    """
    Generates a sentence embedding using the local HuggingFace model.
    Runs the CPU-bound encode() call in a thread-pool executor so it doesn't
    block the async event loop.

    Returns a list[float] of length HF_EMBEDDING_DIM, or None on failure.
    """
    embedder = _get_embedder()
    if embedder is None:
        logger.warning(
            "[VectorMemory] Embedder not available – vector memory disabled. "
            "Install 'sentence-transformers' and 'langchain-huggingface'."
        )
        return None

    try:
        loop = asyncio.get_event_loop()
        # embed_query is synchronous; run in executor to stay non-blocking
        vector: List[float] = await loop.run_in_executor(
            None, embedder.embed_query, text
        )
        return vector
    except Exception as e:
        logger.error(f"[VectorMemory] Embedding generation failed: {e}")
        return None


# ── Public API ────────────────────────────────────────────────────────────────

async def store_incident_embedding(
    incident: Dict[str, Any],
    investigation_log: List[str],
) -> bool:
    """
    Embeds the incident and upserts it into Supabase `incident_embeddings`.

    Returns True on success, False when:
      • Supabase is not configured (SUPABASE_URL / SUPABASE_KEY missing)
      • Embedding generation failed
      • Supabase upsert raised an exception
    """
    from app.core.supabase import get_supabase_client

    client = get_supabase_client()
    if not client:
        logger.debug(
            "[VectorMemory] Supabase not configured – skipping embedding storage."
        )
        return False

    incident_text = _build_incident_text(incident, investigation_log)
    embedding = await _get_embedding(incident_text)
    if embedding is None:
        return False

    record = {
        "incident_id": incident.get("id"),
        "title": incident.get("title"),
        "attacker_ip": incident.get("attacker_ip"),
        "severity": incident.get("severity"),
        "risk_score": incident.get("risk_score", 0.0),
        "investigation_summary": incident_text,
        "embedding": embedding,   # list[float] → Supabase auto-casts to VECTOR
    }

    try:
        client.table("incident_embeddings").upsert(
            record, on_conflict="incident_id"
        ).execute()
        logger.info(
            f"[VectorMemory] Stored {EMBEDDING_DIM}-dim embedding for "
            f"incident {incident.get('id')} "
            f"(model: {settings.HF_EMBEDDING_MODEL})"
        )
        return True
    except Exception as e:
        logger.error(f"[VectorMemory] Supabase upsert failed: {e}")
        return False


async def recall_similar_incidents(
    query_incident: Dict[str, Any],
    query_log: List[str],
    threshold: float = SIMILARITY_THRESHOLD,
    top_k: int = MAX_RESULTS,
) -> List[Dict[str, Any]]:
    """
    Semantic search: returns the top-k past incidents whose embedding is most
    similar to the current incident, filtered by the cosine-similarity threshold.

    Each result dict contains:
      { incident_id, title, attacker_ip, severity, risk_score,
        investigation_summary, similarity }

    Returns [] if Supabase is not configured, embedding fails, or no incidents
    exceed the threshold.
    """
    from app.core.supabase import get_supabase_client

    client = get_supabase_client()
    if not client:
        logger.debug("[VectorMemory] Supabase not configured – skipping recall.")
        return []

    query_text = _build_incident_text(query_incident, query_log)
    embedding = await _get_embedding(query_text)
    if embedding is None:
        return []

    try:
        response = client.rpc(
            "match_incident_embeddings",
            {
                "query_embedding": embedding,
                "match_threshold": threshold,
                "match_count": top_k,
            },
        ).execute()

        results: List[Dict[str, Any]] = response.data or []
        logger.info(
            f"[VectorMemory] Recalled {len(results)} similar incident(s) "
            f"(threshold={threshold}, top_k={top_k})"
        )
        return results
    except Exception as e:
        logger.error(f"[VectorMemory] Similarity search failed: {e}")
        return []
