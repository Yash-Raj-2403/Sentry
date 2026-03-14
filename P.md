# Multi-Agent Cybersecurity Defense Platform

You are a principal-level cybersecurity systems architect, AI agent orchestration expert, and full-stack SaaS platform engineer.

Your task is to design and implement a complete, working MVP product called: **Multi-Agent Cybersecurity Defense Platform**.

This system must simulate a next-generation autonomous Security Operations Center (SOC) using collaborative AI agents. The platform must be fully demoable locally and structured so that it can evolve into a real SaaS cybersecurity product.

---

## Detailed Problem Statement

Organizations today face increasingly sophisticated cyber threats including reconnaissance scans, brute-force attempts, lateral movement, and unauthorized access attempts.

Traditional security monitoring systems generate large volumes of alerts but lack contextual reasoning, coordinated automation, and real-time decision-making capabilities.

**Security analysts often struggle with:**
* Alert fatigue due to excessive false positives.
* Slow investigation workflows requiring manual log correlation.
* Delayed response actions leading to increased attack impact.
* Fragmented tools that do not share intelligence effectively.
* Limited ability to explain incidents clearly to stakeholders.
* Shortage of skilled cybersecurity personnel.

**The Goal:**
Design a collaborative multi-agent AI framework capable of autonomously:
* **Active Prevention:** Stopping attacks at the gate (e.g., dynamically adjusting firewall rules via iptables/UFW or applying edge rate-limits for bot attacks).
* **Monitoring & Detection:** Observing network/system activity, identifying anomalies, and bypassing LLM latency for massive volumetric attacks using edge-side dumb filters.
* **Contextual Investigation:** Investigating incidents using reasoning and semantic memory (pgvector).
* **Decision Making:** Calculating risk scores based on dynamic policies.
* **Post-Penetration Containment:** Automatically executing micro-segmentation (network severing) or process assassination if a system is breached.
* **Automated Recovery:** Rolling back configurations to known-good states and utilizing file system snapshots (ZFS/Btrfs) to heal ransomware damage.
* **Reporting & Explanation:** Generating human-readable SOC reports mapping to MITRE ATT&CK.
* **Human-in-the-Loop (HITL):** Enforcing manual approvals for destructive mitigations.

The system must continuously improve detection accuracy by learning from historical incidents and evolving threat patterns.

---

## High-Level System Architecture

`Monitored Host Logs` → `Sensor Agent` → `Backend Event Ingestion API` → `Event Queue`

**AI Agent Pipeline:**
1. Detection Agent (With Edge-Side Rate Limiter Bypass for Bots)
2. Investigation Agent (With Vector Memory Integration)
3. Decision Agent
4. Response & Containment Agent
5. Remediation Agent (Recovery & Healing)
6. Explanation Agent

Incident state updates must be stored in a database and broadcast via WebSocket to:
* **SOC Dashboard Website**

---

## Strict Technology Stack

### Backend
* **Language:** Python
* **API Framework:** FastAPI
* **Messaging:** Redis PubSub or Streams
* **Database:** PostgreSQL or SQLite (MVP)
* **Agent Orchestration:** Async orchestration (LangGraph or custom)
* **Containerization:** Docker

### Dashboard Frontend
* **Framework:** React (Vite or Next.js)
* **Styling:** Tailwind CSS
* **Visualization:** Charts library
* **Real-time:** WebSocket client

### Sensor Agent
* **Implementation:** Python lightweight daemon
* **Functions:** Log file tailing, structured event generation
* **Security:** Secure HTTPS transmission

---

## Project Root Structure

```text
multi-agent-cyber-defense/
├── sensor-agent/
├── backend-core/
├── dashboard-frontend/
├── infra/
└── docs/
```

---

## Clear Work Division for Two Developers

### Developer A — Backend + AI + Sensor + Infrastructure Owner

**Owns:**

