#!/bin/bash
set -e

# Go to sensor-agent directory
cd sensor-agent

# Create virtual environment if not exists
if [ ! -d ".venv" ]; then
    echo "Creating virtual environment for sensor..."
    python3 -m venv .venv
fi

# Activate virtual environment
source .venv/bin/activate

# Install requirements
echo "Installing sensor dependencies..."
pip install -r requirements.txt

# Create logs directory if not exists
mkdir -p ../logs

# Set LOG_DIR to the logs directory
export LOG_DIR="../logs"

echo "Starting sensor agent..."
echo "Watching directory: $(readlink -f $LOG_DIR)"
echo "Write logs to $LOG_DIR/auth.log to trigger events."

python3 app/main.py