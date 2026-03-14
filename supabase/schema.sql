-- Enable pgvector extension for incident embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- ── Users ────────────────────────────────────────────────────────────────────
-- Table to store user details (matching app/models/user.py)
CREATE TABLE IF NOT EXISTS "user" (
    id SERIAL PRIMARY KEY,
    email VARCHAR NOT NULL UNIQUE,
    full_name VARCHAR,
    hashed_password VARCHAR NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE INDEX IF NOT EXISTS ix_user_email ON "user" (email);

-- ── Incidents ────────────────────────────────────────────────────────────────
-- Table to store security incidents (matching app/models/incident.py)
CREATE TABLE IF NOT EXISTS incident (
    id SERIAL PRIMARY KEY,
    title VARCHAR NOT NULL,
    severity VARCHAR NOT NULL,
    status VARCHAR DEFAULT 'new',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    description TEXT,
    attacker_ip VARCHAR,
    risk_score FLOAT DEFAULT 0.0,
    feedback VARCHAR
);

CREATE INDEX IF NOT EXISTS ix_incident_title ON incident (title);

-- ── Actions / Steps ──────────────────────────────────────────────────────────
-- Investigation steps taken by agents (matching app/models/actions.py)
CREATE TABLE IF NOT EXISTS investigationstep (
    id SERIAL PRIMARY KEY,
    incident_id INTEGER NOT NULL REFERENCES incident(id) ON DELETE CASCADE,
    step_number INTEGER NOT NULL,
    agent_name VARCHAR NOT NULL,
    action_taken VARCHAR NOT NULL,
    result VARCHAR NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ix_investigationstep_incident_id ON investigationstep (incident_id);

-- Response actions taken (matching app/models/actions.py)
CREATE TABLE IF NOT EXISTS responseaction (
    id SERIAL PRIMARY KEY,
    incident_id INTEGER NOT NULL REFERENCES incident(id) ON DELETE CASCADE,
    action_type VARCHAR NOT NULL,
    target VARCHAR NOT NULL,
    status VARCHAR NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ix_responseaction_incident_id ON responseaction (incident_id);

-- ── Feedback & Weights ───────────────────────────────────────────────────────
-- Decision weights for risk calculation (matching app/models/feedback.py)
CREATE TABLE IF NOT EXISTS decision_weights (
    id SERIAL PRIMARY KEY,
    anomaly_weight FLOAT DEFAULT 1.0,
    velocity_weight FLOAT DEFAULT 1.5,
    criticality_weight FLOAT DEFAULT 1.0,
    false_positive_count INTEGER DEFAULT 0,
    true_positive_count INTEGER DEFAULT 0,
    last_updated TIMESTAMPTZ DEFAULT NOW(),
    updated_by VARCHAR
);

-- Feedback audit log (matching app/models/feedback.py)
CREATE TABLE IF NOT EXISTS feedback_events (
    id SERIAL PRIMARY KEY,
    incident_id INTEGER NOT NULL REFERENCES incident(id) ON DELETE CASCADE,
    feedback_type VARCHAR NOT NULL,
    admin_username VARCHAR NOT NULL,
    notes TEXT,
    incident_risk_score FLOAT DEFAULT 0.0,
    delta_anomaly_weight FLOAT DEFAULT 0.0,
    delta_velocity_weight FLOAT DEFAULT 0.0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ix_feedback_events_incident_id ON feedback_events (incident_id);

-- ── Vector Memory ────────────────────────────────────────────────────────────
-- Table for storing incident embeddings for RAG/Similarity Search
-- Matches 384 dimensions for 'sentence-transformers/all-MiniLM-L6-v2'
CREATE TABLE IF NOT EXISTS incident_embeddings (
    id BIGSERIAL PRIMARY KEY,
    incident_id INTEGER NOT NULL REFERENCES incident(id) ON DELETE CASCADE,
    title TEXT,
    attacker_ip TEXT,
    severity TEXT,
    risk_score FLOAT,
    investigation_summary TEXT, -- Added missing column
    embedding VECTOR(384),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_incident_embeddings_incident_id UNIQUE (incident_id)
);

-- IVFFlat index for fast approximate nearest-neighbour cosine search
-- lists = 100 is a good default for small-medium datasets
CREATE INDEX IF NOT EXISTS ix_incident_embeddings_embedding 
ON incident_embeddings 
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- Function to match similar incidents
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
    investigation_summary TEXT, -- Added missing column
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
        ie.investigation_summary, -- Added missing column
        1 - (ie.embedding <=> query_embedding) AS similarity
    FROM incident_embeddings ie
    WHERE 1 - (ie.embedding <=> query_embedding) > match_threshold
    ORDER BY ie.embedding <=> query_embedding
    LIMIT match_count;
END;
$$;

-- ── Detection State ──────────────────────────────────────────────────────────

-- Table to track connection counts (Burst Traffic)
CREATE TABLE IF NOT EXISTS detection_rate_limit (
    ip_address VARCHAR PRIMARY KEY,
    request_count INTEGER DEFAULT 1,
    first_seen TIMESTAMPTZ DEFAULT NOW(),
    last_seen TIMESTAMPTZ DEFAULT NOW()
);

-- Table to track port scans
-- Stores the list of unique ports scanned by a source->dest pair
CREATE TABLE IF NOT EXISTS detection_port_scans (
    id SERIAL PRIMARY KEY,
    source_ip VARCHAR NOT NULL,
    dest_ip VARCHAR NOT NULL,
    scanned_ports INTEGER[] DEFAULT '{}',
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(source_ip, dest_ip)
);

CREATE INDEX IF NOT EXISTS ix_detection_rate_limit_ip ON detection_rate_limit (ip_address);
CREATE INDEX IF NOT EXISTS ix_detection_port_scans_src_dst ON detection_port_scans (source_ip, dest_ip);
