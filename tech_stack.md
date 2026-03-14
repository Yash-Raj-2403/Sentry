# Sentry Platform: Technology Stack & Engineering Choices

This document outlines the core technologies powering Sentry, explaining **why** each tool was chosen to withstand the rigorous demands of an active Autonomous Security Operations Center (SOAR) processing live cyber threats.

---

## 1. Core Backend AI & Orchestration

### Python (The Foundation)
**Why:** While Rust or Go are faster for raw packet processing, Python holds absolute dominance over the AI and Machine Learning orchestration ecosystem (LangChain, OpenAI SDKs, PyTorch). Because Sentry relies heavily on Agentic reasoning over raw mathematical packet drops, Python ensures rapid integration with cutting-edge LLMs.

### LangGraph (State Machine Orchestration)
**Why:** Unlike Microsoft AutoGen or CrewAI (which are inherently conversational and prone to infinite chat loops), LangGraph operates as a **deterministic State Machine**. In cybersecurity, if an agent fails, the system cannot hang in a conversational debate; it must follow strict routing (e.g., fallback to quarantine). LangGraph strictly pipes the `AgentState` via cyclic nodes ensuring strict operational flow: `Detection -> Investigation -> Decision -> Response & Containment -> Remediation -> Explanation`.

### FastAPI / Uvicorn (The API Gateway)
**Why:** Provides hyper-fast, asynchronous REST API boundaries. The use of ASGI handles the concurrent IO connection strain of thousands of Sensor pings simultaneously. Crucially, FastAPI integrates seamlessly with Pydantic for rigid runtime data validation (vital for stopping Prompt Injection attacks from entering the payload).

---

## 2. Ingestion & Messaging Queue

### Redis Streams / PubSub
**Why:** Sentry operates in a fundamentally unbalanced IO state: bots / network pings generate millions of logs per second, but an LLM takes 2-4 seconds to generate a response. 
Using Redis sets a buffer. The `FastAPI` instance absorbs the web traffic and instantly dumps the payload into a Redis Stream queue. This "decouples" ingestion from inference. Redis is significantly lighter than Kafka (which requires Zookeeper and heavy JVM overhead), making it perfect for a localized MVP.

---

## 3. Storage & Contextual Memory

### Supabase / PostgreSQL (The Source of Truth)
**Why:** Cybersecurity requires strict audit trails and relational integrity (SOC2 compliance). NoSQL document stores (MongoDB) risk orphaned data mutations. PostgreSQL guarantees true ACID compliance. Supabase provides an auto-scaling managed solution with built-in instant over-the-wire updates.

### pgvector (Vector Database / RAG)
**Why:** Short-term memory (what is happening right now) lives in the LangGraph `State`. But to build defense against Advanced Persistent Threats (APTs) over months, Sentry uses **pgvector**. Incident reports are embedded and stored. When a new threat triggers, Sentry executes semantic similarity search (RAG) to instantly recall: *"Has this specific pattern of backdoor execution been seen on this network before?"*

---

## 4. LLM & Inference Engines

### Groq / LPU API (Fast Inference)
**Why:** Speed is critical to blocking a fast-moving actor. Traditional CUDA-based LLM architectures are limited by memory bandwidth. Groq's specialized Language Processing Units (LPUs) deliver over 800 tokens-per-second, dropping "time-to-first-thought" to fractions of a second, allowing Sentry to calculate dynamic mitigations almost infinitely faster than standard GPU-hosted models.

### OpenAI GPT-4o / Claude 3.5 (Heavy Reasoning)
**Why:** Used selectively, primarily by the `ExplanationAgent` at the end of the pipeline. High cognitive models are used when the immediate threat is neutralized, and compiling dense forensic logs into a human-readable "Executive Summary" is required.

---

## 5. Edge Intelligence & Agent Environment

### Python Watchdog / eBPF (The Sensor Agent)
**Why Watchdog (MVP):** Lightweight, user-space daemon to parse auth logs, file modifications, and generic system networking on Linux environments.
**Why eBPF (Production):** A hacker with root privileges will just run `killall python` to blind Sentry. Transitioning the Sensor to an *Extended Berkeley Packet Filter (eBPF)* allows the sensor to run cleanly inside the Linux Kernel isolated from user-space tampering.

### Sandboxed OS Execution (Response/Containment Layer)
**Why:** Autonomous systems modifying infrastructure are inherently dangerous. Actions are passed via strict formatted shells (`ip link set eth0 down` or `iptables -A INPUT -j DROP`) via parameterized string inputs. Sentry blocks LLM native execution to prevent simulated injection attacks from hijacking the execution agent.

---

## 6. Infrastructure & Deployment

### Docker & Docker Compose
**Why:** Creates a fully self-contained deployment. Clients can deploy Sentry entirely on-premise without exposing network architecture to the public web. With a single `docker compose up`, the Redis server, Postgres DB, FastAPI backend, and Sensor Agents spin up natively into an interconnected microservice mesh.

---

## 7. Frontend User Interface

### React.js (Next.js / Vite) & Tailwind CSS
**Why:** Modern, component-based frontend capable of interpreting complex nested JSON architectures (the LangGraph output object).

### WebSockets (Real-Time SOC Observability)
**Why:** The SOC analyst cannot refresh a page constantly to see if an endpoint was comprised. Sentry relies on real-time server-sent events or websockets to push Graph state updates directly to the browser DOM, visualizing the attack timeline as the LLM orchestrates containment.