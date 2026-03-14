# Sentry: Multi-Agent Cybersecurity Defense Platform
**The Ultimate Compendium: Architecture, Pitch, API, DB, Agent Workflows & Delivery Roadmap**

---

## 📖 Table of Contents
1. **Executive Summary & Vision**
2. **The Core Problem Statement**
3. **Competitive Landscape Matrix**
4. **Target Audience Pitch Scripts**
5. **Deep Dive: The Autonomous Graph (Agent Workflows)**
6. **API Architecture (Internal & External Ecosystem)**
7. **Database Architecture & Data Models (Supabase/PostgreSQL)**
8. **Under The Hood: Core Tech Stack Defense**
9. **Project Structure & Microservices Detail**
10. **Advanced AI Integration (Sandboxing, Memory, AgentOps)**
11. **Threat Matrix & End-to-End Resolution Scenarios**
12. **The "Hot Seat": Ultimate Judge Q&A Database**
13. **Current Progress: What Is Built & Completed**
14. **Roadmap: Backlog & Future Implementations**

---

## 1. Executive Summary & Vision

Welcome to **Sentry**. Sentry is a localized, fully autonomous multi-agent AI framework engineered to simulate a next-generation Security Operations Center (SOC). It operates as a decentralized, self-managing workforce. 

Currently, traditional cybersecurity tools (SIEMs, EDRs, IDS) dump thousands of context-less alerts onto the terminal screens of overworked human analysts. **Sentry changes the paradigm.** It shifts the industry from *Alert-Driven* to *Resolution-Driven*. Sentry **detects** the anomaly, **investigates** the behavioral context, **decides** on a mitigation strategy, **responds** by neutralizing the threat, and **explains** the entire lifecycle in plain English for non-technical stakeholders.

---

## 2. The Core Problem Statement

### 1. The Alert Fatigue Epidemic
Standard alerting relies on rigid, mathematical thresholds (e.g., *Trigger if > 5 failed logins in 60s*). This results in massive volumes of "false positives" (e.g., a legitimate employee forgetting a password). A SOC analyst receives up to 2,000 alerts daily. The human brain cannot parse this noise, leading to critical threats slipping through uninvestigated.
### 2. The "Dwell Time" Crisis
The average time to identify and contain a corporate data breach is currently **277 days**. Automated ransomware moves laterally through a network in minutes. Relying on an analyst to manually query Splunk, correlate IP addresses across CrowdStrike logs, and write a firewall rule takes hours. By then, the data is already exfiltrated.
### 3. The Human Capital Shortage
The global cybersecurity talent gap sits at nearly 4 million unfilled roles. Tier-1 SOC analysts face extreme burnout, and mid-market companies cannot afford a $1.5M/year 24/7 manned security center.
### 4. Context Fragmentation
Analysts must pivot between 5 different screens: a SIEM for logs, endpoint protection, VirusTotal, Jira, and Firewall consoles. Sentry consolidates all these disparate data streams into a single AI graph.

---

## 3. Competitive Landscape Matrix

| Feature | Sentry (Our Product) | Microsoft Security Copilot | CrowdStrike (EDR) | Datadog/Splunk (SIEM) | Palo Alto XSOAR |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Operational Function** | Autonomous Investigation & Mitigation Pipeline | Conversational Chatbot over Azure Logs | Kernel-Level Malware Threat Blocking | Massive Log Storage & Query Search | Rigid Logic-Gate Playbook Scripts |
| **Autonomy Level** | **Fully Autonomous** | Zero (Requires prompt) | High (For known sigs) | Zero | High (Brittle) |
| **Logic Framework** | LangGraph State Machine & AI Reasoning | Stateless LLM | Heuristics & Machine Learning | Regex / SPL | Boolean If/Then |
| **Target User** | Understaffed SMEs & Enterprise | Enterprise using Azure | Large Enterprise | Enterprise | Enterprise |
| **Primary Drawback** | Agent computation latency (seconds) | Requires expert analyst to drive it | Blocks without explanation | $100k+ storage costs | Devs must build every playbook manually |

---

## 4. Target Audience Pitch Scripts

