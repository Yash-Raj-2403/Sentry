#!/bin/bash
set -e

# Go to backend-core directory
cd backend-core

# Check python version
python3 --version

# Create virtual environment if not exists
if [ ! -d ".venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv .venv
fi

# Activate virtual environment
source .venv/bin/activate

# Upgrade pip
pip install --upgrade pip

# Install requirements
echo "Installing dependencies..."
pip install -r requirements.txt

# Run the backend
echo "Starting backend server..."
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
