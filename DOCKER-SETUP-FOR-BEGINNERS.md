# 🐳 Waha Portal Setup with Docker Desktop - For Beginners

**A super simple guide to get your Waha Messaging Portal running in 10 minutes!**

No coding experience needed. Just follow the steps exactly as written.

---

## 📋 What You Need

- A computer (Windows, Mac, or Linux)
- Internet connection
- 10-15 minutes of time

**That's it!** Docker will handle everything else automatically.

---

## 🎯 Step-by-Step Setup

### Step 1: Install Docker Desktop

Docker Desktop is free software that runs applications in containers (like virtual machines, but lighter).

#### **For Windows:**

1. **Download Docker Desktop:**
   - Go to: https://www.docker.com/products/docker-desktop
   - Click **"Download for Windows"**
   - Wait for download to complete

2. **Install Docker Desktop:**
   - Double-click the downloaded file: `Docker Desktop Installer.exe`
   - Click **"Yes"** if Windows asks for permission
   - Click **"OK"** to use recommended settings
   - Wait for installation (takes 2-5 minutes)
   - Click **"Close and restart"** when asked

3. **Start Docker Desktop:**
   - After restart, find **Docker Desktop** icon on your desktop
   - Double-click to open it
   - Wait for Docker to start (you'll see a whale icon in your taskbar)
   - When the whale icon stops animating, Docker is ready!

#### **For Mac:**

1. **Download Docker Desktop:**
   - Go to: https://www.docker.com/products/docker-desktop
   - Click **"Download for Mac"**
   - Choose your Mac type:
     - **Intel chip** → Click "Mac with Intel chip"
     - **Apple Silicon (M1/M2/M3)** → Click "Mac with Apple chip"
   - Wait for download to complete

2. **Install Docker Desktop:**
   - Open your **Downloads** folder
   - Double-click **Docker.dmg**
   - Drag **Docker** icon into **Applications** folder
   - Close the installer window

3. **Start Docker Desktop:**
   - Open **Finder** → **Applications**
   - Double-click **Docker**
   - Click **"Open"** if Mac asks for confirmation
   - Wait for Docker to start
   - When you see "Docker Desktop is running" - you're ready!

#### **For Linux (Ubuntu/Debian):**

1. **Open Terminal** (Press Ctrl+Alt+T)

2. **Copy and paste these commands one by one:**

```bash
# Update system
sudo apt-get update

# Install required packages
sudo apt-get install -y ca-certificates curl gnupg lsb-release

# Add Docker's official GPG key
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# Set up Docker repository
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Start Docker
sudo systemctl start docker
sudo systemctl enable docker

# Add your user to docker group
sudo usermod -aG docker $USER

# Log out and log back in for changes to take effect
```

3. **Verify Docker is running:**
```bash
docker --version
```
You should see something like: `Docker version 24.x.x`

---

### Step 2: Download the Waha Portal Project

Now we'll download the project files.

#### **For Windows:**

1. **Install Git (if you don't have it):**
   - Go to: https://git-scm.com/download/win
   - Download and install
   - Just click "Next" through all options

2. **Open Command Prompt:**
   - Press **Windows Key + R**
   - Type: `cmd`
   - Press **Enter**

3. **Download the project:**
   ```cmd
   cd C:\Users\%USERNAME%\Desktop
   git clone https://github.com/thefossco/waha.git
   cd waha
   ```

**Result:** You now have a `waha` folder on your Desktop!

#### **For Mac:**

1. **Open Terminal:**
   - Press **Command + Space**
   - Type: `Terminal`
   - Press **Enter**

2. **Download the project:**
   ```bash
   cd ~/Desktop
   git clone https://github.com/thefossco/waha.git
   cd waha
   ```

**Result:** You now have a `waha` folder on your Desktop!

#### **For Linux:**

1. **Open Terminal** (Press Ctrl+Alt+T)

2. **Download the project:**
   ```bash
   cd ~/Desktop
   git clone https://github.com/thefossco/waha.git
   cd waha
   ```

**Result:** You now have a `waha` folder on your Desktop!

---

### Step 3: Configure the Application

We need to create a configuration file. Don't worry, it's easy!

#### **Windows:**

1. **In Command Prompt (from Step 2), type:**
   ```cmd
   cd backend
   copy .env.example .env
   notepad .env
   ```

2. **Notepad will open.** You'll see a configuration file.

3. **Look for these lines and update them:**

   Find this line:
   ```
   WAHA_API_URL=https://api.waha.example
   ```
   Change to your actual Waha API URL (or leave it for now)

   Find this line:
   ```
   WAHA_API_KEY=your-waha-api-key
   ```
   Change to your actual Waha API key (or leave it for now)

4. **Save and close:**
   - Click **File** → **Save**
   - Close Notepad

#### **Mac/Linux:**

1. **In Terminal, type:**
   ```bash
   cd backend
   cp .env.example .env
   nano .env
   ```

2. **Nano editor will open.** You'll see a configuration file.

3. **Use arrow keys to navigate. Update these lines:**

   Find:
   ```
   WAHA_API_URL=https://api.waha.example
   ```
   Change to your actual Waha API URL (or leave it for now)

   Find:
   ```
   WAHA_API_KEY=your-waha-api-key
   ```
   Change to your actual Waha API key (or leave it for now)

4. **Save and exit:**
   - Press **Ctrl + O** (save)
   - Press **Enter** (confirm)
   - Press **Ctrl + X** (exit)

**Note:** You can leave the default values for now and change them later!

---

### Step 4: Start the Application

This is the easiest part! Docker will automatically:
- Download all required software
- Set up the database
- Set up the cache
- Start all services

#### **Windows:**

1. **In Command Prompt, go back to main folder:**
   ```cmd
   cd ..
   ```

2. **Start everything:**
   ```cmd
   docker-compose up -d --build
   ```

3. **Wait 3-5 minutes** while Docker downloads and builds everything.

   You'll see lots of text scrolling. This is normal! ✅

4. **When you see "done" - it's ready!**

#### **Mac/Linux:**

1. **In Terminal, go back to main folder:**
   ```bash
   cd ..
   ```

2. **Start everything:**
   ```bash
   docker-compose up -d --build
   ```

3. **Wait 3-5 minutes** while Docker downloads and builds everything.

4. **When you see "done" - it's ready!**

---

### Step 5: Set Up the Database

We need to create the database tables. Super easy!

#### **Windows:**
```cmd
docker-compose exec backend npx prisma migrate deploy
```

#### **Mac/Linux:**
```bash
docker-compose exec backend npx prisma migrate deploy
```

**Expected output:** You'll see "Database sync complete" or similar message.

---

### Step 6: Create Your Admin Account

Let's create your admin login!

#### **Windows:**

Open Command Prompt and paste this (all at once):

```cmd
curl -X POST http://localhost:3000/api/auth/register -H "Content-Type: application/json" -d "{\"name\":\"Admin User\",\"email\":\"admin@example.com\",\"password\":\"admin123\",\"role\":\"ADMIN\"}"
```

**Don't have curl?** Install it or use PowerShell instead:

```powershell
Invoke-RestMethod -Uri http://localhost:3000/api/auth/register -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"name":"Admin User","email":"admin@example.com","password":"admin123","role":"ADMIN"}'
```

#### **Mac/Linux:**

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

**Success!** You'll see a response with your user details.

---

### Step 7: Open the Application

🎉 **You're ready!**

1. **Open your web browser** (Chrome, Firefox, Safari, Edge - any browser)

2. **Go to:** http://localhost

3. **Login with:**
   - **Email:** admin@example.com
   - **Password:** admin123

**🎊 Congratulations! Your Waha Portal is running!**

---

## 🎯 What Can You Do Now?

### 1. Change Your Password

1. Login to http://localhost
2. Click on your name (top right)
3. Click **"Profile"** or **"Settings"**
4. Change password
5. Save

### 2. Add Contacts

1. Click **"Contacts"** in the menu
2. Click **"Add Contact"**
3. Fill in:
   - Name
   - Phone number (with country code, like +1234567890)
   - Tags (optional)
4. Click **"Save"**

### 3. Import Contacts from CSV

1. Create a file called `contacts.csv` on your computer
2. Add this format:
   ```
   name,phone,tags
   John Doe,+1234567890,customer
   Jane Smith,+0987654321,vip,important
   Bob Wilson,+1122334455,customer
   ```

3. In the portal:
   - Click **"Contacts"**
   - Click **"Upload CSV"** or **"Import"**
   - Select your `contacts.csv` file
   - Click **"Upload"**

4. All contacts will be imported!

### 4. Create a Group

1. Click **"Groups"**
2. Click **"Create Group"**
3. Enter group name (e.g., "VIP Customers")
4. Select contacts to add
5. Click **"Create"**

### 5. Create Message Templates

1. Click **"Templates"**
2. Click **"Create Template"**
3. Enter:
   - Template name
   - Message text
4. Click **"Save"**

Now you can reuse this template when sending messages!

### 6. Send Messages

1. Click **"Send Message"**
2. Choose how to send:
   - **Single Contact:** Select one contact
   - **Group:** Select a group
   - **Upload CSV:** Upload a list of phone numbers
3. Write your message or select a template
4. Click **"Send"**

### 7. Track Messages

1. Click **"Messages"**
2. See all sent messages
3. Click on any message to see:
   - Delivery status
   - Read receipts
   - Errors (if any)

---

## 🔄 Daily Usage

### Starting the Portal

If you restart your computer or shut down Docker, here's how to start again:

#### **Windows:**
1. Open **Docker Desktop** (double-click icon)
2. Wait for Docker to start
3. Open **Command Prompt**
4. Type:
   ```cmd
   cd C:\Users\%USERNAME%\Desktop\waha
   docker-compose up -d
   ```
5. Go to: http://localhost

#### **Mac:**
1. Open **Docker Desktop** from Applications
2. Wait for Docker to start
3. Open **Terminal**
4. Type:
   ```bash
   cd ~/Desktop/waha
   docker-compose up -d
   ```
5. Go to: http://localhost

#### **Linux:**
```bash
cd ~/Desktop/waha
docker-compose up -d
```
Then go to: http://localhost

### Stopping the Portal

When you're done for the day:

#### **All Systems:**
```bash
docker-compose down
```

**Or:** Just quit Docker Desktop (it will stop everything automatically)

---

## 🛠️ Useful Commands

### Check if Everything is Running

```bash
docker-compose ps
```

You should see:
- ✅ waha-postgres (database)
- ✅ waha-redis (cache)
- ✅ waha-backend (API server)
- ✅ waha-worker (job processor)
- ✅ waha-frontend (web interface)

All should say "Up" or "running"

### View Logs

**See all logs:**
```bash
docker-compose logs -f
```

**See specific service logs:**
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f worker
```

**Stop viewing logs:** Press **Ctrl + C**

### Restart Everything

```bash
docker-compose restart
```

### Restart One Service

```bash
docker-compose restart backend
docker-compose restart frontend
docker-compose restart worker
```

### Stop and Remove Everything (Fresh Start)

```bash
docker-compose down -v
docker-compose up -d --build
```

**Warning:** This deletes all data! You'll need to create admin user again.

---

## 🆘 Troubleshooting

### Problem: "Port is already in use"

**Solution:**

1. **Stop everything:**
   ```bash
   docker-compose down
   ```

2. **Check what's using the port:**

   **Windows:**
   ```cmd
   netstat -ano | findstr :80
   netstat -ano | findstr :3000
   ```

   **Mac/Linux:**
   ```bash
   lsof -i :80
   lsof -i :3000
   ```

3. **Kill the process or change ports:**

   Edit `docker-compose.yml`:
   ```yaml
   frontend:
     ports:
       - "8080:80"  # Changed from 80 to 8080

   backend:
     ports:
       - "3001:3000"  # Changed from 3000 to 3001
   ```

   Now access at: http://localhost:8080

---

### Problem: "Can't connect to http://localhost"

**Check:**

1. **Is Docker running?**
   - Look for Docker icon in taskbar/menu bar
   - Should not have an "X" or error symbol

2. **Are containers running?**
   ```bash
   docker-compose ps
   ```
   All should say "Up"

3. **Restart everything:**
   ```bash
   docker-compose down
   docker-compose up -d
   ```

4. **Check logs for errors:**
   ```bash
   docker-compose logs
   ```

---

### Problem: "Docker Desktop won't start"

**Windows:**
1. Restart your computer
2. Open Docker Desktop as Administrator (right-click → Run as Administrator)
3. Check Windows has WSL 2 installed:
   - Open PowerShell as Administrator
   - Run: `wsl --install`
   - Restart computer

**Mac:**
1. Open **System Preferences** → **Security & Privacy**
2. Check if Docker needs permission
3. Restart your Mac
4. Try opening Docker Desktop again

**Linux:**
```bash
sudo systemctl restart docker
```

---

### Problem: "Database migration failed"

**Solution:**

```bash
# Reset database
docker-compose down -v
docker-compose up -d
sleep 10
docker-compose exec backend npx prisma migrate deploy
```

---

### Problem: "Can't create admin user"

**Wait a moment, then try again:**

```bash
# Wait 30 seconds for backend to be fully ready
sleep 30

# Try creating user again
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Admin User","email":"admin@example.com","password":"admin123","role":"ADMIN"}'
```

---

### Problem: "Forgot admin password"

**Create a new admin user:**

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"New Admin","email":"newadmin@example.com","password":"newpassword123","role":"ADMIN"}'
```

Then login with: newadmin@example.com / newpassword123

---

## 🔒 Security Tips

### 1. Change Default Password

**After first login:**
1. Go to Profile/Settings
2. Change password
3. Use strong password (at least 12 characters)

### 2. Use Strong Secrets

Edit `backend/.env`:

```env
# Generate random secrets
JWT_SECRET=put-a-long-random-string-here-at-least-32-characters
ENCRYPTION_KEY=exactly-32-characters-needed-here!
```

**To generate random strings:**

**Mac/Linux:**
```bash
openssl rand -base64 32
```

**Windows PowerShell:**
```powershell
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | % {[char]$_})
```

### 3. Don't Expose to Internet

By default, the portal only works on **localhost** (your computer only).

**To access from local network only:**
- Use a firewall
- Don't port-forward from your router
- Don't deploy to public servers without proper security

### 4. Regular Backups

**Backup your database:**

```bash
# Export database
docker-compose exec postgres pg_dump -U waha waha_messaging > backup.sql

# To restore later:
docker-compose exec -T postgres psql -U waha waha_messaging < backup.sql
```

---

## 📊 Understanding What's Running

When you run `docker-compose up -d`, Docker starts 5 containers:

| Container | What it Does | Port |
|-----------|-------------|------|
| **waha-postgres** | Database - Stores all your data (users, contacts, messages) | 5432 |
| **waha-redis** | Cache - Speeds up the app and manages job queue | 6379 |
| **waha-backend** | API Server - Handles all requests from frontend | 3000 |
| **waha-worker** | Background Jobs - Sends messages in the background | - |
| **waha-frontend** | Web Interface - The website you see | 80 |

All containers talk to each other automatically. You only need to access:
- **http://localhost** (frontend)

---

## 🎓 Next Steps

### 1. Configure Waha API

To actually send messages, you need Waha API credentials:

1. Get API credentials from your Waha provider
2. Edit `backend/.env`:
   ```env
   WAHA_API_URL=https://your-waha-api.com
   WAHA_API_KEY=your-actual-api-key
   ```
3. Restart backend:
   ```bash
   docker-compose restart backend worker
   ```

### 2. Create More Users

Create users for your team:

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Team Member",
    "email": "member@example.com",
    "password": "password123",
    "role": "USER"
  }'
```

**Roles:**
- **ADMIN** - Full access (can do everything)
- **USER** - Can send messages, manage contacts
- **VIEWER** - Can only view (read-only)

### 3. Import Your Contacts

1. Export contacts from your phone/CRM as CSV
2. Format as:
   ```
   name,phone,tags
   John,+1234567890,customer
   ```
3. Upload via web interface

### 4. Test Sending Messages

1. Add a test contact (your own number)
2. Send a test message
3. Check "Messages" to see delivery status

---

## ✅ Quick Checklist

Use this to track your setup:

- [ ] Docker Desktop installed
- [ ] Docker Desktop started and running
- [ ] Project downloaded to Desktop
- [ ] `.env` file created in backend folder
- [ ] Ran `docker-compose up -d --build`
- [ ] Ran `npx prisma migrate deploy`
- [ ] Admin user created
- [ ] Can login at http://localhost
- [ ] Password changed from default
- [ ] Waha API credentials configured (if ready)
- [ ] Test message sent successfully

---

## 🎉 You Did It!

Congratulations! You now have your own Waha Messaging Portal running on your computer using Docker!

**Remember:**
- Start: Open Docker Desktop → `docker-compose up -d`
- Access: http://localhost
- Stop: `docker-compose down`

**Need help?** Check the troubleshooting section or refer to other guides in the project.

---

## 📚 More Resources

- **Full Setup Guide:** See `SETUP-GUIDE.md` for manual setup without Docker
- **API Documentation:** See `API.md` for API usage
- **Quick Start:** See `QUICKSTART.md`
- **Network Access:** See `ACCESS.md` for accessing from other devices

---

**Happy Messaging! 🚀**
