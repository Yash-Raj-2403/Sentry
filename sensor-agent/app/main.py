from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
import time
import requests
import os
from dotenv import load_dotenv

load_dotenv()

BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:8000/api/v1/incidents")

class LogHandler(FileSystemEventHandler):
    def on_modified(self, event):
        if event.is_directory:
            return
        print(f"File modified: {event.src_path}")
        # Here we would parse lines and send to backend
        # For MVP, just send a ping
        try:
            # metadata = {"path": event.src_path, "timestamp": time.time()}
            # requests.post(BACKEND_URL, json=metadata)
            pass
        except Exception as e:
            print(f"Error sending log: {e}")

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
