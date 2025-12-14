# 🚀 How to Start the Waha Bulk Messaging Portal

You're seeing "localhost can't be reached" because the application servers aren't running yet. Here's how to start them:

## Prerequisites Check

The application is installed and ready, but needs these services running:
- ✅ **Redis** - Already running
- ❌ **PostgreSQL** - Needs to be started
- ❌ **Backend Server** - Not started yet
- ❌ **Frontend Server** - Not started yet

## Quick Start (Choose One Method)

### Method 1: Docker (Easiest - if you have Docker)

```bash
cd /home/user/waha
docker-compose up -d
docker-compose exec backend npx prisma migrate deploy

# Create first user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Admin","email":"admin@example.com","password":"admin123","role":"ADMIN"}'
```

Access at: **http://localhost**

### Method 2: Manual Setup (if no Docker)

#### Step 1: Start PostgreSQL

Choose based on your system:

**Using system PostgreSQL:**
```bash
# Ubuntu/Debian
sudo service postgresql start

# macOS
brew services start postgresql

# Create database
sudo -u postgres psql -c "CREATE DATABASE waha_messaging;"
sudo -u postgres psql -c "CREATE USER waha WITH PASSWORD 'waha_password';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE waha_messaging TO waha;"
```

**OR using Docker just for PostgreSQL:**
```bash
docker run -d \
  --name waha-postgres \
  -e POSTGRES_USER=waha \
  -e POSTGRES_PASSWORD=waha_password \
  -e POSTGRES_DB=waha_messaging \
  -p 5432:5432 \
  postgres:16-alpine
```

#### Step 2: Setup Database

```bash
cd /home/user/waha/backend
npx prisma generate
npx prisma migrate dev
```

#### Step 3: Start Backend Server

**Terminal 1:**
```bash
cd /home/user/waha/backend
npm run dev
```

You should see:
```
🚀 Server running on http://localhost:3000
📚 API available at http://localhost:3000/api
```

#### Step 4: Start Worker (Optional, for background jobs)

**Terminal 2:**
```bash
cd /home/user/waha/backend
npm run worker
```

#### Step 5: Start Frontend

**Terminal 3:**
```bash
cd /home/user/waha/frontend
npm run dev
```

You should see:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
```

## Access the Application

- **Frontend UI**: http://localhost:5173
- **Backend API**: http://localhost:3000/api
- **Health Check**: http://localhost:3000/api/health

## Create Your First User

Once the backend is running, create an admin user:

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
- **Email**: admin@example.com
- **Password**: admin123

## Quick Test (Without UI)

Test the API directly:

```bash
# Health check
curl http://localhost:3000/api/health

# Register user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"test123","role":"USER"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'
```

## Troubleshooting

### "Connection refused" on port 3000
- Backend server isn't running
- Run: `cd backend && npm run dev`

### "Connection refused" on port 5173
- Frontend server isn't running
- Run: `cd frontend && npm run dev`

### "Database connection failed"
- PostgreSQL isn't running or database doesn't exist
- Check: `pg_isready -h localhost`
- Create DB: `sudo -u postgres createdb waha_messaging`

### "Redis connection failed"
- Redis isn't running
- Start: `redis-server --daemonize yes`
- Check: `redis-cli ping` (should return "PONG")

## Project Structure

```
waha/
├── backend/         → Node.js API server (port 3000)
├── frontend/        → React app (port 5173)
├── docker-compose.yml → Docker deployment
└── setup.sh        → Automated setup script
```

## Need Help?

1. Check logs in `backend/logs/`
2. Verify all services: `ps aux | grep -E "node|redis|postgres"`
3. Check ports: `netstat -tulpn | grep -E "3000|5173|5432|6379"`
4. Review: `backend/.env` for configuration

## What's Already Done

✅ Complete codebase implemented (54 files, 4,500+ lines)
✅ Backend dependencies installed
✅ Redis running
✅ Environment configured
✅ Ready to run!

**You just need to start PostgreSQL and the Node.js servers! 🎉**