* **`sensor-agent/`**
  * Log collectors (syslog, network logs)
  * Event parser and event builder
  * Batching and retry queue
  * Secure event transmission module

* **`backend-core/`**
  * Detection agent implementation (handling edge filters for volumetric bot attacks)
  * Investigation reasoning agent (with pgvector RAG memory)
  * Decision and risk-scoring engine
  * Automated response & containment execution layer (iptables, netcat kills, micro-segmentation)
  * Remediation & healing agent (config rollbacks, ZFS snapshot triggers)
  * Explanation agent SOC report generator
  * Agent orchestration state machine
  * Redis streaming pipeline
  * WebSocket broadcasting service
  * Database models and repositories
  * Authentication and organization-scoped APIs
  * Incident management APIs
  * Copilot query API

* **`infra/`**
  * Docker Compose orchestration
  * Attacker container setup (nmap simulation)
  * Victim container setup (service exposure)
  * Sensor container integration
  * Environment configuration and networking

### Developer B — Frontend + UX + Documentation Owner

**Owns:**

* **`dashboard-frontend/`**
  * Real-time SOC dashboard layout
  * Live alert feed component
  * Incident table and filtering UI
  * Incident detail investigation timeline
  * Agent reasoning visualization panel
  * Response action log viewer
  * Risk score charts
  * Network topology visualization graph
  * AI Copilot chat interface
  * WebSocket client integration
  * API service layer
  * Global state management

* **`docs/`**
  * Architecture diagrams
  * UI flow documentation
  * Demo execution script
  * Setup instructions
  * Feature explanation notes

---

## Backend Functional Requirements

### Detection Agent
* Detect burst connection patterns.
* Detect sequential port scanning.
* Compute anomaly score between `0` and `1`.

### Investigation Agent
* Query recent related logs.
* Build evidence list.
* Generate reasoning step sequence.

### Decision Agent
* **Formula:** `risk_score = anomaly_score × attack_velocity × asset_criticality`
* Choose action: monitor, rate limit, block IP, isolate host.

### Response & Containment Agent
* **Active Prevention:** Execute direct firewall commands (e.g., `iptables -A INPUT -s [IP] -j DROP`).
* **Post-Penetration Containment:** Perform micro-segmentation by severing network interfaces (e.g., `ip link set eth0 down`) excluding the Admin tunnel.
* **Process Assassination:** Kill persistent back-door processes (e.g., `kill -9 <PID>`).
* Verify execution success and handle Human-in-the-Loop constraints for high-risk actions.
* Store response logs.

### Remediation Agent
* **Configuration Healing:** Roll back critical poisoned files (e.g., `/etc/shadow`) to known-good encrypted snapshots.
* **Ransomware Recovery:** Trigger file system snapshot restorations (ZFS/Btrfs) to undo file encryption damages automatically.

### Explanation Agent
* Generate SOC-style incident report.
* Map attack to MITRE ATT&CK technique.
* Provide remediation suggestions.

---

## Database Tables

* `organizations`
* `users`
* `incidents`
* `investigation_steps`
* `response_actions`

---

## Dashboard Features

* Live incident streaming feed
* Incident severity badges
* Risk score trend visualization
* Incident investigation timeline
* Agent reasoning transparency panel
* Response action logs
* Copilot chat interface
* Network attack topology visualization

---

## Mandatory Demo Scenario

1. Start full system using Docker Compose.
2. Launch dashboard website.
3. Trigger port scan using attacker container.
4. Detection alert generated.
5. Investigation reasoning steps displayed.
6. Risk score escalates.
7. Firewall rule automatically applied.
8. Copilot explains attack classification.

---

## Deliverables

* Complete working pipeline
* Clean modular folder structure
* Docker deployment configuration
* API documentation
* Architecture diagram
* Demo video instructions
* README setup guide

> **Note:** Focus on end-to-end functionality, real-time visibility, and modular scalability. Avoid unnecessary ML complexity in the MVP.
