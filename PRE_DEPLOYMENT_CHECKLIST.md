# ✅ Pre-Deployment Checklist

Use this checklist before deploying to production.

## 🔒 Security & Configuration

- [ ] **JWT Secrets Generated**
  - Secure random ACCESS_JWT_SECRET (128 characters)
  - Secure random REFRESH_JWT_SECRET (128 characters)
  - Secrets are in `.env.production.example`

- [ ] **CORS Configured**
  - Replace `ALLOWED_ORIGINS=*` with your actual frontend domain(s)
  - Example: `ALLOWED_ORIGINS=https://app.simbi.com`

- [ ] **Database Setup**
  - Production PostgreSQL database ready
  - Connection string updated in `.env.production`
  - Database credentials are secure

- [ ] **Environment Set**
  - `ENVIRONMENT=production` is set

- [ ] **API Keys Configured**
  - SIMBI_AI_KEY obtained and set
  - GROQ_API_KEY obtained and set
  - BREVO_API_KEY set (if using email)

## 📋 Required Actions

### 1. Get API Keys

**GROQ API Key:**
1. Go to https://console.groq.com
2. Sign up/login
3. Create API key
4. Copy and add to `.env.production`

**SIMBI AI Key:**
- Contact SIMBI AI service provider
- Add key to `.env.production`

**Brevo Email (Optional):**
1. Go to https://www.brevo.com
2. Sign up for free account
3. Get API key from Settings → API Keys
4. Add to `.env.production`

### 2. Set Up Production Database

**Option A: Use Existing Neon Database**
- Your current connection string works
- Just remove `&channel_binding=require` parameter
- Verify it's not on free tier (check limits)

**Option B: Create New Production Database**

**Railway (Recommended):**
- Automatic with deployment
- $5/month for database
- Unlimited connections

**Supabase:**
1. Go to https://supabase.com
2. Create new project
3. Get connection string
4. Add to `.env.production`

**Neon:**
1. Go to https://neon.tech
2. Create production project
3. Use paid tier for production
4. Get connection string

### 3. Update CORS for Frontend

In `.env.production`:
```env
# Single domain
ALLOWED_ORIGINS=https://app.yourdomain.com

# Multiple domains (comma-separated)
ALLOWED_ORIGINS=https://app.yourdomain.com,https://www.yourdomain.com

# Include staging if needed
ALLOWED_ORIGINS=https://app.yourdomain.com,https://staging.yourdomain.com
```

## 🚀 Deployment Steps

### Recommended: Railway

**Why Railway?**
✅ Easiest setup
✅ Auto-deploys from GitHub
✅ Built-in PostgreSQL
✅ Free $5 monthly credit
✅ Automatic SSL

**Steps:**
1. Push code to GitHub
2. Go to https://railway.app
3. New Project → Deploy from GitHub
4. Add PostgreSQL service
5. Set environment variables (copy from `.env.production.example`)
6. Deploy automatically runs
7. Get production URL

**Time:** ~10 minutes

### Alternative: Render

**Steps:**
1. Push code to GitHub
2. Go to https://render.com
3. New Web Service → Connect repo
4. Build Command: `npm install && npm run build:prod`
5. Start Command: `npm start`
6. Add PostgreSQL database
7. Set environment variables
8. Deploy

**Time:** ~15 minutes

## 📝 Environment Variables Checklist

Copy these to your deployment platform:

```env
# Required
✓ PORT=3000
✓ DATABASE_URL=postgresql://...
✓ DATABASE_URL_TEST=postgresql://...
✓ ACCESS_JWT_SECRET=(use generated value)
✓ REFRESH_JWT_SECRET=(use generated value)
✓ JWT_EXPIRATION_MINUTES=15
✓ JWT_EXPIRATION_HOURS=24
✓ SALT_ROUNDS=12
✓ API_VERSION=1
✓ ALLOWED_ORIGINS=https://your-frontend.com
✓ ENVIRONMENT=production

# AI Services (Required)
✓ SIMBI_AI_KEY=your-key
✓ GROQ_API_KEY=your-key

# Email (Optional)
◯ BREVO_API_KEY=your-key
◯ BREVO_EMAIL_USER=noreply@yourdomain.com
```

## 🧪 Testing After Deployment

