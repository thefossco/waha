#!/bin/bash

set -e

echo "🚀 Waha Bulk Messaging Portal - Setup Script"
echo "=============================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if running as root
if [ "$EUID" -eq 0 ]; then
    POSTGRES_CMD="sudo -u postgres"
else
    POSTGRES_CMD=""
fi

echo "📦 Step 1: Installing backend dependencies..."
cd backend
if [ ! -d "node_modules" ]; then
    npm install
    echo -e "${GREEN}✓ Backend dependencies installed${NC}"
else
    echo -e "${YELLOW}✓ Backend dependencies already installed${NC}"
fi

echo ""
echo "📦 Step 2: Installing frontend dependencies..."
cd ../frontend
if [ ! -d "node_modules" ]; then
    npm install
    echo -e "${GREEN}✓ Frontend dependencies installed${NC}"
else
    echo -e "${YELLOW}✓ Frontend dependencies already installed${NC}"
fi

cd ..

echo ""
echo "🔍 Step 3: Checking services..."

# Check Redis
if redis-cli ping > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Redis is running${NC}"
else
    echo -e "${YELLOW}⚠ Redis is not running. Starting...${NC}"
    redis-server --daemonize yes
    sleep 1
    if redis-cli ping > /dev/null 2>&1; then
        echo -e "${GREEN}✓ Redis started successfully${NC}"
    else
        echo -e "${RED}✗ Failed to start Redis${NC}"
        echo "Please start Redis manually: redis-server --daemonize yes"
    fi
fi

# Check PostgreSQL
if pg_isready -h localhost > /dev/null 2>&1; then
    echo -e "${GREEN}✓ PostgreSQL is running${NC}"
else
    echo -e "${YELLOW}⚠ PostgreSQL is not running${NC}"
    echo "Please start PostgreSQL manually:"
    echo "  Ubuntu/Debian: sudo service postgresql start"
    echo "  macOS: brew services start postgresql"
    echo "  Docker: docker run --name waha-postgres -e POSTGRES_PASSWORD=waha_password -e POSTGRES_USER=waha -e POSTGRES_DB=waha_messaging -p 5432:5432 -d postgres:16-alpine"
    echo ""
    read -p "Press Enter after starting PostgreSQL..."
fi

echo ""
echo "🗄️  Step 4: Setting up database..."

# Check if database exists
DB_EXISTS=$(psql -U waha -h localhost -lqt 2>/dev/null | cut -d \| -f 1 | grep -w waha_messaging | wc -l)

if [ "$DB_EXISTS" -eq 0 ]; then
    echo "Creating database..."

    # Try different methods to create database
    if command -v createdb > /dev/null; then
        createdb -U postgres waha_messaging 2>/dev/null || \
        $POSTGRES_CMD createdb waha_messaging 2>/dev/null || \
        psql -U postgres -c "CREATE DATABASE waha_messaging;" 2>/dev/null || \
        $POSTGRES_CMD psql -c "CREATE DATABASE waha_messaging;" 2>/dev/null || \
        echo "Please create database manually: CREATE DATABASE waha_messaging;"
    fi

    echo -e "${GREEN}✓ Database created${NC}"
else
    echo -e "${YELLOW}✓ Database already exists${NC}"
fi

echo ""
echo "🔄 Step 5: Running database migrations..."
cd backend
npx prisma generate
npx prisma migrate dev --name init || npx prisma db push
echo -e "${GREEN}✓ Database migrations complete${NC}"

cd ..

echo ""
echo "=============================================="
echo -e "${GREEN}✓ Setup complete!${NC}"
echo ""
echo "To start the application:"
echo ""
echo "Terminal 1 - Backend:"
echo "  cd backend && npm run dev"
echo ""
echo "Terminal 2 - Worker:"
echo "  cd backend && npm run worker"
echo ""
echo "Terminal 3 - Frontend:"
echo "  cd frontend && npm run dev"
echo ""
echo "Then access:"
echo "  Frontend: http://localhost:5173"
echo "  Backend API: http://localhost:3000/api"
echo ""
echo "Create first user:"
echo "  curl -X POST http://localhost:3000/api/auth/register \\"
echo "    -H 'Content-Type: application/json' \\"
echo "    -d '{\"name\":\"Admin\",\"email\":\"admin@example.com\",\"password\":\"admin123\",\"role\":\"ADMIN\"}'"
echo ""
