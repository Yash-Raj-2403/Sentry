from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
import time
import requests
import os
import re
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

class LogHandler(FileSystemEventHandler):
    def on_modified(self, event):
        if event.is_directory:
            return

        # FILTER: Only process honeypot.log
        if os.path.basename(event.src_path) != "honeypot.log":
            return
        
        try:
            with open(event.src_path, "r") as f:
                # In robust implementation, seek to last position
                lines = f.readlines()
                if not lines: return
                last_line = lines[-1].strip()
            
            # Simple extractor for IP in honeypot logs
            # Format: ... from 127.0.0.1 ...
            ip_match = re.search(r'from\s+(\d+\.\d+\.\d+\.\d+)', last_line)
            source_ip = ip_match.group(1) if ip_match else "unknown"

            # Check for bot attack
            if source_ip != "unknown" and is_bot_attack(source_ip):
                print(f"Skipping spam from {source_ip}")
                return

            payload = {
                "source_ip": source_ip,
                "event_type": "log_entry",
                "raw_payload": last_line,
                "event_metadata": {"path": event.src_path}
            }
            
            # Simple IP extraction for demo
            ip_match = re.search(r"(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})", last_line)
            if ip_match:
                source_ip = ip_match.group(1)
                payload["source_ip"] = source_ip
                
                # Volumetric Filter Check
                if is_bot_attack(source_ip):
                    print(f"🛑 [EDGE FILTER] Imminent Bot Attack from {source_ip}. Dropping locally. Bypassing AI bottleneck.")
                    # Optionally execute local OS iptables command immediately here
                    # os.system(f"iptables -A INPUT -s {source_ip} -j DROP")
                    return
            
            # Simple Port extraction for demo
            port_match = re.search(r"port (\d+)", last_line)
            if port_match:
                payload["destination_port"] = int(port_match.group(1))

            response = requests.post(BACKEND_URL, json=payload)
            if response.status_code == 200:
                print(f"Sent event: {last_line[:50]}...")
            else:
                print(f"Failed to send event: {response.text}")

        except Exception as e:
            print(f"Error processing log: {e}")

def run_sensor():
    path = os.getenv("LOG_DIR", ".")
    event_handler = LogHandler()
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