### 1. Health Check
```bash
curl https://your-production-url.com/
```
Expected: `{"status":"success","message":"Welcome to Simbi-Backend"}`

### 2. Test Signup
```bash
curl -X POST https://your-production-url.com/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@test.com","password":"test123","firstName":"Test","lastName":"User"}'
```
Expected: `{"status":"success","message":"User created successfully",...}`

### 3. Test Login
```bash
curl -X POST https://your-production-url.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'
```
Expected: Access and refresh tokens returned

### 4. Test Protected Endpoint
```bash
curl https://your-production-url.com/api/v1/users/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```
Expected: User profile returned

## 🎯 Quick Start (Copy-Paste Ready)

### If using Railway:

1. **Install Railway CLI:**
```bash
npm install -g @railway/cli
```

2. **Deploy:**
```bash
railway login
railway init
railway add --database postgres
railway up
```

3. **Set environment variables:**
```bash
railway variables set ACCESS_JWT_SECRET="77666910775b749ac8f610cc1ff7c82a2ac635ac47ad745b1475a4b21ff3ab72727e4827cce7859e91c5d298b3ebf9852dfd7e6e82fdfbffddb198cb8a455049"
railway variables set REFRESH_JWT_SECRET="29ac7f9e6cf9f51031d053edae5fa9c4ff6241c07069531211467a92d477993415c4bf45394d5044ea42f5dfecc5632154a732cfa1973119d5ccc1b0002dc60f"
railway variables set ENVIRONMENT="production"
railway variables set ALLOWED_ORIGINS="https://your-frontend-domain.com"
railway variables set SIMBI_AI_KEY="your-key"
railway variables set GROQ_API_KEY="your-key"
railway variables set API_VERSION="1"
railway variables set SALT_ROUNDS="12"
railway variables set JWT_EXPIRATION_MINUTES="15"
railway variables set JWT_EXPIRATION_HOURS="24"
```

4. **Get your URL:**
```bash
railway domain
```

Done! 🎉

## ⚠️ CRITICAL - Before Going Live

- [ ] All tests pass
- [ ] Database migrations applied
- [ ] HTTPS/SSL enabled (automatic on Railway/Render)
- [ ] Monitoring set up
- [ ] Backup strategy in place
- [ ] Frontend team has production API URL
- [ ] API documentation shared
- [ ] Rate limiting considered (future improvement)
- [ ] Error tracking configured (Sentry recommended)

## 📊 What to Share with Frontend Team

After successful deployment, provide:

1. **Production API URL**
   - Example: `https://simbi-backend-production.up.railway.app`

2. **API Documentation**
   - Share `API_DOCS.md`
   - Base URL updated

3. **CORS Configuration**
   - Confirm their domain is in `ALLOWED_ORIGINS`

4. **Rate Limits** (if any)
   - Currently: No limits
   - Consider adding in future

5. **Support Contact**
   - How to report issues
   - Where to check API status

## 🔄 Post-Deployment

### Monitor These:
- Server uptime
- Database connections
- Error rates
- Response times
- Memory/CPU usage

### Set Up:
- [ ] Uptime monitoring (UptimeRobot, Pingdom)
- [ ] Error tracking (Sentry)
- [ ] Log aggregation (if using VPS)
- [ ] Automated backups

## 🆘 If Something Goes Wrong

### Rollback Plan:
1. Check deployment logs
2. Verify environment variables
3. Test database connection
4. Check CORS settings
5. Roll back to previous deployment if needed

### Common Issues:

**"Cannot connect to database"**
→ Check DATABASE_URL, verify database is running

**"CORS error"**
→ Add frontend domain to ALLOWED_ORIGINS

**"502 Bad Gateway"**
→ Server crashed, check logs

**"Module not found"**
→ Dependencies not installed, run build again

---

## ✅ You're Ready When:

- [x] All checkboxes above are checked
- [x] Test endpoints return successful responses
- [x] Frontend can connect without CORS errors
- [x] Database is accessible
- [x] SSL/HTTPS is active
- [x] Monitoring is configured

**Estimated Time to Deploy: 15-30 minutes**

**Recommended Platform: Railway** (easiest setup, auto-scaling, built-in database)

---

Good luck with your deployment! 🚀
