#!/bin/bash
set -e

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}Stopping any existing Sentry processes...${NC}"
pkill -f "uvicorn app.main" || true
pkill -f "app.worker" || true
pkill -f "sensor-agent/app/main.py" || true
pkill -f "honeypot.py" || true
pkill -f "vite" || true
sleep 1

# Ensure logs directory exists
mkdir -p logs

echo -e "${GREEN}Starting Redis...${NC}"
if ! pgrep redis-server > /dev/null; then
    if command -v redis-server &> /dev/null; then
        redis-server --daemonize yes
    else
        echo -e "${RED}Redis is not installed! Please run: sudo apt-get install redis-server${NC}"
        exit 1
    fi
fi

# Trim the event stream to prevent queue buildup across restarts
redis-cli DEL sentry:events > /dev/null 2>&1 || true

echo -e "${GREEN}Starting Backend API...${NC}"
cd backend-core
source .venv/bin/activate
nohup uvicorn app.main:app --host 0.0.0.0 --port 8000 > ../logs/backend.log 2>&1 &
BACKEND_PID=$!
echo "Backend running (PID: $BACKEND_PID)"
cd ..

echo -e "${GREEN}Starting AI Worker...${NC}"
cd backend-core
export PYTHONPATH=$PYTHONPATH:.
nohup python3 -u -m app.worker > ../logs/worker.log 2>&1 &
WORKER_PID=$!
echo "Worker running (PID: $WORKER_PID)"
cd ..

echo -e "${GREEN}Starting Sensor & Honeypot...${NC}"
cd sensor-agent
source .venv/bin/activate
export LOG_DIR="../logs"
# Start Honeypot
nohup python3 -u app/honeypot.py > ../logs/honeypot_console.log 2>&1 &
HONEYPOT_PID=$!
echo "Honeypot running (PID: $HONEYPOT_PID)"
# Start Sensor
nohup python3 -u app/main.py > ../logs/sensor.log 2>&1 &
SENSOR_PID=$!
echo "Sensor running (PID: $SENSOR_PID)"
cd ..

echo -e "${GREEN}Starting Frontend...${NC}"
cd frontend
nohup npm run dev -- --host > ../logs/frontend.log 2>&1 &
FRONTEND_PID=$!
echo "Frontend running (PID: $FRONTEND_PID)"
cd ..

echo -e "${GREEN}✅ SENTRY SYSTEM STARTED SUCCESSFULLY!${NC}"
echo "---------------------------------------------------"
echo "Backend API:    http://localhost:8000"
echo "Frontend UI:    http://localhost:5173"
echo "Logs are in:    ./logs/"
echo "---------------------------------------------------"
echo "Run './scripts/stop_all.sh' to stop everything."