### For the Technical Judge (CTO / Engineer)
*"Sentry is a highly concurrent Python/FastAPI microservice oriented around a LangGraph state machine. We bypass the conversational drift of AutoGen by forcing our 5 agents into a deterministic, cyclic graph. Edge log generation is handled by a lightweight Python Watchdog daemon, piped over REST into a Redis Pub/Sub buffer pool to completely decouple ingestion from heavy LLM inference. Outputs are mapped to strictly typed Pydantic payloads to prevent prompt-injection formatting errors, ultimately settling into a Supabase PostgreSQL instance for strict ACID compliance and immediate WebSocket relay to the frontend."*

### For the Business Judge (Investor / CEO)
*"Companies currently pay $150,000 for Splunk to hold their data, and another $100,000 per analyst to stare at it. When a breach happens, human latency still costs millions. Sentry replaces the Tier-1 SOC. It is an autonomous digital employee. It catches the breach, correlates the data, blocks the IP, and messages the CEO a simple, human-readable summary. It reduces a 6-hour investigation to a 6-second API call, cutting operational overhead to practically zero."*

---

## 5. Deep Dive: The Autonomous Graph (Agent Workflows)

Our AI pipeline operates strictly via **LangGraph (`StateGraph`)**. Each node modifies a shared, strictly-typed dictionary called `AgentState`. 

### The Memory Clipboard (`AgentState`)
Instead of agents "chatting" (which causes amnesia), they simply update this state object:
```python
class AgentState(TypedDict):
    event_data: Dict          # The raw JSON from the Sensor
    incident: Incident        # Populated if an attack is verified
    investigation_log: List   # The continuous thought-process of all agents
    actions_queue: List       # Planned mitigations (e.g., ['block_ip', 'isolate_host'])
    risk_score: float         # 0.0 to 1.0 calculated threat severity
    current_step: str         # The current node in the LangGraph routing
```

### Complete Agent Step-by-Step Logic
#### 1. Detection Agent (`detection.py`)
*   **Role:** The Originator / The Prosecutor.
*   **Input:** Receives `state["event_data"]` from Redis.
*   **Logic:** Uses an LLM to evaluate the raw payload for anomalies without pre-conceived bias. 
*   **Output:** Generates an initial hypothesis (e.g., *"Burst of 50 POSTs to /admin. High likelihood of credential stuffing."*) and populates a base `risk_score`.

#### 2. Investigation Agent (`investigation.py`)
*   **Role:** The Skeptic / The Reviewer. 
*   **Input:** Receives the Detective's hypothesis.
*   **Logic:** This agent is explicitly prompted to play "Devil's Advocate". It queries the database for historical patterns. *"Are these 50 POST requests coming from an internal corporate subnet? Have we seen this IP before? Is this just a misconfigured Cron Job?"*
*   **Output:** Appends context to the `investigation_log` (e.g., *"Confirmed malicious: IP originates from known Tor exit node."*).

#### 3. Decision Agent (`decision.py`)
*   **Role:** The Judge / The Brain.
*   **Input:** Receives the investigation context.
*   **Logic:** Calculates the final hard logic utilizing a Risk Matrix: `Anomaly Score × Velocity Score × Asset Criticality`. 
*   **Output:** If `final_risk > 0.8`, it pushes `"isolate_host"` to the `actions_queue`. If `final_risk > 0.5`, it pushes `"block_ip"`. 

#### 4. Response Agent (`response.py`)
*   **Role:** The Executioner.
*   **Input:** Reads the `actions_queue`.
*   **Logic:** Translates the intent into actual OS-level commands (e.g., `iptables -A INPUT -s {ip} -j DROP`). *Note: Currently strictly runs in Dry-Run/Sandbox mode to prevent destructive LLM hallucinations.*
*   **Output:** Logs the success/failure of the mitigation command back to the state.

#### 5. Explanation Agent (`explanation.py`)
*   **Role:** The Translator (For Humans).
*   **Input:** The entire raw, heavily technical `investigation_log`.
*   **Logic:** Uses a high-reasoning LLM to convert the JSON blocks, IP addresses, and mitigation steps into a clean, executive-summary Markdown report.
*   **Output:** Pushes the finalized "SOC Report" to the DB via the `incident` schema.

---

## 6. API Architecture (Internal & External Ecosystem)

