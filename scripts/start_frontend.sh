#!/bin/bash
set -e

# Go to frontend directory
cd frontend

# Install dependencies if node_modules missing
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
fi

# Run the frontend
echo "Starting frontend server..."
npm run dev -- --host
