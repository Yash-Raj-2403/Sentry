from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
import time
import requests
import os
import re
import threading
from collections import defaultdict
from dotenv import load_dotenv

load_dotenv()

BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:8000/api/v1/events/")

# Volumetric Bot Filter setup
# We drop traffic if an IP hits more than 100 requests in a 10 second window
RATE_LIMIT_WINDOW = 10
RATE_LIMIT_THRESHOLD = 50
ip_tracker = defaultdict(list)

def is_bot_attack(ip: str) -> bool:
    """
    Edge-side dump filter to prevent AI Denial-of-Service.
    Returns True if IP is spamming, False otherwise.
    """
    now = time.time()
    # Clean old timestamps
    ip_tracker[ip] = [t for t in ip_tracker[ip] if now - t < RATE_LIMIT_WINDOW]
    ip_tracker[ip].append(now)

    if len(ip_tracker[ip]) > RATE_LIMIT_THRESHOLD:
        return True
    return False

def classify_event(line: str) -> dict:
    """
    Derive severity and event_type from the raw honeypot log line.
    """
    lower = line.lower()
    if "auth attempt" in lower or "ssh" in lower:
        return {"severity": "high", "event_type": "ssh_auth_attempt"}
    elif "suspicious" in lower:
        return {"severity": "high", "event_type": "suspicious_request"}
    elif "web request" in lower or "http" in lower:
        return {"severity": "medium", "event_type": "http_probe"}
    elif "honeypot" in lower:
        return {"severity": "medium", "event_type": "honeypot_connection"}
    return {"severity": "low", "event_type": "log_entry"}

class LogHandler(FileSystemEventHandler):
    def __init__(self):
        self._file_position = 0
        self._lock = threading.Lock()

    def on_modified(self, event):
        if event.is_directory:
            return

        # FILTER: Only process honeypot.log
        if os.path.basename(event.src_path) != "honeypot.log":
            return

        try:
            with self._lock:
                with open(event.src_path, "r") as f:
                    f.seek(self._file_position)
                    new_lines = f.readlines()
                    self._file_position = f.tell()

            for raw_line in new_lines:
                line = raw_line.strip()
                if not line:
                    continue

                # Extract IP
                ip_match = re.search(r'from\s+(\d+\.\d+\.\d+\.\d+)', line)
                source_ip = ip_match.group(1) if ip_match else "unknown"

                # Check for bot attack
                if source_ip != "unknown" and is_bot_attack(source_ip):
                    print(f"[EDGE FILTER] Dropping spam from {source_ip}")
                    continue

                payload = {
                    "source_ip": source_ip,
                    "raw_payload": line,
                    "event_metadata": {"path": event.src_path}
                }

                # Extract port
                port_match = re.search(r"port (\d+)", line)
                if port_match:
                    payload["destination_port"] = int(port_match.group(1))

                # Classify event
                meta = classify_event(line)
                payload["severity"] = meta["severity"]
                payload["event_type"] = meta["event_type"]

                try:
                    response = requests.post(BACKEND_URL, json=payload, timeout=5)
                    if response.status_code == 200:
                        print(f"Sent event [{meta['severity']}]: {line[:60]}...")
                    else:
                        print(f"Failed to send event: {response.text}")
                except Exception as e:
                    print(f"Error sending event: {e}")

        except Exception as e:
            print(f"Error processing log: {e}")

def run_sensor():
    path = os.getenv("LOG_DIR", ".")
    event_handler = LogHandler()

    # Initialise position to end of current file so we only process NEW entries
    log_path = os.path.join(path, "honeypot.log")
    if os.path.exists(log_path):
        event_handler._file_position = os.path.getsize(log_path)

    observer = Observer()
    observer.schedule(event_handler, path, recursive=False)
    observer.start()
    print(f"Sensor started, watching {path}")
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()

if __name__ == "__main__":
    run_sensor()

