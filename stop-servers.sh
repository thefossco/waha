#!/bin/bash

# Waha Messaging Portal - Stop Script

echo "Stopping Waha Messaging Portal..."

# Stop backend
if [ -f /tmp/backend.pid ]; then
    BACKEND_PID=$(cat /tmp/backend.pid)
    echo "Stopping backend (PID: $BACKEND_PID)..."
    kill $BACKEND_PID 2>/dev/null
    rm /tmp/backend.pid
fi

# Stop frontend
if [ -f /tmp/frontend.pid ]; then
    FRONTEND_PID=$(cat /tmp/frontend.pid)
    echo "Stopping frontend (PID: $FRONTEND_PID)..."
    kill $FRONTEND_PID 2>/dev/null
    rm /tmp/frontend.pid
fi

# Kill any remaining processes
pkill -f "tsx watch src/index.ts" 2>/dev/null
pkill -f "vite" 2>/dev/null

echo ""
echo "✓ Servers stopped"
echo ""
echo "To start again: ./start-servers.sh"
