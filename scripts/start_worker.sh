#!/bin/bash
set -e

# Go to backend-core directory
cd backend-core

# Activate virtual environment
source .venv/bin/activate

# Add current directory to PYTHONPATH so app.worker module is found
export PYTHONPATH=$PYTHONPATH:.

echo "Starting detection worker..."
python3 -m app.worker