# Sentry: Multi-Agent Cybersecurity Defense Platform

Sentry is a fully autonomous, next-generation Security Operations Center (SOC) simulation. It uses a team of specialized AI agents to **Detect**, **Investigate**, **Respond**, and **Explain** security threats in real-time, replacing the manual grunt work of traditional security analysis.

---

## 🏗️ Tech Stack

*   **Backend:** Python, FastAPI, Uvicorn (High-performance Async API)
*   **Frontend:** React, TypeScript, TailwindCSS (Real-time Dashboard)
*   **Database:** Supabase (PostgreSQL) + pgvector (Vector Search for Memory)
*   **AI/LLM:** LangGraph (State Machine), Groq LPU (Fast Inference)
*   **Messaging:** Redis (Event Streaming & Pub/Sub)
*   **Sensor:** Python Watchdog (Log Monitoring)

---

## 🚀 Setup & Installation

### Prerequisites
*   Python 3.10+
*   Node.js 18+
*   Docker & Docker Compose (Optional, for Redis)
*   Supabase Account & Project
*   Groq API Key

### 1. Configure Environment Variables
Copy `.env.example` to `.env` in both `backend-core/` and `frontend/` and fill in your keys:
*   `SUPABASE_URL` / `VITE_SUPABASE_URL`
*   `SUPABASE_KEY` / `VITE_SUPABASE_ANON_KEY`
*   `GROQ_API_KEY` (Backend only)
*   `REDIS_URL` (Backend only, default `redis://localhost:6379/0`)

### 2. Database Setup
Run the SQL script located at `supabase/schema.sql` in your Supabase SQL Editor to create tables and enable vector extensions.

### 3. Start Infrastructure
Start Redis (if not using an external provider):
```bash
docker run -d -p 6379:6379 redis
```

---

## 🚦 How to Run the System

You need **4 separate terminals** to run the full platform.

### Terminal 1: Backend API
Runs the core FastAPI server to handle API requests and WebSocket connections.
```bash
./scripts/start_backend.sh
```

### Terminal 2: Frontend Dashboard
Launches the React UI to visualize incidents and logs.
```bash
./scripts/start_frontend.sh
```
> Access Dashboard at: `http://localhost:5173`

### Terminal 3: AI Detection Worker
Starts the background worker that listens to Redis, runs LangGraph agents, and orchestrates the defense.
```bash
./scripts/start_worker.sh
```

### Terminal 4: Sensor & Honeypot
Starts the log monitor (Sensor) and the trap services (Honeypot).
```bash
# Start Honeypot (Background) & Sensor
./scripts/start_honeypot.sh &
./scripts/start_sensor.sh
```

---

## ⚔️ Simulating Attacks (Kali Linux / Manual)

### Attack A: Port Scan
**Trigger:** Detection Agent sees connections to >5 unique ports.
```bash
# Run from attacker machine
nmap -p 2222,8081,2121,3389,4455 <SENTRY_IP>
```

### Attack B: Brute Force / Burst Traffic
**Trigger:** Volumetric Filter or Detection Agent sees >20 connections/min.
```bash
# Run from attacker machine (target the fake SSH port 2222)
hydra -l root -P rockyou.txt ssh://<SENTRY_IP>:2222 -t 4
```

### Attack C: Web Exploitation
**Trigger:** Suspicious patterns in HTTP requests.
```bash
# Manual CURL request to fake Web port 8081
curl -X POST http://<SENTRY_IP>:8081/login -d "user=admin&pass=' OR 1=1--"
```

---

## 🧠 Core Features

*   **Autonomous Investigation:** Agents automatically correlate IP addresses, timestamps, and attack patterns without human intervention.
*   **Vector Memory (RAG):** Uses `pgvector` to recall similar past incidents, allowing the AI to learn from history.
*   **Real-time Dashboard:** WebSocket-powered UI updates instantly as the AI "thinks" and acts.
*   **Edge Filtering:** Built-in volumetric filters drop bot spam locally before it even reaches the expensive AI layers.
*   **Honeypot Mode:** Deploys fake services (SSH, FTP, HTTP) to trap and analyze attacker behavior.
