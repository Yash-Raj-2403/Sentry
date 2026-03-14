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
* Monitoring network and system activity.
* Detecting anomalies and suspicious behavior patterns.
* Investigating incidents using contextual reasoning.
* Calculating risk scores based on dynamic policies.
* Automatically executing containment or mitigation actions.
* Explaining cyber incidents in human-readable SOC reports.
* Streaming incident intelligence in real-time to analysts.
* Supporting human-in-the-loop override mechanisms.

The system must continuously improve detection accuracy by learning from historical incidents and evolving threat patterns.

---

## High-Level System Architecture

`Monitored Host Logs` → `Sensor Agent` → `Backend Event Ingestion API` → `Event Queue`

**AI Agent Pipeline:**
1. Detection Agent
2. Investigation Agent
3. Decision Agent
4. Response Agent
5. Explanation Agent

Incident state updates must be stored in a database and broadcast via WebSocket to:
* **SOC Dashboard Website**
* **Browser Security Copilot Extension**

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

### Browser Extension
* **Standard:** Chrome Manifest V3
* **UI:** React Popup UI
* **Real-time:** Background WebSocket listener

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
├── browser-extension/
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
  * Detection agent implementation
  * Investigation reasoning agent
  * Decision and risk-scoring engine
  * Automated response execution layer
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

### Developer B — Frontend + Extension + UX + Documentation Owner

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

* **`browser-extension/`**
  * Manifest configuration
  * Popup UI layout
  * Threat severity badge state logic
  * Background persistent socket listener
  * Incident summary cards
  * Mini Copilot chat interface
  * Manual response action buttons
  * Deep link navigation to dashboard

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

### Response Agent
* Execute firewall block command.
* Optionally simulate host isolation.
* Verify execution success.
* Store response logs.

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

## Extension Features

* Dynamic badge color based on threat severity
* Popup showing latest incident summary
* Mini AI chat to query incident context
* Manual response control buttons
* Open dashboard deep link

---

## Mandatory Demo Scenario

1. Start full system using Docker Compose.
2. Launch dashboard website.
3. Trigger port scan using attacker container.
4. Detection alert generated.
5. Investigation reasoning steps displayed.
6. Risk score escalates.
7. Firewall rule automatically applied.
8. Extension notification appears.
9. Copilot explains attack classification.

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
