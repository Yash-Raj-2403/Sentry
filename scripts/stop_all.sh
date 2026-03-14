#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
NC='\033[0m' # No Color

echo -e "${GREEN}Stopping Sentry Platform...${NC}"

echo "Killing Backend..."
pkill -f "uvicorn app.main" || true

echo "Killing Worker..."
pkill -f "app.worker" || true

echo "Killing Sensor..."
pkill -f "sensor-agent" || true
pkill -f "honeypot.py" || true

echo "Killing Frontend..."
pkill -f "vite" || true

echo -e "${GREEN}All services stopped.${NC}"
