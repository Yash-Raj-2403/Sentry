import socket
import threading
import time
import os
import datetime

# Configuration
# We bind to 0.0.0.0 so Kali (external) can reach us.
# We use non-standard ports to avoid permission issues and conflict with real services.
PORTS = [2222, 8081, 2121, 3389, 4455, 6379, 5432]
LOG_FILE = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../logs/honeypot.log"))

def get_timestamp():
    return datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

def log_event(message):
    try:
        # Ensure log directory exists
        os.makedirs(os.path.dirname(LOG_FILE), exist_ok=True)
        
        with open(LOG_FILE, "a") as f:
            f.write(f"[{get_timestamp()}] {message}\n")
            f.flush()
            os.fsync(f.fileno())
        print(f"[*] Placed in log: {message}")
    except Exception as e:
        print(f"[!] Error writing to log: {e}")

def handle_client(client_socket, client_ip, port):
    try:
        # Basic banner grabbing / interaction simulation
        if port == 2222:
            client_socket.send(b"SSH-2.0-OpenSSH_8.2p1 Ubuntu-4ubuntu0.5\r\n")
            log_event(f"SSH Honeypot: Connection from {client_ip} to port {port}")
            # Wait for some data (like user trying to login)
            client_socket.recv(1024)
            log_event(f"SSH Honeypot: Auth attempt from {client_ip} to port {port}")
            
        elif port == 8081:
            request = client_socket.recv(1024).decode('utf-8', errors='ignore')
            log_event(f"HTTP Honeypot: Connection from {client_ip} to port {port}")
            if "GET" in request or "POST" in request:
                log_event(f"HTTP Honeypot: Web Request from {client_ip} to port {port} -- suspicious user-agent")
            client_socket.send(b"HTTP/1.1 200 OK\r\nContent-Type: text/html\r\n\r\n<h1>Login</h1>")
            
        else:
            log_event(f"Generic Honeypot: Connection from {client_ip} to port {port}")
            
    except Exception as e:
        # Client disconnected or error
        pass
    finally:
        client_socket.close()

def start_server(port):
    server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    try:
        server.bind(("0.0.0.0", port))
        server.listen(5)
        print(f"[+] Honeypot active on port {port}")
        
        while True:
            client, addr = server.accept()
            client_ip = addr[0]
            # Spawn thread to handle client quickly so we can accept more (e.g. nmap scan)
            client_handler = threading.Thread(target=handle_client, args=(client, client_ip, port))
            client_handler.start()
            
    except Exception as e:
        print(f"[!] Failed to bind port {port}: {e}")

if __name__ == "__main__":
    log_event(f"[*] Starting Sentry Honeypot Service...")
    log_event(f"[*] Logging to {LOG_FILE}")
    log_event(f"[*] Simulating vulnerable services on ports: {PORTS}")
    
    threads = []
    for port in PORTS:
        t = threading.Thread(target=start_server, args=(port,))
        t.start()
        threads.append(t)
        
    for t in threads:
        t.join()