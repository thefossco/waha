# 🚀 Deploy Waha to Railway + Netlify

Your Railway URL: **waha-production-cfdd.up.railway.app**

## Step 1: Configure Railway Backend

### 1.1 Set Root Directory
In Railway dashboard:
1. Go to your service settings
2. Click "Settings" → "Source"
3. Set **Root Directory**: `backend`
4. Save changes

### 1.2 Add Environment Variables
In Railway dashboard → Variables, add:

```env
DATABASE_URL=${DATABASE_URL}
REDIS_URL=${REDIS_URL}
PORT=3001
NODE_ENV=production
JWT_SECRET=waha-super-secret-jwt-key-change-in-production
ENCRYPTION_KEY=waha-32-character-encryption-k
WAHA_API_URL=https://api.waha.example
WAHA_API_KEY=your-waha-api-key
WAHA_RATE_LIMIT_PER_MINUTE=60
MAX_BATCH_SIZE=100
MAX_FILE_SIZE_MB=10
UPLOAD_DIR=./uploads
MAX_RETRIES=3
RETRY_BACKOFF_MS=1000
CALLBACK_SECRET=waha-callback-secret
```

### 1.3 Add PostgreSQL and Redis
In Railway:
1. Click "+ New" → "Database" → "Add PostgreSQL"
2. Click "+ New" → "Database" → "Add Redis"
3. Railway will automatically add DATABASE_URL and REDIS_URL

### 1.4 Configure Build
In Settings → Deploy:
- **Build Command**: `npm install && npx prisma generate && npm run build`
- **Start Command**: `npm start`

### 1.5 Redeploy
Click "Deploy" to restart with new configuration

### 1.6 Run Migrations
In Railway CLI or dashboard:
```bash
railway run npx prisma migrate deploy
```

Or using Railway's "One-off Command":
```bash
npx prisma migrate deploy
```

### 1.7 Create Admin User
Run this command in Railway:
```bash
npx ts-node -e "
const axios = require('axios');
axios.post('https://waha-production-cfdd.up.railway.app/api/auth/register', {
  name: 'Admin User',
  email: 'admin@example.com',
  password: 'admin123',
  role: 'ADMIN'
}).then(() => console.log('User created')).catch(console.error);
"
```

Or use curl after backend is running:
```bash
curl -X POST https://waha-production-cfdd.up.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Admin","email":"admin@example.com","password":"admin123","role":"ADMIN"}'
```

---

## Step 2: Deploy Frontend to Netlify

### Method 1: Netlify UI (Easiest)

1. **Go to [app.netlify.com](https://app.netlify.com)**

2. **Click "Add new site" → "Import an existing project"**

3. **Connect to GitHub**:
   - Authorize Netlify
   - Select repository: `thefossco/waha`
   - Select branch: `claude/bulk-messaging-portal-BgqCu`

4. **Build settings**:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`
   - **Node version**: `20`

5. **Environment variables**:
   Click "Show advanced" → "New variable"
   ```
   Key: VITE_API_URL
   Value: https://waha-production-cfdd.up.railway.app/api
   ```

6. **Click "Deploy site"**

7. **Wait 2-3 minutes** for build and deployment

8. **Your site is live!** (e.g., `https://random-name-123.netlify.app`)

### Method 2: Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Build frontend locally
cd frontend
npm install
VITE_API_URL=https://waha-production-cfdd.up.railway.app/api npm run build

# Deploy
netlify deploy --prod --dir=dist

# Follow prompts to create new site or link existing
```

### Method 3: Direct Build & Deploy

```bash
cd frontend

# Install dependencies
npm install

# Build with production API URL
VITE_API_URL=https://waha-production-cfdd.up.railway.app/api npm run build

# The dist/ folder is ready to deploy to any static host
```

---

## Step 3: Configure CORS on Backend

Update `backend/src/index.ts` to allow your Netlify domain:

```typescript
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://your-app.netlify.app', // Replace with actual Netlify URL
    'https://waha-production-cfdd.up.railway.app'
  ],
  credentials: true
}));
```

Redeploy Railway backend after updating CORS.

---

## Verification Checklist

- [ ] Railway backend is running
- [ ] Database is connected (PostgreSQL)
- [ ] Redis is connected
- [ ] Migrations completed
- [ ] Admin user created
- [ ] Backend health check: `https://waha-production-cfdd.up.railway.app/api/health`
- [ ] Frontend deployed to Netlify
- [ ] VITE_API_URL environment variable set
- [ ] CORS configured
- [ ] Can login at Netlify URL

---

## Testing

Once deployed, test these URLs:

**Backend Health:**
```bash
curl https://waha-production-cfdd.up.railway.app/api/health
```

**Create Admin User:**
```bash
curl -X POST https://waha-production-cfdd.up.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Admin","email":"admin@example.com","password":"admin123","role":"ADMIN"}'
```

**Frontend:**
Open your Netlify URL and login with:
- Email: admin@example.com
- Password: admin123

---

## Troubleshooting

### Backend 404 Error
- Check Root Directory is set to `backend` in Railway
- Verify build command completed successfully
- Check Railway logs for errors

### Frontend Can't Connect to Backend
- Verify VITE_API_URL in Netlify environment variables
- Check CORS settings in backend
- Open browser console (F12) to see exact error

### Database Connection Error
- Ensure PostgreSQL is added in Railway
- Verify DATABASE_URL variable exists
- Check database is running

### Build Fails
- Check Node version is 20
- Verify all dependencies install correctly
- Review build logs in Railway/Netlify

---

## Quick Commands

**Railway CLI:**
```bash
# Install
npm install -g @railway/cli

# Login
railway login

# Link to project
railway link

# View logs
railway logs

# Run command
railway run npx prisma migrate deploy
```

**Check Backend:**
```bash
curl https://waha-production-cfdd.up.railway.app/api/health
```

**Netlify Redeploy:**
In Netlify dashboard → Deploys → Trigger deploy

---

## Your URLs

- **Backend:** https://waha-production-cfdd.up.railway.app
- **API Endpoint:** https://waha-production-cfdd.up.railway.app/api
- **Frontend:** (Your Netlify URL after deployment)
- **Login:** admin@example.com / admin123
