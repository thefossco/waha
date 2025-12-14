# 🌐 How to Access the Waha Messaging Portal

The application is **RUNNING** successfully!

## ✅ Server Status

- **Backend API:** Running on port 3000
- **Frontend UI:** Running on port 5173
- **Database:** PostgreSQL on port 5432
- **Cache:** Redis on port 6379

## 📍 Access URLs

### Local Access (on the server)
- Frontend: http://localhost:5173
- Backend: http://localhost:3000/api

### Network Access
- Frontend: http://21.0.0.192:5173
- Backend: http://21.0.0.192:3000/api

## 🔐 Login Credentials

```
Email: admin@example.com
Password: admin123
```

## 🛠️ Access Methods

### Method 1: Direct Browser Access (if on the same machine)
Simply open: **http://localhost:5173**

### Method 2: SSH Port Forwarding (if remote)
On your local machine, run:
```bash
ssh -L 5173:localhost:5173 -L 3000:localhost:3000 user@your-server-ip
```
Then open: **http://localhost:5173** in your local browser

### Method 3: VS Code / Cloud IDE
1. Look for the **PORTS** tab (bottom panel)
2. Ports 3000 and 5173 should be listed
3. Click the 🌐 globe icon next to port 5173
4. Or right-click → "Open in Browser"

### Method 4: GitHub Codespaces
Ports are auto-forwarded. Look for the "Ports" tab or notification.

### Method 5: ngrok (Public Temporary URL)
```bash
# Install ngrok first, then:
ngrok http 5173

# Use the https URL provided by ngrok
```

### Method 6: Cloudflare Tunnel (Free Public URL)
```bash
# Install cloudflared, then:
cloudflared tunnel --url http://localhost:5173

# Use the *.trycloudflare.com URL provided
```

## 🧪 Test the API (from terminal)

```bash
# Health check
curl http://localhost:3000/api/health

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'
```

## 🔍 Troubleshooting

### Can't connect?

1. **Check servers are running:**
```bash
ps aux | grep -E "tsx|vite" | grep -v grep
```

2. **Test local access:**
```bash
curl http://localhost:5173
curl http://localhost:3000/api/health
```

3. **Check logs:**
```bash
tail -f /tmp/backend.log
tail -f /tmp/frontend.log
```

4. **Restart if needed:**
```bash
# Stop
pkill -f "tsx watch"
pkill -f "vite"

# Start
cd /home/user/waha/backend && npm run dev > /tmp/backend.log 2>&1 &
cd /home/user/waha/frontend && npm run dev > /tmp/frontend.log 2>&1 &
```

## 📱 What You'll See

Once connected, you'll see:
1. **Login page** - Enter credentials above
2. **Dashboard** - View message statistics
3. **Navigation menu** - Access all features:
   - Contacts - Add/import contacts
   - Groups - Manage contact groups
   - Templates - Message templates
   - Send - Compose and send messages
   - Messages - View message history

## 💡 Tips

- The app is a **Single Page Application (SPA)**
- Backend API is on port 3000
- Frontend dev server is on port 5173
- All data is stored in PostgreSQL
- Messages are queued in Redis for processing

## 🚀 Ready to Use!

The application is fully functional and waiting for you to access it through one of the methods above!
