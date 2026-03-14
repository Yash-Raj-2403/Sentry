from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
import time
import requests
import os
from dotenv import load_dotenv

load_dotenv()

BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:8000/api/v1/events/")

class LogHandler(FileSystemEventHandler):
    def on_modified(self, event):
        if event.is_directory:
            return
        
        try:
            with open(event.src_path, "r") as f:
                # In robust implementation, seek to last position
                lines = f.readlines()
                if not lines: return
                last_line = lines[-1].strip()
                
            payload = {
                "source_ip": "unknown",
                "event_type": "log_entry",
                "raw_payload": last_line,
                "metadata": {"path": event.src_path}
            }
            
            # Simple IP extraction for demo
            import re
            ip_match = re.search(r"(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})", last_line)
            if ip_match:
                payload["source_ip"] = ip_match.group(1)
            
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
