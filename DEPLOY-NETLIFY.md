# 🚀 Deploy to Netlify

This guide will help you deploy the Waha Messaging Portal frontend to Netlify.

## 📋 Overview

- **Frontend:** Deployed to Netlify (free tier available)
- **Backend:** Needs separate hosting (Railway, Render, Heroku, etc.)
- **Database:** Hosted with backend or separate service

## 🎯 Quick Deploy Steps

### Step 1: Deploy Backend First

You need to deploy the backend to a hosting service that supports Node.js. Choose one:

#### **Option A: Railway (Recommended - Free)**

1. Go to [railway.app](https://railway.app)
2. Sign in with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your `waha` repository
5. Railway will auto-detect the backend
6. Add these environment variables in Railway:
   ```
   DATABASE_URL=<provided by Railway Postgres>
   REDIS_HOST=<provided by Railway Redis>
   JWT_SECRET=your-secret-key
   ENCRYPTION_KEY=your-32-char-key
   PORT=3001
   NODE_ENV=production
   ```
7. Deploy and note your backend URL (e.g., `https://waha-backend.up.railway.app`)

#### **Option B: Render (Free tier)**

1. Go to [render.com](https://render.com)
2. Create new "Web Service"
3. Connect your GitHub repo
4. Root Directory: `backend`
5. Build Command: `npm install && npx prisma generate`
6. Start Command: `npm start`
7. Add environment variables
8. Note your backend URL

#### **Option C: Heroku**

```bash
# Install Heroku CLI and login
heroku login

# Create app
heroku create waha-backend

# Add buildpack
heroku buildpacks:set heroku/nodejs

# Set root directory
heroku config:set PROJECT_PATH=backend

# Add Postgres
heroku addons:create heroku-postgresql:mini

# Add Redis
heroku addons:create heroku-redis:mini

# Deploy
git push heroku claude/bulk-messaging-portal-BgqCu:main
```

### Step 2: Deploy Frontend to Netlify

#### **Method 1: Using Netlify UI (Easiest)**

1. **Push your code to GitHub:**
   ```bash
   git push origin claude/bulk-messaging-portal-BgqCu
   ```

2. **Go to [Netlify](https://netlify.com) and sign in**

3. **Click "Add new site" → "Import an existing project"**

4. **Connect to GitHub and select your repository**

5. **Configure build settings:**
   - **Base directory:** `frontend`
   - **Build command:** `npm run build`
   - **Publish directory:** `frontend/dist`

6. **Add environment variable:**
   - Key: `VITE_API_URL`
   - Value: Your backend URL (e.g., `https://waha-backend.up.railway.app/api`)

7. **Click "Deploy site"**

8. **Wait for deployment** (2-3 minutes)

9. **Your site is live!** (e.g., `https://random-name-123.netlify.app`)

#### **Method 2: Using Netlify CLI**

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Navigate to frontend
cd frontend

# Build
npm run build

# Deploy
netlify deploy --prod

# Follow prompts:
# - Create & configure new site
# - Publish directory: dist
```

#### **Method 3: Deploy with netlify.toml (Auto)**

The `netlify.toml` file is already configured. Just:

1. Connect your GitHub repo to Netlify
2. Netlify will automatically detect the configuration
3. Set the `VITE_API_URL` environment variable
4. Deploy!

### Step 3: Configure Environment Variables

In Netlify dashboard:

1. Go to **Site settings** → **Environment variables**
2. Add:
   ```
   VITE_API_URL = https://your-backend-url.com/api
   ```
3. Redeploy if needed

### Step 4: Update Backend CORS

Update your backend to allow Netlify domain:

In `backend/src/index.ts`, update CORS:

```typescript
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://your-app.netlify.app',
    // Add your custom domain if you have one
  ]
}));
```

---

## 🎯 Full Stack Deployment Options

### **Option 1: Netlify + Railway**
- ✅ Frontend: Netlify (Free)
- ✅ Backend: Railway (Free tier)
- ✅ Database: Railway Postgres (Free)
- ✅ Redis: Railway Redis (Free)
- 💰 **Cost:** FREE

### **Option 2: Netlify + Render**
- ✅ Frontend: Netlify (Free)
- ✅ Backend: Render (Free tier)
- ✅ Database: Render Postgres (Free)
- ✅ Redis: Render Redis or Upstash
- 💰 **Cost:** FREE

### **Option 3: All-in-One with Vercel**
- Deploy both frontend and backend to Vercel
- Use Vercel Postgres and Redis
- Single deployment

---

## 🔧 Environment Variables Reference

### Backend (Railway/Render/Heroku)

```env
DATABASE_URL=postgresql://user:pass@host:5432/dbname
REDIS_HOST=your-redis-host
REDIS_PORT=6379
PORT=3001
NODE_ENV=production
JWT_SECRET=your-super-secret-jwt-key
ENCRYPTION_KEY=your-32-character-encryption-key
WAHA_API_URL=https://your-waha-api
WAHA_API_KEY=your-waha-api-key
```

### Frontend (Netlify)

```env
VITE_API_URL=https://your-backend-url.com/api
```

---

## 🐛 Troubleshooting

### Backend Not Connecting

1. Check backend is deployed and running
2. Verify `VITE_API_URL` in Netlify matches your backend URL
3. Check CORS settings in backend
4. View Netlify deploy logs

### Build Fails

```bash
# Clear cache and rebuild
netlify build --clear-cache
```

### API Calls Failing

1. Open browser console (F12)
2. Check Network tab for API calls
3. Verify the API URL is correct
4. Check if backend is running

---

## 📊 Deployment Checklist

- [ ] Backend deployed and running
- [ ] Database migrations completed
- [ ] Admin user created
- [ ] Frontend built successfully
- [ ] `VITE_API_URL` set in Netlify
- [ ] CORS configured in backend
- [ ] Custom domain connected (optional)
- [ ] SSL enabled (automatic on Netlify)
- [ ] Environment variables secured

---

## 🎉 Your URLs

After deployment:

- **Frontend:** https://your-app.netlify.app
- **Backend:** https://your-backend.railway.app/api
- **Login:** admin@example.com / admin123

---

## 💡 Custom Domain (Optional)

### On Netlify:

1. Go to **Domain settings**
2. Click **Add custom domain**
3. Follow DNS configuration steps
4. SSL is automatic!

---

## 🔒 Security Checklist

Before going live:

- [ ] Change default admin password
- [ ] Update `JWT_SECRET` to strong random value
- [ ] Update `ENCRYPTION_KEY` to strong random value
- [ ] Enable 2FA for hosting accounts
- [ ] Review CORS settings
- [ ] Set up database backups
- [ ] Configure rate limiting
- [ ] Review audit logs regularly

---

## 📈 Monitoring

### Netlify:

- View deploy logs in dashboard
- Enable deploy notifications
- Set up analytics

### Backend:

- Use Railway/Render logs
- Set up error tracking (Sentry)
- Monitor API performance

---

## 🚀 Next Steps

1. **Deploy backend to Railway/Render**
2. **Deploy frontend to Netlify**
3. **Test the application**
4. **Invite users**
5. **Monitor and scale as needed**

Need help? Check the main [README.md](README.md) for more details!
