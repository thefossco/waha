# Quick Start Guide

The application needs PostgreSQL and Redis to run. Here's how to get started:

## Prerequisites

You need:
- PostgreSQL 14+ running
- Redis 7+ running
- Node.js 20+

## Setup Steps

### 1. Start Required Services

```bash
# Start Redis
redis-server --daemonize yes

# Start PostgreSQL (varies by system)
# Ubuntu/Debian:
sudo service postgresql start

# macOS with Homebrew:
brew services start postgresql

# Docker (alternative):
docker run --name waha-postgres -e POSTGRES_PASSWORD=waha_password -e POSTGRES_USER=waha -e POSTGRES_DB=waha_messaging -p 5432:5432 -d postgres:16-alpine
docker run --name waha-redis -p 6379:6379 -d redis:7-alpine
```

### 2. Create Database

```bash
# If using Docker:
docker exec -it waha-postgres psql -U waha -d waha_messaging

# If using local PostgreSQL:
sudo -u postgres psql -c "CREATE DATABASE waha_messaging;"
sudo -u postgres psql -c "CREATE USER waha WITH PASSWORD 'waha_password';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE waha_messaging TO waha;"
```

### 3. Install Dependencies & Setup

```bash
cd /home/user/waha

# Install backend dependencies
cd backend
npm install

# Run database migrations
npx prisma migrate dev

# Generate Prisma client
npx prisma generate

cd ..
```

### 4. Start Backend

```bash
# Terminal 1: Backend server
cd backend
npm run dev
```

### 5. Start Worker (in another terminal)

```bash
# Terminal 2: Background worker
cd backend
npm run worker
```

### 6. Start Frontend (in another terminal)

```bash
# Terminal 3: Frontend dev server
cd frontend
npm install
npm run dev
```

### 7. Access Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000/api
- **Health Check**: http://localhost:3000/api/health

## Create First User

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@example.com",
    "password": "admin123",
    "role": "ADMIN"
  }'
```

Then login at http://localhost:5173 with:
- Email: admin@example.com
- Password: admin123

## Alternative: Docker Compose (Easiest)

If you have Docker installed:

```bash
cd /home/user/waha
docker-compose up -d
docker-compose exec backend npx prisma migrate deploy
```

Then access at http://localhost

## Troubleshooting

### PostgreSQL Connection Issues

Update `backend/.env`:
```env
DATABASE_URL="postgresql://waha:waha_password@localhost:5432/waha_messaging?schema=public"
```

### Redis Connection Issues

Check if Redis is running:
```bash
redis-cli ping  # Should return "PONG"
```

### Port Already in Use

If port 3000 or 5173 is in use, change in:
- Backend: `backend/.env` → `PORT=3001`
- Frontend: `frontend/vite.config.ts` → `server.port`