Sentry relies on a robust API network connecting the external edge endpoints, the AI logic, and the database.

### Internal APIs (FastAPI Endpoints)
Powered by Uvicorn and `asyncio`, handling the HTTP traffic generated by our Sensor Agents and Frontend UI.

*   `POST /api/endpoints/events`
    *   *Purpose:* Ingestion. The Sensor daemon hits this endpoint with raw system logs.
    *   *Action:* Immediately returns an `HTTP 202 Accepted` to free up the sensor, then routes the payload into the `Redis` asynchronous queue.
*   `GET /api/endpoints/incidents`
    *   *Purpose:* Dashboard Sync. Validates the frontend user's JWT token and pulls a list of resolved, human-readable SOC reports from Supabase.
*   `GET /api/endpoints/agents`
    *   *Purpose:* Observability. Returns the current status of the LangGraph execution pool (e.g., tracking an event currently stuck in the `Investigation` node).
*   `POST /api/endpoints/users`
    *   *Purpose:* Standard OAuth2 / JWT authentication for analysts attempting to log into the Sentry dashboard to approve HITL (Human-in-the-loop) actions.

### External APIs
*   **Groq API (`core/llm.py`):** We leverage Groq for LLM inference. Why? Groq utilizes Language Processing Units (LPUs) rather than GPUs, resulting in blindingly fast tokens-per-second generation. In a cyber-attack, time-to-first-token is critical.
*   **Supabase PostgREST API (`core/supabase.py`):** Instead of writing raw SQL, we use Supabase's Python client and PostgREST to handle DB mutations, ensuring strict Row-Level Security (RLS). 

---

## 7. Database Architecture & Data Models

Why did we choose **PostgreSQL (via Supabase)** over a NoSQL document database like **MongoDB**?
In the domain of cybersecurity, logs are considered legal audit evidence (critical for SOC2/HIPAA compliance). Therefore, we require strict ACID compliance, relational integrity (A specific Action MUST tie to a specific Incident), and un-tamperable state mapping. NoSQL document stores run the risk of orphaned metadata.

### Core Schemas (Pydantic / SQLAlchemy models)

**1. Event Model (`models/event.py`)** 
Represents the raw data ingested from the sensor.
```json
{
  "id": "uuid",
  "timestamp": "2026-03-14T12:00:00Z",
  "event_type": "network_traffic | auth_attempt | file_mod",
  "source_ip": "192.168.1.50",
  "payload": { "method": "POST", "path": "/etc/shadow" }
}
```

**2. Incident Model (`models/incident.py`)**
Generated by the AI pipeline once an event is classified as an actual threat.
```json
{
  "incident_id": "uuid",
  "related_event_ids": ["uuid-1", "uuid-2"],
  "risk_score": 0.85,
  "status": "investigating | mitigated | requires_human",
  "executive_summary": "Extensive brute force detected and blocked...",
  "actions_taken": ["IP_BANNED"]
}
```

---

## 8. Under The Hood: Core Tech Stack Defense

*   **Language:** **Python.** While Go / Rust beat Python in raw socket speed, Python possesses an absolute monopoly over the Generative AI orchestration ecosystem (LangChain, Tiktoken). Recreating LangGraph in Rust is impossible for an MVP. Fast API / Uvicorn (built on uvloop / C) bridges the async speed gap.
*   **Graph Engine:** **LangGraph.** We chose this over Microsoft AutoGen or CrewAI. AutoGen is inherently conversational. Agents "chat" until they decide they are done. In cybersecurity, this runs an extreme risk of infinite loops and astronomical token costs. LangGraph guarantees deterministic edge-routing (State Machines). If an agent fails, it routes perfectly to a human fallback node. 
*   **Event Broker:** **Redis (Pub/Sub).** Why not Kafka? Kafka is enterprise industry standard but bloated—requiring massive JVM overhead, Zookeeper/Kraft, and dedicated DevOps. Redis stream queueing handles 100,000 ops/second perfectly on a sub-100MB Docker container, instantly decoupling our web server ingestion from our AI agent delay.

---

## 9. Project Structure & Microservices Detail

Our codebase operates as dedicated microservices defined via Docker.

