# 🚀 Run Waha Messaging Portal on Localhost with Docker Desktop

This guide will help you run the complete application on your **local machine** using Docker Desktop.

## 📋 Prerequisites

- ✅ **Docker Desktop** installed and running
- ✅ **Git** (to clone the repository)

## 🎯 Quick Start (5 minutes)

### Step 1: Clone or Download the Project

**Option A: Clone from GitHub**
```bash
git clone https://github.com/thefossco/waha.git
cd waha
```

**Option B: Download from server**
```bash
# From your local machine
scp -r user@server:/home/user/waha ./waha
cd waha
```

### Step 2: Start Docker Desktop

Make sure **Docker Desktop is running** on your computer.

### Step 3: Start All Services

```bash
docker-compose up -d --build
```

This command will:
- Build the backend and frontend containers
- Start PostgreSQL database
- Start Redis cache
- Start the backend API
- Start the worker process
- Start the frontend web app

**First time?** It will take 3-5 minutes to build everything.

### Step 4: Set Up the Database

```bash
# Run database migrations
docker-compose exec backend npx prisma migrate deploy

# Generate Prisma client
docker-compose exec backend npx prisma generate
```

### Step 5: Create Admin User

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Admin User","email":"admin@example.com","password":"admin123","role":"ADMIN"}'
```

### Step 6: Open in Browser

**🌐 http://localhost**

Login with:
- **Email:** admin@example.com
- **Password:** admin123

---

## 🎯 Access URLs

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost | Main web application |
| **Backend API** | http://localhost:3000/api | REST API |
| **Health Check** | http://localhost:3000/api/health | API status |
| **PostgreSQL** | localhost:5432 | Database (internal) |
| **Redis** | localhost:6379 | Cache (internal) |

---

## 🛠️ Useful Commands

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f worker
```

### Restart Services
```bash
# Restart everything
docker-compose restart

# Restart specific service
docker-compose restart backend
docker-compose restart frontend
```

### Stop Services
```bash
# Stop (keeps data)
docker-compose down

# Stop and remove all data (fresh start)
docker-compose down -v
```

### Check Status
```bash
docker-compose ps
```

### Access Container Shell
```bash
# Backend shell
docker-compose exec backend sh

# Run commands in backend
docker-compose exec backend npx prisma studio
```

---

## 🔧 Development Mode (Without Docker)

If you prefer to run without Docker:

### Terminal 1: Start Services
```bash
# Start PostgreSQL
docker run -d --name waha-postgres \
  -e POSTGRES_USER=waha \
  -e POSTGRES_PASSWORD=waha_password \
  -e POSTGRES_DB=waha_messaging \
  -p 5432:5432 \
  postgres:16-alpine

# Start Redis
docker run -d --name waha-redis \
  -p 6379:6379 \
  redis:7-alpine
```

### Terminal 2: Backend
```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```

### Terminal 3: Frontend
```bash
cd frontend
npm install
npm run dev
```

Access at: **http://localhost:5173**

---

## 📊 What's Running?

When you run `docker-compose up`, these containers start:

1. **waha-postgres** - PostgreSQL database
2. **waha-redis** - Redis cache
3. **waha-backend** - Node.js API server (port 3000)
4. **waha-worker** - Background job processor
5. **waha-frontend** - Nginx serving React app (port 80)

---

## 🐛 Troubleshooting

### Port Already in Use

If port 80 or 3000 is already in use, edit `docker-compose.yml`:

```yaml
# Change frontend port
frontend:
  ports:
    - "8080:80"  # Access at http://localhost:8080

# Change backend port
backend:
  ports:
    - "3001:3000"  # Access at http://localhost:3001/api
```

### Database Connection Issues

```bash
# Reset database
docker-compose down -v
docker-compose up -d
docker-compose exec backend npx prisma migrate deploy
```

### View Container Logs

```bash
docker-compose logs backend
docker-compose logs frontend
```

### Rebuild Everything

```bash
docker-compose down
docker-compose up -d --build --force-recreate
```

---

## 📝 Environment Variables

The `.env` file in `backend/` contains all configuration:

```env
DATABASE_URL="postgresql://waha:waha_password@postgres:5432/waha_messaging?schema=public"
PORT=3000
JWT_SECRET=your-secret-key
WAHA_API_URL=https://your-waha-api
WAHA_API_KEY=your-api-key
```

**Note:** When using Docker Compose, the database host is `postgres` (container name), not `localhost`.

---

## ✅ Verification Checklist

After running `docker-compose up -d`, verify:

- [ ] `docker-compose ps` shows all containers as "Up"
- [ ] http://localhost loads the login page
- [ ] http://localhost:3000/api/health returns `{"status":"ok"}`
- [ ] You can login with admin@example.com / admin123

---

## 🎉 You're Ready!

The application is now running on **localhost**!

- Open **http://localhost** in your browser
- Login and start sending messages!

For production deployment, see `README.md`.
