#!/bin/bash

# Waha Messaging Portal - Start Script

echo "Starting Waha Messaging Portal..."

# Start PostgreSQL
echo "Starting PostgreSQL..."
/etc/init.d/postgresql start
sleep 2

# Start Redis
echo "Starting Redis..."
redis-server --daemonize yes
sleep 1

# Verify services
if ! pg_isready > /dev/null 2>&1; then
    echo "ERROR: PostgreSQL failed to start"
    exit 1
fi

if ! redis-cli ping > /dev/null 2>&1; then
    echo "ERROR: Redis failed to start"
    exit 1
fi

echo "✓ PostgreSQL running"
echo "✓ Redis running"

# Start Backend
echo "Starting Backend on port 3001..."
cd /home/user/waha/backend
nohup npm run dev > /tmp/backend.log 2>&1 &
BACKEND_PID=$!
echo $BACKEND_PID > /tmp/backend.pid

# Wait for backend to be ready
echo "Waiting for backend..."
for i in {1..15}; do
    sleep 1
    if curl -s http://localhost:3001/api/health > /dev/null 2>&1; then
        echo "✓ Backend running on port 3001"
        break
    fi
done

# Start Frontend
echo "Starting Frontend on port 5173..."
cd /home/user/waha/frontend
nohup npm run dev > /tmp/frontend.log 2>&1 &
FRONTEND_PID=$!
echo $FRONTEND_PID > /tmp/frontend.pid

# Wait for frontend to be ready
echo "Waiting for frontend..."
for i in {1..15}; do
    sleep 1
    if curl -s http://localhost:5173 > /dev/null 2>&1; then
        echo "✓ Frontend running on port 5173"
        break
    fi
done

echo ""
echo "========================================="
echo "✅ Waha Messaging Portal is running!"
echo "========================================="
echo ""
echo "Frontend: http://localhost:5173"
echo "Backend:  http://localhost:3001/api"
echo ""
echo "Login: admin@example.com / admin123"
echo ""
echo "Logs:"
echo "  Backend:  tail -f /tmp/backend.log"
echo "  Frontend: tail -f /tmp/frontend.log"
echo ""
echo "PIDs saved to:"
echo "  Backend:  /tmp/backend.pid"
echo "  Frontend: /tmp/frontend.pid"
echo ""
