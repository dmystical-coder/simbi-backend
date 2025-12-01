# 🚀 Production Deployment Guide

## ⚠️ Pre-Deployment Checklist

Before deploying to production, you MUST complete these steps:

### 1. ✅ Security Configuration

- [ ] **JWT Secrets**: Generated secure secrets (already done in `.env.production.example`)
- [ ] **CORS Origins**: Replace `ALLOWED_ORIGINS=*` with your actual frontend domain
- [ ] **Database Password**: Use a strong, unique password for production database
- [ ] **Environment**: Set `ENVIRONMENT=production`

### 2. ✅ Required Services

- [ ] **Production Database**: PostgreSQL database (Neon, Supabase, Railway, etc.)
- [ ] **AI API Keys**: 
  - SIMBI_AI_KEY (contact SIMBI AI service)
  - GROQ_API_KEY (get from https://console.groq.com)
- [ ] **Email Service** (Optional): Brevo API key from https://www.brevo.com

### 3. ✅ Code Review

- [ ] All `.env` values are set correctly
- [ ] No hardcoded secrets in code
- [ ] Error handling is production-ready
- [ ] Logging is configured

---

## 📋 Deployment Options

### Option 1: Railway (Recommended - Easiest)

**Why Railway?** 
- Automatic deployments from GitHub
- Built-in PostgreSQL database
- Free tier available
- Zero configuration SSL

**Steps:**

1. **Push your code to GitHub** (if not already)
   ```bash
   git add .
   git commit -m "Prepare for production deployment"
   git push origin main
   ```

2. **Sign up at Railway**
   - Go to https://railway.app
   - Sign up with GitHub

3. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your `simbi-backend` repository

4. **Add PostgreSQL Database**
   - Click "+ New"
   - Select "Database" → "PostgreSQL"
   - Railway will create a database and provide `DATABASE_URL`

5. **Configure Environment Variables**
   - Go to your service → "Variables"
   - Add all variables from `.env.production.example`:
     ```
     PORT=3000
     DATABASE_URL=(auto-filled by Railway)
     ACCESS_JWT_SECRET=77666910775b749ac8f610cc1ff7c82a2ac635ac47ad745b1475a4b21ff3ab72727e4827cce7859e91c5d298b3ebf9852dfd7e6e82fdfbffddb198cb8a455049
     REFRESH_JWT_SECRET=29ac7f9e6cf9f51031d053edae5fa9c4ff6241c07069531211467a92d477993415c4bf45394d5044ea42f5dfecc5632154a732cfa1973119d5ccc1b0002dc60f
     JWT_EXPIRATION_MINUTES=15
     JWT_EXPIRATION_HOURS=24
     SALT_ROUNDS=12
     API_VERSION=1
     ALLOWED_ORIGINS=https://your-frontend-domain.com
     SIMBI_AI_KEY=your-key
     GROQ_API_KEY=your-key
     ENVIRONMENT=production
     ```

6. **Deploy**
   - Railway will automatically deploy
   - You'll get a URL like: `https://simbi-backend-production.up.railway.app`

7. **Run Migrations**
   - In Railway dashboard, go to your service
   - Click "Settings" → "Deploy"
   - Or SSH and run: `npm run migrate`

---

### Option 2: Render

**Why Render?**
- Free tier with PostgreSQL
- Auto-deploy from GitHub
- Good for side projects

**Steps:**

1. **Sign up at Render**
   - Go to https://render.com
   - Sign up with GitHub

2. **Create Web Service**
   - New → Web Service
   - Connect your GitHub repo
   - Select branch: `main`

3. **Configure Build Settings**
   - Build Command: `npm install && npm run build:prod`
   - Start Command: `npm start`
   - Environment: `Node`

4. **Add PostgreSQL Database**
   - Dashboard → New → PostgreSQL
   - Copy the "Internal Database URL"

5. **Set Environment Variables**
   - Go to your web service → Environment
   - Add all variables from `.env.production.example`
   - Use the PostgreSQL URL from step 4

6. **Deploy**
   - Render will build and deploy automatically
   - You'll get: `https://simbi-backend.onrender.com`

---

### Option 3: Vercel (API Routes Only)

**Note:** Vercel is serverless, better for Next.js. Not ideal for this Express app.

---

### Option 4: DigitalOcean App Platform

**Steps:**

1. Sign up at DigitalOcean
2. Create App → GitHub
3. Select repo
4. Add managed PostgreSQL database
5. Set environment variables
6. Deploy

---

### Option 5: VPS (AWS EC2, DigitalOcean Droplet, etc.)

**For experienced users who want full control:**

1. **Provision Server**
   - Ubuntu 22.04 LTS recommended
   - Minimum: 1GB RAM, 1 CPU

2. **Install Dependencies**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Node.js 20
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt install -y nodejs
   
   # Install PM2 for process management
   sudo npm install -g pm2
   
   # Install PostgreSQL (or use external database)
   sudo apt install -y postgresql postgresql-contrib
   ```

3. **Clone Repository**
   ```bash
   git clone https://github.com/SimbiOrg/simbi-backend.git
   cd simbi-backend
   npm install
   ```

4. **Configure Environment**
   ```bash
   cp .env.production.example .env
   nano .env
   # Fill in all values
   ```

5. **Build and Run Migrations**
   ```bash
   npm run build:prod
   ```

6. **Start with PM2**
   ```bash
   pm2 start dist/server.js --name simbi-backend
   pm2 startup
   pm2 save
   ```

7. **Set up Nginx Reverse Proxy**
   ```bash
   sudo apt install nginx
   sudo nano /etc/nginx/sites-available/simbi-backend
   ```
   
   Add:
   ```nginx
   server {
       listen 80;
       server_name api.yourdomain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```
   
   ```bash
   sudo ln -s /etc/nginx/sites-available/simbi-backend /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

8. **Set up SSL with Let's Encrypt**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d api.yourdomain.com
   ```

---

## 🔒 Security Best Practices

### 1. Environment Variables
- ✅ Never commit `.env` files
- ✅ Use different secrets for dev/staging/production
- ✅ Rotate JWT secrets every 90 days
- ✅ Use strong database passwords

### 2. CORS Configuration
```env
# Development
ALLOWED_ORIGINS=*

# Production - Specific domains only
ALLOWED_ORIGINS=https://app.yourdomain.com,https://www.yourdomain.com
```

### 3. Rate Limiting (TODO)
Add rate limiting to prevent abuse:
```bash
npm install express-rate-limit
```

### 4. Helmet for Security Headers (TODO)
```bash
npm install helmet
```

---

## 🧪 Testing Production Setup

### 1. Health Check
```bash
curl https://your-production-url.com/
```

Expected:
```json
{
  "status": "success",
  "message": "Welcome to Simbi-Backend"
}
```

### 2. Test Signup
```bash
curl -X POST https://your-production-url.com/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User"
  }'
```

### 3. Test Login
```bash
curl -X POST https://your-production-url.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

---

## 📊 Monitoring & Logging

### Recommended Tools:
- **Logging**: Winston, Pino, or built-in console
- **Monitoring**: Railway/Render dashboard, PM2 monitoring
- **Error Tracking**: Sentry (https://sentry.io)
- **Uptime Monitoring**: UptimeRobot (https://uptimerobot.com)

### Add Sentry (Optional):
```bash
npm install @sentry/node
```

---

## 🔄 CI/CD Pipeline (Optional)

### GitHub Actions Example:
Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '20'
      - run: npm install
      - run: npm run build
      - run: npm test # if you have tests
```

---

## 📝 Post-Deployment Checklist

- [ ] Health check endpoint returns 200
- [ ] Signup works
- [ ] Login works and returns tokens
- [ ] Protected routes require authentication
- [ ] CORS allows frontend domain
- [ ] Database migrations applied
- [ ] SSL certificate active (HTTPS)
- [ ] Environment variables set correctly
- [ ] Monitoring/logging configured
- [ ] Error tracking enabled
- [ ] Backups configured for database

---

## 🆘 Troubleshooting

### Issue: "Cannot connect to database"
**Solution:** Check `DATABASE_URL` is correct and database is running

### Issue: "CORS error from frontend"
**Solution:** Add frontend domain to `ALLOWED_ORIGINS`

### Issue: "502 Bad Gateway"
**Solution:** Server not running or wrong port configuration

### Issue: "Module not found"
**Solution:** Run `npm install` and `npm run build`

---

## 🎯 Quick Deployment (Railway)

**The fastest way to deploy:**

```bash
# 1. Install Railway CLI
npm install -g @railway/cli

# 2. Login
railway login

# 3. Initialize project
railway init

# 4. Add PostgreSQL
railway add --database postgres

# 5. Deploy
railway up

# 6. Set environment variables
railway variables set ACCESS_JWT_SECRET="77666910775b749ac8f610cc1ff7c82a2ac635ac47ad745b1475a4b21ff3ab72727e4827cce7859e91c5d298b3ebf9852dfd7e6e82fdfbffddb198cb8a455049"
railway variables set REFRESH_JWT_SECRET="29ac7f9e6cf9f51031d053edae5fa9c4ff6241c07069531211467a92d477993415c4bf45394d5044ea42f5dfecc5632154a732cfa1973119d5ccc1b0002dc60f"
railway variables set ALLOWED_ORIGINS="https://your-frontend.com"
railway variables set ENVIRONMENT="production"

# Done! Get your URL:
railway domain
```

---

## 📞 Support

After deployment, share with your frontend team:
- ✅ Production API URL
- ✅ Updated API_DOCS.md
- ✅ Any rate limits or restrictions
- ✅ Expected response times

---

**Ready to deploy? Start with Railway for the easiest setup!** 🚀
