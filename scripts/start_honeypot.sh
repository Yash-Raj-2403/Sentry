#!/bin/bash
set -e

# Go to sensor-agent directory
cd sensor-agent

# Create virtual environment if not exists (should exist if user ran start_sensor.sh, but check)
if [ ! -d ".venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv .venv
fi

# Activate virtual environment
source .venv/bin/activate

# Create logs directory if not exists
mkdir -p ../logs

# Set LOG_DIR to the logs directory
export LOG_DIR="../logs"

echo "Starting Sentry Honeypot Service..."
echo "Simulating vulnerable servers on ports 2222 (SSH), 8081 (Web), 2121 (FTP), 3389 (RDP - fake)."
echo "Attack these ports from Kali!"

python3 app/honeypot.py