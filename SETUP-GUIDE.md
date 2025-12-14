# 📖 Complete Step-by-Step Setup Guide for Waha Messaging Portal

This guide will walk you through setting up the Waha Messaging Portal from scratch on your own machine.

---

## 🎯 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Step 1: Install Required Software](#step-1-install-required-software)
3. [Step 2: Clone the Project](#step-2-clone-the-project)
4. [Step 3: Setup PostgreSQL Database](#step-3-setup-postgresql-database)
5. [Step 4: Setup Redis](#step-4-setup-redis)
6. [Step 5: Configure Backend](#step-5-configure-backend)
7. [Step 6: Install Dependencies](#step-6-install-dependencies)
8. [Step 7: Setup Database Schema](#step-7-setup-database-schema)
9. [Step 8: Start All Services](#step-8-start-all-services)
10. [Step 9: Create Admin User](#step-9-create-admin-user)
11. [Step 10: Access the Application](#step-10-access-the-application)
12. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before you begin, make sure you have:

- A computer running **Linux**, **macOS**, or **Windows**
- **Administrator/sudo access** on your machine
- **Internet connection** to download packages

---

## Step 1: Install Required Software

### 1.1 Install Node.js (Version 20 or higher)

**On Ubuntu/Debian:**
```bash
# Add NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

# Install Node.js
sudo apt-get install -y nodejs

# Verify installation
node --version  # Should show v20.x.x or higher
npm --version   # Should show 10.x.x or higher
```

**On macOS:**
```bash
# Using Homebrew
brew install node@20

# Verify installation
node --version
npm --version
```

**On Windows:**
- Download installer from: https://nodejs.org/en/download/
- Run the installer and follow the prompts
- Open Command Prompt and verify:
```cmd
node --version
npm --version
```

---

### 1.2 Install PostgreSQL (Version 16 or higher)

**On Ubuntu/Debian:**
```bash
# Add PostgreSQL repository
sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -

# Update and install
sudo apt-get update
sudo apt-get install -y postgresql-16

# Start PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Verify installation
psql --version  # Should show 16.x
```

**On macOS:**
```bash
# Using Homebrew
brew install postgresql@16
brew services start postgresql@16

# Verify installation
psql --version
```

**On Windows:**
- Download from: https://www.postgresql.org/download/windows/
- Run the installer (remember the password you set!)
- Verify in Command Prompt:
```cmd
psql --version
```

---

### 1.3 Install Redis (Version 7 or higher)

**On Ubuntu/Debian:**
```bash
# Install Redis
sudo apt-get install -y redis-server

# Start Redis
sudo systemctl start redis-server
sudo systemctl enable redis-server

# Verify installation
redis-cli ping  # Should return "PONG"
```

**On macOS:**
```bash
# Using Homebrew
brew install redis
brew services start redis

# Verify installation
redis-cli ping  # Should return "PONG"
```

**On Windows:**
- Download from: https://github.com/microsoftarchive/redis/releases
- Or use WSL (Windows Subsystem for Linux) and follow Ubuntu instructions
- Or use Docker Desktop to run Redis

---

### 1.4 Install Git

**On Ubuntu/Debian:**
```bash
sudo apt-get install -y git
git --version
```

**On macOS:**
```bash
brew install git
git --version
```

**On Windows:**
- Download from: https://git-scm.com/download/win
- Install and verify in Command Prompt:
```cmd
git --version
```

---

## Step 2: Clone the Project

```bash
# Clone from GitHub
git clone https://github.com/thefossco/waha.git

# Navigate to project directory
cd waha

# Check project structure
ls -la
```

You should see folders: `backend/`, `frontend/`, `docker-compose.yml`, etc.

---

## Step 3: Setup PostgreSQL Database

### 3.1 Access PostgreSQL

**On Linux/macOS:**
```bash
sudo -u postgres psql
```

**On Windows:**
```cmd
psql -U postgres
```
(Enter the password you set during installation)

---

### 3.2 Create Database and User

Once in PostgreSQL prompt (`postgres=#`), run these commands:

```sql
-- Create user
CREATE USER waha WITH PASSWORD 'waha_password';

-- Create database
CREATE DATABASE waha_messaging OWNER waha;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE waha_messaging TO waha;

-- Allow user to create databases (needed for Prisma migrations)
ALTER USER waha CREATEDB;

-- Exit PostgreSQL
\q
```

---

### 3.3 Verify Database Creation

```bash
# Test connection
psql -U waha -d waha_messaging -h localhost

# You'll be prompted for password: waha_password
# If successful, you'll see: waha_messaging=#

# Exit
\q
```

---

## Step 4: Setup Redis

Redis should already be running from Step 1.3. Verify:

```bash
# Test Redis connection
redis-cli ping
```

**Expected output:** `PONG`

If you get an error:
```bash
# Start Redis
sudo systemctl start redis-server  # Linux
# or
brew services start redis  # macOS
```

---

## Step 5: Configure Backend

### 5.1 Navigate to Backend Directory

```bash
cd backend
```

### 5.2 Create Environment File

```bash
# Copy example environment file
cp .env.example .env
```

### 5.3 Edit .env File

Open `.env` in your favorite text editor:

```bash
nano .env
# or
vim .env
# or
code .env  # VS Code
# or use any text editor
```

**Update these values:**

```env
# Database - REQUIRED
DATABASE_URL="postgresql://waha:waha_password@localhost:5432/waha_messaging?schema=public"

# Redis - REQUIRED
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Server - REQUIRED
PORT=3000
NODE_ENV=development

# JWT - REQUIRED (Change this!)
JWT_SECRET=your-super-secret-jwt-key-change-this-to-something-unique
JWT_EXPIRES_IN=7d

# Encryption - REQUIRED (Must be exactly 32 characters!)
ENCRYPTION_KEY=your-32-character-encryption-k

# Waha API - REQUIRED (Get from your Waha provider)
WAHA_API_URL=https://api.waha.example
WAHA_API_KEY=your-waha-api-key

# Rate Limiting - OPTIONAL
WAHA_RATE_LIMIT_PER_MINUTE=60
MAX_BATCH_SIZE=100

# Upload - OPTIONAL
MAX_FILE_SIZE_MB=10
UPLOAD_DIR=./uploads

# Retry Settings - OPTIONAL
MAX_RETRIES=3
RETRY_BACKOFF_MS=1000

# Callback - OPTIONAL
CALLBACK_SECRET=your-callback-signature-secret
```

**⚠️ IMPORTANT:**
- Replace `JWT_SECRET` with a random string (at least 32 characters)
- Replace `ENCRYPTION_KEY` with exactly 32 characters
- Replace `WAHA_API_URL` and `WAHA_API_KEY` with your actual Waha credentials

**To generate secure secrets:**
```bash
# Generate JWT_SECRET (Linux/macOS)
openssl rand -base64 32

# Generate ENCRYPTION_KEY (must be 32 chars)
openssl rand -base64 24
```

**Save and close the file.**

---

## Step 6: Install Dependencies

### 6.1 Install Backend Dependencies

```bash
# Make sure you're in the backend directory
cd /path/to/waha/backend

# Install packages
npm install
```

**Expected output:** Package installation progress, should complete without errors.

---

### 6.2 Install Frontend Dependencies

```bash
# Navigate to frontend directory
cd ../frontend

# Install packages
npm install
```

---

## Step 7: Setup Database Schema

### 7.1 Generate Prisma Client

```bash
# Make sure you're in the backend directory
cd ../backend

# Generate Prisma client
npx prisma generate
```

**Expected output:** "✔ Generated Prisma Client"

---

### 7.2 Create Database Tables

```bash
# Push schema to database
npx prisma db push
```

**Expected output:** "🚀 Your database is now in sync with your Prisma schema"

**Alternative (if you have migrations):**
```bash
npx prisma migrate deploy
```

---

### 7.3 Verify Database Setup (Optional)

```bash
# Open Prisma Studio to view your database
npx prisma studio
```

This opens a web interface at http://localhost:5555 where you can see your tables.

Press `Ctrl+C` to stop Prisma Studio when done.

---

## Step 8: Start All Services

You'll need **3 terminal windows/tabs** open:

### Terminal 1: Backend Server

```bash
# Navigate to backend directory
cd /path/to/waha/backend

# Start backend server
npm run dev
```

**Expected output:**
```
🚀 Server running on http://localhost:3000
📚 API available at http://localhost:3000/api
```

**Keep this terminal running!**

---

### Terminal 2: Worker Process

```bash
# Navigate to backend directory (in a new terminal)
cd /path/to/waha/backend

# Start worker
npm run worker
```

**Expected output:**
```
🔄 Message worker is running and processing jobs...
```

**Keep this terminal running!**

---

### Terminal 3: Frontend Server

```bash
# Navigate to frontend directory (in a new terminal)
cd /path/to/waha/frontend

# Start frontend dev server
npm run dev
```

**Expected output:**
```
VITE v5.x.x ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: http://xxx.xxx.xxx.xxx:5173/
```

**Keep this terminal running!**

---

## Step 9: Create Admin User

Open a **4th terminal** or use an existing one:

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

**Expected output:**
```json
{
  "id": "...",
  "name": "Admin User",
  "email": "admin@example.com",
  "role": "ADMIN",
  "createdAt": "2025-12-14T..."
}
```

✅ **Admin user created successfully!**

---

## Step 10: Access the Application

### 10.1 Open Your Browser

Navigate to: **http://localhost:5173**

---

### 10.2 Login

**Email:** admin@example.com
**Password:** admin123

---

### 10.3 Start Using the Portal!

You can now:
- ✅ Add contacts
- ✅ Create groups
- ✅ Create message templates
- ✅ Send bulk messages
- ✅ Track delivery status

---

## 🎉 Congratulations!

Your Waha Messaging Portal is now running locally!

---

## 📊 Quick Reference

| Service | URL | Purpose |
|---------|-----|---------|
| **Frontend** | http://localhost:5173 | Web interface |
| **Backend API** | http://localhost:3000/api | REST API |
| **Health Check** | http://localhost:3000/api/health | Check if backend is running |
| **Database** | localhost:5432 | PostgreSQL |
| **Redis** | localhost:6379 | Cache & Queue |

---

## 🔄 Daily Usage

### Starting the Application

You need to run these commands in 3 separate terminals:

**Terminal 1:**
```bash
cd /path/to/waha/backend && npm run dev
```

**Terminal 2:**
```bash
cd /path/to/waha/backend && npm run worker
```

**Terminal 3:**
```bash
cd /path/to/waha/frontend && npm run dev
```

Then open: http://localhost:5173

---

### Stopping the Application

In each terminal, press: **Ctrl + C**

---

## Troubleshooting

### Issue 1: "Port 3000 already in use"

**Solution:**
```bash
# Find process using port 3000
lsof -i :3000  # Linux/macOS
netstat -ano | findstr :3000  # Windows

# Kill the process
kill -9 <PID>  # Linux/macOS
taskkill /PID <PID> /F  # Windows
```

---

### Issue 2: "Port 5173 already in use"

**Solution:** Same as above, but for port 5173

---

### Issue 3: Database Connection Failed

**Check if PostgreSQL is running:**
```bash
sudo systemctl status postgresql  # Linux
brew services list  # macOS
```

**Start PostgreSQL:**
```bash
sudo systemctl start postgresql  # Linux
brew services start postgresql@16  # macOS
```

**Test connection:**
```bash
psql -U waha -d waha_messaging -h localhost
```

---

### Issue 4: Redis Connection Failed

**Check if Redis is running:**
```bash
redis-cli ping
```

**Start Redis:**
```bash
sudo systemctl start redis-server  # Linux
brew services start redis  # macOS
```

---

### Issue 5: "Cannot find module" errors

**Solution:**
```bash
# Reinstall dependencies
cd backend
rm -rf node_modules package-lock.json
npm install

cd ../frontend
rm -rf node_modules package-lock.json
npm install
```

---

### Issue 6: Migration Errors

**Reset database:**
```bash
cd backend
npx prisma migrate reset
npx prisma db push
```

---

### Issue 7: Environment Variables Not Loading

**Check .env file:**
```bash
cd backend
cat .env  # Verify file exists and has correct values
```

**Make sure:**
- File is named exactly `.env` (not `.env.txt`)
- DATABASE_URL is correct
- No extra spaces around `=`

---

## 📝 Next Steps

### 1. Configure Waha API Credentials

Edit `backend/.env`:
```env
WAHA_API_URL=https://your-actual-waha-api.com
WAHA_API_KEY=your-real-api-key
```

Restart backend after changes:
```bash
# In backend terminal, press Ctrl+C, then:
npm run dev
```

---

### 2. Create Additional Users

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "User Name",
    "email": "user@example.com",
    "password": "password123",
    "role": "USER"
  }'
```

**Roles:**
- `ADMIN` - Full access
- `USER` - Can send messages and manage contacts
- `VIEWER` - Read-only access

---

### 3. Import Contacts

**Via Web Interface:**
1. Login to http://localhost:5173
2. Go to "Contacts" → "Upload CSV"
3. Upload CSV file with format:
   ```
   name,phone,tags
   John Doe,+1234567890,customer
   Jane Smith,+0987654321,vip
   ```

**Via API:**
```bash
curl -X POST http://localhost:3000/api/upload/csv \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@contacts.csv"
```

---

### 4. Send Test Message

1. Go to "Send Message"
2. Compose your message
3. Select recipients
4. Click "Send"
5. Check "Messages" to track delivery

---

## 🐳 Alternative: Using Docker (Easier Setup)

If you prefer Docker over manual setup:

### Prerequisites
- Install Docker Desktop: https://www.docker.com/products/docker-desktop

### Steps

1. **Clone the project:**
   ```bash
   git clone https://github.com/thefossco/waha.git
   cd waha
   ```

2. **Create backend/.env:**
   ```bash
   cp backend/.env.example backend/.env
   # Edit backend/.env with your settings
   ```

3. **Start everything:**
   ```bash
   docker-compose up -d --build
   ```

4. **Run migrations:**
   ```bash
   docker-compose exec backend npx prisma migrate deploy
   ```

5. **Create admin user:**
   ```bash
   curl -X POST http://localhost:3000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"name":"Admin","email":"admin@example.com","password":"admin123","role":"ADMIN"}'
   ```

6. **Access:** http://localhost

**That's it!** Much simpler with Docker.

---

## 🔒 Security Recommendations

### For Production Use:

1. **Change default passwords:**
   - Update admin password after first login
   - Use strong, unique passwords

2. **Secure environment variables:**
   ```env
   JWT_SECRET=<random-64-character-string>
   ENCRYPTION_KEY=<random-32-character-string>
   ```

3. **Use HTTPS:**
   - Setup SSL/TLS certificates
   - Use reverse proxy (nginx/Apache)

4. **Database security:**
   - Change PostgreSQL password
   - Don't expose port 5432 to internet

5. **Firewall:**
   - Only allow necessary ports
   - Use VPN for remote access

6. **Regular updates:**
   ```bash
   npm update
   npm audit fix
   ```

---

## 📖 Additional Resources

- **API Documentation:** See `API.md`
- **Docker Setup:** See `DOCKER-LOCALHOST.md`
- **Quick Start:** See `QUICKSTART.md`
- **Network Access:** See `ACCESS.md`

---

## 🆘 Getting Help

If you encounter issues:

1. Check the troubleshooting section above
2. Review application logs:
   ```bash
   # Backend logs
   cd backend
   tail -f logs/error.log
   tail -f logs/combined.log
   ```

3. Check service status:
   ```bash
   # PostgreSQL
   sudo systemctl status postgresql

   # Redis
   redis-cli ping

   # Node processes
   ps aux | grep node
   ```

4. GitHub Issues: https://github.com/thefossco/waha/issues

---

## ✅ Setup Checklist

Use this checklist to track your progress:

- [ ] Node.js 20+ installed
- [ ] PostgreSQL 16+ installed and running
- [ ] Redis 7+ installed and running
- [ ] Git installed
- [ ] Project cloned
- [ ] PostgreSQL database created
- [ ] PostgreSQL user created with permissions
- [ ] Backend .env configured
- [ ] Backend dependencies installed
- [ ] Frontend dependencies installed
- [ ] Prisma client generated
- [ ] Database schema created
- [ ] Backend server running
- [ ] Worker process running
- [ ] Frontend server running
- [ ] Admin user created
- [ ] Successfully logged in
- [ ] Waha API credentials configured

---

**🎉 You're all set! Happy messaging!**
