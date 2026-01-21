# 🚀 Deploy Waha Portal on Dokploy

Complete guide to deploy your Waha Messaging Portal on Dokploy - a self-hosted deployment platform.

---

## 📋 What is Dokploy?

**Dokploy** is a free, open-source deployment platform (like Heroku/Vercel but self-hosted) that makes deploying Docker applications super easy. Perfect for deploying your Waha Portal!

**Benefits:**
- ✅ Easy one-click deployments
- ✅ Automatic SSL certificates
- ✅ Built-in database management
- ✅ Git integration
- ✅ Domain management
- ✅ Free and open-source

---

## 🎯 Prerequisites

Before you start, you need:

1. **A VPS/Server** with:
   - Ubuntu 20.04+ or Debian 11+
   - At least 2GB RAM (4GB recommended)
   - 20GB disk space
   - Root/sudo access

2. **A Domain Name** (optional but recommended):
   - Example: `waha.yourdomain.com`
   - Pointed to your server's IP address

3. **Your Waha API Credentials:**
   - Waha API URL
   - Waha API Key

---

## 📖 Table of Contents

1. [Step 1: Install Dokploy](#step-1-install-dokploy)
2. [Step 2: Access Dokploy Dashboard](#step-2-access-dokploy-dashboard)
3. [Step 3: Push Code to Git](#step-3-push-code-to-git)
4. [Step 4: Create Application in Dokploy](#step-4-create-application-in-dokploy)
5. [Step 5: Configure Environment Variables](#step-5-configure-environment-variables)
6. [Step 6: Deploy the Application](#step-6-deploy-the-application)
7. [Step 7: Set Up Database](#step-7-set-up-database)
8. [Step 8: Configure Domain & SSL](#step-8-configure-domain--ssl)
9. [Step 9: Create Admin User](#step-9-create-admin-user)
10. [Troubleshooting](#troubleshooting)

---

## Step 1: Install Dokploy

### 1.1 Connect to Your Server

```bash
# SSH into your server
ssh root@your-server-ip
```

### 1.2 Install Dokploy

Run the official Dokploy installation script:

```bash
curl -sSL https://dokploy.com/install.sh | sh
```

**What this does:**
- Installs Docker and Docker Compose
- Installs Dokploy
- Sets up SSL with Let's Encrypt
- Starts Dokploy on port 3000

**Installation takes:** 5-10 minutes

### 1.3 Verify Installation

```bash
# Check if Dokploy is running
docker ps | grep dokploy
```

You should see Dokploy containers running.

---

## Step 2: Access Dokploy Dashboard

### 2.1 Open Dokploy

Open your browser and go to:

```
http://your-server-ip:3000
```

Or if you've set up a domain for Dokploy:

```
https://dokploy.yourdomain.com
```

### 2.2 Create Admin Account

On first visit, you'll be asked to create an admin account:

1. **Email:** your-email@example.com
2. **Password:** Choose a strong password
3. Click **"Create Account"**

### 2.3 Login

Login with your credentials.

**✅ You're now in the Dokploy dashboard!**

---

## Step 3: Push Code to Git

Dokploy deploys from Git repositories. Let's make sure your code is pushed.

### 3.1 Check Current Branch

```bash
# On your local machine or server where code is
cd /path/to/waha
git status
```

### 3.2 Commit Any Changes

```bash
# Add all files
git add .

# Commit
git commit -m "Prepare for Dokploy deployment"

# Push to GitHub
git push origin main
```

**Note:** Replace `main` with your branch name if different.

### 3.3 Get Repository URL

Your repository URL should be:
```
https://github.com/thefossco/waha.git
```

Or if private:
```
git@github.com:thefossco/waha.git
```

---

## Step 4: Create Application in Dokploy

### 4.1 Create New Project

1. In Dokploy dashboard, click **"New Project"**
2. Enter project name: `waha-portal`
3. Click **"Create"**

### 4.2 Add Application

1. Click **"Add Application"**
2. Choose **"Docker Compose"**
3. Fill in details:
   - **Name:** `waha-messaging-portal`
   - **Git Provider:** GitHub (or your provider)
   - **Repository URL:** `https://github.com/thefossco/waha.git`
   - **Branch:** `main` (or your branch)
   - **Docker Compose File:** `docker-compose.yml`

4. Click **"Create Application"**

---

## Step 5: Configure Environment Variables

### 5.1 Navigate to Environment Variables

1. Click on your application: `waha-messaging-portal`
2. Go to **"Environment"** tab
3. Click **"Add Variable"**

### 5.2 Add Required Variables

Add these environment variables one by one:

#### Database Configuration

```bash
DATABASE_URL=postgresql://waha:waha_password@postgres:5432/waha_messaging?schema=public
```

#### Redis Configuration

```bash
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=
```

#### Server Configuration

```bash
PORT=3000
NODE_ENV=production
```

#### JWT Configuration

```bash
# Generate a random 64-character string
JWT_SECRET=your-super-secret-jwt-key-change-this-to-random-64-chars-string
JWT_EXPIRES_IN=7d
```

**To generate JWT_SECRET:**
```bash
openssl rand -base64 64
```

#### Encryption Key

```bash
# Must be exactly 32 characters
ENCRYPTION_KEY=your-32-character-encryption-k
```

**To generate ENCRYPTION_KEY:**
```bash
openssl rand -base64 24
```

#### Waha API Configuration

```bash
WAHA_API_URL=https://your-waha-api-url.com
WAHA_API_KEY=your-actual-waha-api-key
```

**⚠️ Important:** Replace with your actual Waha credentials!

#### Rate Limiting (Optional)

```bash
WAHA_RATE_LIMIT_PER_MINUTE=60
MAX_BATCH_SIZE=100
```

#### Upload Settings (Optional)

```bash
MAX_FILE_SIZE_MB=10
UPLOAD_DIR=./uploads
```

#### Retry Settings (Optional)

```bash
MAX_RETRIES=3
RETRY_BACKOFF_MS=1000
```

#### Callback Secret (Optional)

```bash
CALLBACK_SECRET=your-callback-secret-random-string
```

### 5.3 Save Environment Variables

Click **"Save"** after adding all variables.

---

## Step 6: Deploy the Application

### 6.1 Start Deployment

1. In your application dashboard
2. Click **"Deploy"** button
3. Dokploy will:
   - Clone your repository
   - Build Docker images
   - Start all containers
   - Set up networking

**Deployment takes:** 5-10 minutes (first time)

### 6.2 Monitor Deployment

Watch the deployment logs in real-time:

1. Click **"Logs"** tab
2. Select **"Build Logs"** to see build progress
3. Watch for any errors

**Successful deployment shows:**
```
✓ All containers started successfully
✓ Application is running
```

### 6.3 Check Application Status

In the **"Overview"** tab, you should see:
- ✅ postgres: Running
- ✅ redis: Running
- ✅ backend: Running
- ✅ worker: Running
- ✅ frontend: Running

---

## Step 7: Set Up Database

### 7.1 Access Backend Container

1. In Dokploy dashboard, go to **"Containers"**
2. Find **"waha-backend"** container
3. Click **"Console"** or **"Shell"**

### 7.2 Run Database Migrations

In the container shell, run:

```bash
npx prisma migrate deploy
```

Or if migrations don't exist:

```bash
npx prisma db push
```

**Expected output:** "✔ Database is now in sync"

### 7.3 Generate Prisma Client

```bash
npx prisma generate
```

**Exit the console** when done.

---

## Step 8: Configure Domain & SSL

### 8.1 Add Domain

1. Go to **"Domains"** tab in your application
2. Click **"Add Domain"**
3. Enter your domain: `waha.yourdomain.com`
4. Enable **"SSL"** (automatic Let's Encrypt)
5. Click **"Save"**

### 8.2 Update DNS Records

In your domain registrar (Namecheap, GoDaddy, Cloudflare, etc.):

**Add an A record:**
```
Type: A
Name: waha (or @ for root domain)
Value: your-server-ip-address
TTL: 3600
```

**Wait 5-10 minutes** for DNS to propagate.

### 8.3 Verify SSL

Once DNS propagates, Dokploy will automatically:
- ✅ Generate SSL certificate
- ✅ Configure HTTPS
- ✅ Redirect HTTP → HTTPS

**Access your app at:** `https://waha.yourdomain.com`

---

## Step 9: Create Admin User

### 9.1 Access Backend API

Your backend is now running at:
```
https://waha.yourdomain.com/api
```

### 9.2 Create Admin Account

From your local terminal or server:

```bash
curl -X POST https://waha.yourdomain.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@yourdomain.com",
    "password": "ChangeThisPassword123!",
    "role": "ADMIN"
  }'
```

**Response should show:**
```json
{
  "id": "...",
  "name": "Admin User",
  "email": "admin@yourdomain.com",
  "role": "ADMIN",
  "createdAt": "..."
}
```

### 9.3 Login to Portal

1. Open: `https://waha.yourdomain.com`
2. Login with:
   - **Email:** admin@yourdomain.com
   - **Password:** ChangeThisPassword123!

**✅ You're now logged into your deployed Waha Portal!**

---

## 🎉 Deployment Complete!

Your Waha Messaging Portal is now:
- ✅ Deployed on Dokploy
- ✅ Running with HTTPS/SSL
- ✅ Accessible from anywhere
- ✅ Using production database
- ✅ Ready to send messages

---

## 📊 Application URLs

After deployment:

| Service | URL |
|---------|-----|
| **Frontend** | https://waha.yourdomain.com |
| **Backend API** | https://waha.yourdomain.com/api |
| **Health Check** | https://waha.yourdomain.com/api/health |
| **Dokploy Dashboard** | https://dokploy.yourdomain.com:3000 |

---

## 🛠️ Managing Your Deployment

### View Logs

In Dokploy dashboard:
1. Go to your application
2. Click **"Logs"** tab
3. Select service:
   - **backend** - API server logs
   - **worker** - Job processor logs
   - **frontend** - Web server logs

### Restart Services

```bash
# In Dokploy dashboard
Applications → waha-messaging-portal → Restart
```

Or restart specific service:
```bash
# Click on specific container
Containers → waha-backend → Restart
```

### Update Application

When you push new code to GitHub:

1. Git push your changes:
   ```bash
   git add .
   git commit -m "Update feature"
   git push origin main
   ```

2. In Dokploy:
   - Go to application
   - Click **"Deploy"**
   - Dokploy pulls latest code and redeploys

### Scale Services

To handle more traffic:

1. Go to **"Scaling"** tab
2. Increase replicas:
   - Backend: 2-4 instances
   - Worker: 2-3 instances
3. Click **"Apply"**

### Database Backups

#### Manual Backup

```bash
# In Dokploy console or SSH to server
docker exec waha-postgres pg_dump -U waha waha_messaging > backup-$(date +%Y%m%d).sql
```

#### Automatic Backups

1. In Dokploy, go to **"Backups"** tab
2. Enable **"Automatic Backups"**
3. Set schedule: Daily at 2 AM
4. Set retention: Keep 7 days

### Monitor Resources

In Dokploy dashboard:
1. Go to **"Monitoring"** tab
2. View:
   - CPU usage
   - Memory usage
   - Disk usage
   - Network traffic

---

## 🔒 Security Best Practices

### 1. Change Default Passwords

After first login:
1. Go to Profile
2. Change admin password
3. Use strong password (16+ characters)

### 2. Secure Environment Variables

In Dokploy:
- All env vars are encrypted
- Never commit secrets to Git
- Use Dokploy's environment management

### 3. Enable Firewall

```bash
# On your server
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS
ufw allow 3000/tcp  # Dokploy dashboard
ufw enable
```

### 4. Regular Updates

Update your application regularly:
```bash
# Pull latest changes
git pull origin main

# In Dokploy, click "Deploy"
```

### 5. Database Security

- Use strong database password
- Don't expose PostgreSQL port (5432) to public
- Dokploy handles this automatically

### 6. SSL/HTTPS

- Dokploy auto-renews SSL certificates
- Always use HTTPS
- Force HTTPS redirect (enabled by default)

### 7. Backup Strategy

- Daily automated backups
- Store backups in separate location
- Test backup restoration monthly

---

## 📈 Performance Optimization

### 1. Enable Redis Caching

Already configured in docker-compose.yml ✅

### 2. Optimize Database

```bash
# In postgres container
docker exec -it waha-postgres psql -U waha -d waha_messaging

# Run these SQL commands
VACUUM ANALYZE;
REINDEX DATABASE waha_messaging;
```

### 3. Configure Rate Limiting

Already set in environment variables:
- `WAHA_RATE_LIMIT_PER_MINUTE=60`
- Adjust based on your needs

### 4. Use CDN (Optional)

For better performance:
1. Set up Cloudflare
2. Point domain to Cloudflare
3. Enable caching and CDN
4. Keep Dokploy backend as origin

---

## 🐛 Troubleshooting

### Problem: Deployment Failed

**Check build logs:**
1. Dokploy dashboard → Logs → Build Logs
2. Look for error messages
3. Fix issues and redeploy

**Common issues:**
- Missing environment variables
- Docker image build errors
- Port conflicts

**Solution:**
```bash
# Check environment variables are set correctly
# Verify docker-compose.yml is valid
# Restart deployment
```

### Problem: Database Connection Error

**Check:**
1. Database container is running
2. `DATABASE_URL` is correct
3. PostgreSQL is accessible

**Solution:**
```bash
# In Dokploy, restart postgres container
Containers → waha-postgres → Restart

# Check database logs
Logs → postgres
```

### Problem: Can't Access Application

**Check:**
1. All containers are running (Overview tab)
2. Domain DNS is pointing to correct IP
3. SSL certificate is generated

**Solution:**
```bash
# Verify DNS
dig waha.yourdomain.com

# Check if SSL is ready
Domains tab → Check SSL status

# Restart application
Applications → Restart
```

### Problem: SSL Certificate Not Generating

**Check:**
1. Domain points to correct IP
2. Ports 80 and 443 are open
3. No other service using port 80/443

**Solution:**
```bash
# On server, check ports
netstat -tlnp | grep -E ':(80|443)'

# Stop conflicting services
systemctl stop apache2  # if Apache is running
systemctl stop nginx    # if Nginx is running

# In Dokploy, regenerate certificate
Domains → Delete domain → Re-add domain
```

### Problem: Backend API Not Responding

**Check logs:**
```bash
# In Dokploy
Logs → backend

# Look for errors
```

**Common issues:**
- Environment variables missing
- Database connection failed
- Port conflicts

**Solution:**
```bash
# Restart backend
Containers → waha-backend → Restart

# Check health endpoint
curl https://waha.yourdomain.com/api/health
```

### Problem: Worker Not Processing Jobs

**Check:**
1. Redis is running
2. Worker container is running
3. Redis connection settings

**Solution:**
```bash
# Restart Redis
Containers → waha-redis → Restart

# Restart worker
Containers → waha-worker → Restart

# Check worker logs
Logs → worker
```

---

## 📝 Environment Variables Reference

Complete list of environment variables needed:

```bash
# Database (Required)
DATABASE_URL=postgresql://waha:waha_password@postgres:5432/waha_messaging?schema=public

# Redis (Required)
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=

# Server (Required)
PORT=3000
NODE_ENV=production

# JWT (Required)
JWT_SECRET=your-random-64-character-secret
JWT_EXPIRES_IN=7d

# Encryption (Required - exactly 32 chars)
ENCRYPTION_KEY=your-32-character-encryption-k

# Waha API (Required)
WAHA_API_URL=https://your-waha-api.com
WAHA_API_KEY=your-waha-api-key

# Rate Limiting (Optional)
WAHA_RATE_LIMIT_PER_MINUTE=60
MAX_BATCH_SIZE=100

# Upload (Optional)
MAX_FILE_SIZE_MB=10
UPLOAD_DIR=./uploads

# Retry (Optional)
MAX_RETRIES=3
RETRY_BACKOFF_MS=1000

# Callback (Optional)
CALLBACK_SECRET=your-callback-secret
```

---

## 🎓 Next Steps

### 1. Configure Monitoring

Set up monitoring:
- Enable Dokploy monitoring
- Set up alerts for downtime
- Monitor resource usage

### 2. Set Up Additional Users

Create team accounts:
```bash
curl -X POST https://waha.yourdomain.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Team Member",
    "email": "member@yourdomain.com",
    "password": "SecurePassword123!",
    "role": "USER"
  }'
```

### 3. Import Contacts

1. Login to portal
2. Go to Contacts → Upload CSV
3. Import your contact list

### 4. Configure Webhooks

Set up callback URL for delivery status:
```
https://waha.yourdomain.com/api/callbacks/waha
```

Configure this in your Waha API dashboard.

### 5. Test Message Sending

1. Add a test contact
2. Send a test message
3. Verify delivery
4. Check logs for any issues

---

## ✅ Deployment Checklist

- [ ] Dokploy installed on server
- [ ] Dokploy admin account created
- [ ] Code pushed to Git repository
- [ ] Application created in Dokploy
- [ ] All environment variables configured
- [ ] Application deployed successfully
- [ ] All containers running
- [ ] Database migrations completed
- [ ] Domain configured with DNS
- [ ] SSL certificate generated
- [ ] Admin user created
- [ ] Successfully logged into portal
- [ ] Admin password changed
- [ ] Backups configured
- [ ] Monitoring enabled
- [ ] Test message sent successfully

---

## 📚 Additional Resources

- **Dokploy Documentation:** https://docs.dokploy.com
- **Docker Compose Reference:** https://docs.docker.com/compose/
- **PostgreSQL Documentation:** https://www.postgresql.org/docs/
- **Redis Documentation:** https://redis.io/docs/

---

## 🆘 Getting Help

If you encounter issues:

1. **Check Dokploy Logs:**
   - Dashboard → Logs → Select service

2. **Check Container Status:**
   - Dashboard → Containers → Verify all running

3. **Dokploy Discord:**
   - Join: https://discord.gg/dokploy
   - Ask for help in #support

4. **GitHub Issues:**
   - Dokploy: https://github.com/Dokploy/dokploy/issues
   - Your Project: https://github.com/thefossco/waha/issues

---

## 🎊 Congratulations!

Your Waha Messaging Portal is now deployed on Dokploy with:
- ✅ Professional hosting
- ✅ HTTPS/SSL security
- ✅ Automatic deployments
- ✅ Production database
- ✅ Scalable infrastructure
- ✅ Automated backups

**Start sending messages to your customers!** 🚀

---

**Happy Deploying!**
