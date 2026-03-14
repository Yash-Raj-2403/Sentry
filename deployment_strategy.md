# Sentry: SaaS Deployment & User Onboarding Strategy

## 1. Deployment Model: Cloud SaaS with Local Sensor
Sentry is designed using a **Software-as-a-Service (SaaS)** architecture. This ensures a frictionless onboarding process for the user while protecting the core AI logic and database infrastructure.

The system is strictly divided into two operational environments:

### A. Cloud Infrastructure (Hosted by Us)
This is the "Brain" of the platform. The user accesses this exclusively through their web browser.
*   **Frontend Dashboard:** The React/Next.js web application.
*   **Backend Core:** The FastAPI server, LangGraph AI orchestration, and Groq LLM integration.
*   **Data Layer:** PostgreSQL (pgvector) and Redis Pub/Sub.

### B. Endpoint Infrastructure (Downloaded by the User)
This is the "Eyes & Hands" of the platform. The user downloads this to the specific machine(s) they want to protect.
*   **Sensor Agent:** A lightweight Python daemon that monitors local logs, network traffic, and system processes. It securely communicates with the Cloud Backend.

---

## 2. The User Journey (How a user accesses and uses Sentry)

**Step 1: Website Access & Registration**
*   The user navigates to the Sentry web application (e.g., `https://sentry.company.com`).
*   They create an account and log into their SOC (Security Operations Center) Dashboard.
*   *Currently, their dashboard shows zero active incidents and zero protected devices.*

**Step 2: Downloading the Sensor**
*   The user clicks an **"Add Device"** or **"Deploy Sensor"** button on the dashboard.
*   The dashboard generates a unique API key for their organization and provides a simple download link / bash command.
*   *Example:* `curl -sSL https://api.sentry.company.com/install.sh | bash -s -- --api-key=YOUR_SECRET_KEY`

**Step 3: Installation & Connection**
*   The user runs the command on their own server, laptop, or cloud instance.
*   The `sensor-agent` installs itself as a background service and establishes a secure WebSocket/HTTPS connection back to the Sentry Cloud Backend.

**Step 4: Live Protection**
*   The user's dashboard instantly updates to show the device is **"Online and Protected"**.
*   If a hacker attacks the user's machine, the local `sensor-agent` detects the anomaly and streams it to the cloud.
*   The Cloud AI evaluates the threat, determines a mitigation strategy (e.g., block the IP), and issues the command back down to the local `sensor-agent`.
*   The user watches this entire engagement unfold in real-time on their web dashboard.

---

## 3. Why This Model is Superior
1.  **Zero-Friction Setup:** The user does not need to configure databases, Docker containers, or AI API keys to get started. They just need an account and a terminal.
2.  **IP & Key Protection:** The Groq API keys and proprietary LangGraph reasoning logic remain safely hidden on our servers. The user only ever downloads dumb sensor logic.
3.  **Centralized Memory:** Because all sensor data flows back to one centralized cloud database, the AI can learn from attacks happening across *all* users, improving the `pgvector` RAG memory for everyone simultaneously.
4.  **CORS & Browser Security:** Cloud frontends cannot easily talk to local backends. By keeping the Web UI and the Backend API on the same cloud domain, we avoid massive networking headaches.