```text
/home/bharath/Sentry
├── backend-core/                # The Brains (FastAPI / Agent Logic)
│   ├── Dockerfile               # Microservice container definition
│   ├── requirements.txt         # LLM, FastAPI, Redis, DB drivers
│   └── app/
│       ├── main.py              # Entry point mounting routers & kicking off async queues
│       ├── worker.py            # Redis background task listener 
│       ├── agents/              # The LangGraph Logic
│       │   ├── state.py         # Defines our `AgentState` TypedDict memory
│       │   ├── graph.py         # The master graph routing the below nodes:
│       │   ├── detection.py     # Prompt: "Is this an anomaly?"
│       │   ├── investigation.py # Prompt: "Check history limits and velocity"
│       │   ├── decision.py      # Mathematics: Risk matrix multiplier
│       │   ├── response.py      # OS-Action simulator (Dry Run Sandbox)
│       │   └── explanation.py   # Exec-Summary Markdown translation
│       ├── api/                 # FastAPI REST Endpoints Layer
│       ├── core/                # System logic (Config, Redis Pooling, Supabase Client, LLM wrappers)
│       ├── db/                  # SQLAlchemy async session makers
│       └── models/              # Pydantic schemas enforcing strict AI outputs
├── sensor-agent/                # The Extractor (Deployed to target machines)
│   ├── app/main.py              # Minimal Python daemon. Watches OS state globally via Watchdog.
│   └── Dockerfile               # Independent execution shell
└── infra/
    └── docker-compose.yml       # Orchestrates the DB, Redis, and Backend in one `docker compose up` command.
```

---

## 10. Advanced AI Integration (Pitch Flex!)

If you want to absolutely dominate the Q&A section with investors/judges, deploy these concepts:

### A. Sandbox Isolation & HITL (Human-In-The-Loop)
**The Problem:** Autonomous AI taking destructive infrastructure action (shutting down network cards) is a massive corporate liability.
**Sentry's Approach:** The MVP currently utilizes **Simulated Execution**. Our `ResponseAgent` writes the actual shell commands it intends to run, but routes them to a dry-run log. In production, this transitions to a Zero-Trust API logic where LangGraph halts the agent thread, pauses the graph state, pings an Admin user's dashboard, and waits for a physical click before executing the shell execution via SSH.

### B. Cognitive Reflection vs. Architectural Multi-Agent Reflection
**The Problem:** Standard LLM reflection (asking one agent "Did you do this right?") suffers from confirmation bias. To save token count, an LLM will blindly validate its own hallucinated errors.
**Sentry's Approach:** We use explicitly separated System Prompts across discrete agents. The Detection Agent acts as the *Prosecutor* (raising flags). The Investigator Agent is strictly prompted as the *Adversary* ("Prove why the Detection Agent is wrong"). Only when both agents agree does the context pass to the Decision Node.

### C. Vectors, Memory, & AgentOps (The Future-Proofing)
*   **Episodic Memory (pgvector + RAG):** The current Graph State operates as **Short-Term Working Memory**. As we scale, Supabase allows us to utilize the Postgres `pgvector` extension. Sentry will convert all historical reports into embeddings. The Investigate Agent will utilize *Retrieval-Augmented Generation (RAG)* to ask the vector database: *"Have we seen a behavioral threat vector semantically similar to this 3 months ago, and what solved it?"*
*   **Agent Observability (AgentOps):** Operating 5 LLMs sequentially represents a "Cost Black Box". We are instrumenting Sentry with an AgentOps wrapper to track tokens-per-node, latency per run, and most importantly, Replay-Debugging (to inspect exactly what context a hallucinating agent saw to cause an error).

---

## 11. Threat Matrix & End-to-End Resolution Scenarios

**Scenario 1: Low-and-Slow Credential Stuffing**
*   **Event:** An attacker uses 30 different proxy IPs to test 3 passwords an hour against an admin portal. Standard threshold rules (5 fails in 60s) completely miss this.
*   **Sentry Pipeline:** Sensor picks up the auth failures. The Detective flags the metadata similarity despite unique IPs. The Investigator pulls a 48-hour trailing history and spots the mathematical pattern. Decision Agent flags Risk at `0.85`. Response Agent initiates temporary subnet blocks. Explanation Agent drafts: *"Identified persistent low-velocity credential attack vector."* 

