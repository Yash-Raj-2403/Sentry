"""
Sentry — Presentation Attack Injector
Posts incidents directly to the DB via REST API.
Incidents appear on the UI immediately.

Usage:
  python3 inject_attacks.py
"""
import requests, time

API = "http://localhost:8000/api/v1/incidents/"

incidents = [
    {
        "title": "SSH Brute Force Attack from 185.220.101.47",
        "severity": "critical",
        "status": "open",
        "attacker_ip": "185.220.101.47",
        "risk_score": 1.0,
        "description": "Tor exit-node 185.220.101.47 launched a high-volume SSH brute force campaign — 312 failed login attempts in 60 seconds on port 2222. Credential stuffing pattern matches known Mirai botnet behaviour. MITRE ATT&CK: T1110.001 — Brute Force: Password Guessing.",
    },
    {
        "title": "SQL Injection Probe from 45.142.212.100",
        "severity": "critical",
        "status": "investigating",
        "attacker_ip": "45.142.212.100",
        "risk_score": 0.97,
        "description": "HTTP honeypot on port 8081 received automated SQLmap scan from 45.142.212.100. Payload: ' OR 1=1-- injected in User-Agent header. 23 unique injection vectors attempted. MITRE ATT&CK: T1190 — Exploit Public-Facing Application.",
    },
    {
        "title": "SSH Credential Spray from 192.168.1.100",
        "severity": "critical",
        "status": "open",
        "attacker_ip": "192.168.1.100",
        "risk_score": 1.0,
        "description": "Internal host 192.168.1.100 matched known threat-intel feed. SSH credential spray targeting port 2222 — 86 unique username/password combos in 30 seconds. Possible lateral movement from compromised internal node. MITRE ATT&CK: T1110.003 — Password Spraying.",
    },
    {
        "title": "RDP Credential Stuffing from 104.244.72.15",
        "severity": "high",
        "status": "investigating",
        "attacker_ip": "104.244.72.15",
        "risk_score": 0.85,
        "description": "Repeated RDP authentication failures from 104.244.72.15 on port 3389. Attack pattern consistent with credential stuffing using leaked database. 41 attempts in 90 seconds. MITRE ATT&CK: T1110.004 — Credential Stuffing.",
    },
    {
        "title": "Web App Scanner Detected from 194.165.16.74",
        "severity": "high",
        "status": "open",
        "attacker_ip": "194.165.16.74",
        "risk_score": 0.78,
        "description": "Nikto/2.1.6 web scanner detected from 194.165.16.74 on port 8081. Directory traversal attempts and exposed config file enumeration observed. 67 unique paths probed. MITRE ATT&CK: T1595.003 — Active Scanning: Wordlist Scanning.",
    },
    {
        "title": "FTP Brute Force from 91.108.4.200",
        "severity": "high",
        "status": "resolved",
        "attacker_ip": "91.108.4.200",
        "risk_score": 0.82,
        "description": "FTP honeypot on port 2121 hit with 88 brute-force login attempts from 91.108.4.200 over 45 seconds. Usernames targeted: admin, root, anonymous, ftpuser. Source ASN links to Eastern European bulletproof hosting. MITRE ATT&CK: T1110.001.",
    },
    {
        "title": "Redis Unauthorised Access from 195.178.110.78",
        "severity": "medium",
        "status": "resolved",
        "attacker_ip": "195.178.110.78",
        "risk_score": 0.55,
        "description": "Redis honeypot on port 6379 probed by 195.178.110.78. INFO and CONFIG GET commands issued without authentication. Attacker likely scanning for misconfigured Redis instances for cryptojacking. MITRE ATT&CK: T1505 — Server Software Component.",
    },
    {
        "title": "Multi-Port Reconnaissance from 198.235.24.5",
        "severity": "medium",
        "status": "resolved",
        "attacker_ip": "198.235.24.5",
        "risk_score": 0.60,
        "description": "198.235.24.5 probed 12 ports in under 2 seconds including 22, 80, 443, 3306, 6379, 27017. Classic horizontal port scan pattern. No exploitation attempted. MITRE ATT&CK: T1046 — Network Service Discovery.",
    },
]

print("=" * 62)
print("  Sentry — Injecting Malicious Incidents")
print("=" * 62)

SEV_COLOR = {
    "critical": "\033[91m",  # red
    "high":     "\033[33m",  # yellow
    "medium":   "\033[34m",  # blue
    "low":      "\033[32m",  # green
}
RESET = "\033[0m"

for i, inc in enumerate(incidents):
    try:
        r = requests.post(API, json=inc, timeout=5)
        ok = r.status_code == 200
        tag = "✓" if ok else "✗"
    except Exception as e:
        tag = "✗"
        ok = False

    color = SEV_COLOR.get(inc["severity"], "")
    print(f"  {tag} {inc['attacker_ip']:18s}  {color}{inc['severity'].upper():8s}{RESET}  {inc['status']:13s}  {inc['title'][:38]}")
    time.sleep(0.3)

print("=" * 62)
print("  Done. Open http://localhost:5173/incidents")
print("=" * 62)