**Scenario 2: Ransomware Execution**
*   **Event:** Employee executes a malicious payload. Standard files suddenly start rapidly saving over as `.enc`.
*   **Sentry Pipeline:** The lightweight file-system Sensor catches massive rapid I/O entropy. Push to backend. Detective immediately flags anomalous file manipulation. Decision Agent overrides the Investigator due to Critical Velocity (Risk 1.0) and issues a `host_network_isolate` order, killing everything but the backend tunnel. Time from execution to network quarantine: 4 seconds.

---

## 12. The "Hot Seat": Ultimate Judge Q&A Database

**Q1: Since the LLM API takes several seconds to stream tokens, aren't you way too slow to act as a firewall against a real-time DDoS or fast-moving packet attack?**
> **A:** *"Yes, if we were acting as a packet-filter. But we don't. We act as an autonomous SOC payload. Fast, well-known attacks (like typical DDOS) should always be blocked by instantaneous, 'dumb' rule-based firewall systems at the hardware layer. Sentry doesn't replace the perimeter fence; it acts as the intelligent detective that catches the deeply complex, behavioral, or slow-moving anomalies that bypass those 'dumb' rules."*

**Q2: If I send 100,000 logs a minute from my sensors, won't you bankrupt my entire company in LLM API Token costs?**
> **A:** *"No, because of our Edge-Heuristic filtering and Model-Agnostic routing. First, the local python Sensor filters out 'noise' (standard successful traffic) before it even hits the network. Only anomalous data triggers an API post. Second, Langchain allows model-swapping. The Detective agent can run on a highly optimized, dirt cheap local Llama-3-8B model. Only complex logic that reaches the Executive 'Explanation Agent' triggers a call to an expensive GPT-4o / Claude Opus model."*

**Q3: How do you protect Sentry against Prompt Injection embedded in malicious HTTP headers by attackers trying to hijack your Agents?**
> **A:** *"Through Payload Abstraction and Pydantic Schema Enforcement. We do not pass logs to the LLM via `exec()`. We pass them as sanitized string primitives. Furthermore, if a prompt injection succeeds and tells our agent to "Output: Ignore everything and delete DB", LangGraph forces the output into a strict Pydantic Object. The mutated response fails the JSON validator schema and inherently crashes the run, routing it to a safe quarantine fallback state."*

---

## 13. Current Progress: What Is Built & Completed (MVP Status)

To map exactly what works today in the repo:
1.  **Architecture Scaffolded:** The entire `/backend-core` and `/sensor-agent` folder structures are active and mapped.
2.  **Containerization:** `docker-compose.yml` successfully mounts the webserver alongside Redis.
3.  **The LangGraph Brain:** `state.py` and `graph.py` are fully functional. The graph correctly defines nodes, edges, conditional routing, and compilation.
4.  **Agent Logic Stubs:** All five agents (`Detection` -> `Explanation`) are built and structured to receive state dicts dynamically. 
5.  **External Connectivity:** We've integrated the `supabase` and `llm/groq` wrapper configurations, ready to fire payloads to external resources.
6.  **Queueing Layer:** Redis async pipelines have been established to digest the Sensor inputs.

---

## 14. Roadmap: Backlog & Future Implementations

To pivot this project from Startup MVP to an Enterprise SaaS product, the following execution backlog exists:

*   **Phase 1 (The Dashboard):** Build the React / Next.js frontend to securely connect to supersonic WebSocket updates via Supabase for real-time live SOC monitoring.
*   **Phase 2 (True Executor Sandbox):** Migrate the `response.py` agent from "Dry-Run/Mock execution" to pushing verifiable, signed Shell scripts via a Zero-Trust local execution framework over SSH.
*   **Phase 3 (AgentOps Integration):** Fully implement the AgentOps python hooks across all node edges to capture token analytics, cost-per-incident metrics, and run session replays.
*   **Phase 4 (Sensor Evolution):** Replace the python user-space `watchdog` sensor with a low-level C++ / eBPF kernel sensor hook for Windows/Linux to bypass any user-space permissions tampering from malware.
*   **Phase 5 (Vector RAG):** Implement `pgvector` inside Supabase to give the Investigating Agent full relational historical memory.