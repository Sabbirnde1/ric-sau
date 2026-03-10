# 🚨 Netlify Login Troubleshooting Guide

## Problem: Login Not Working on Netlify

If you're experiencing login issues on your Netlify deployment, follow these steps to diagnose and fix the problem.

---

## 🔍 Step 1: Run Diagnostics

Visit this URL in your browser to identify the exact issue:

```
https://YOUR-SITE.netlify.app/api/diagnose
```

Replace `YOUR-SITE` with your actual Netlify site name.

**Example:**
```
https://ric-sau-demo.netlify.app/api/diagnose
```

This will show you:
- ✅ Which checks passed
- ❌ What's wrong
- 💡 Specific solutions for your issues

---

## 🛠️ Common Issues & Solutions

### Issue #1: Database Not Initialized

**Symptoms:**
- Diagnostic shows: "No users in database"
- Login returns: "Invalid username or password"
- Database user count: 0

**Solution:**

1. **Add SETUP_SECRET environment variable:**
   - Netlify → Site settings → Environment variables
   - Add: `SETUP_SECRET` = `your-secret-123`
   - Save and redeploy

2. **Initialize database:**
   ```
   https://YOUR-SITE.netlify.app/api/setup-db?secret=your-secret-123
   ```

3. **Verify success:**
   ```json
   {
     "success": true,
     "message": "Database setup completed"
   }
   ```

4. **Login with default credentials:**
   - Username: `admin`
   - Password: `admin123`

---

### Issue #2: DATABASE_URL Not Set

**Symptoms:**
- Diagnostic shows: "DATABASE_URL: ❌ Missing"
- Login error: "Database connection failed"
- Cannot connect to database

**Solution:**

1. **Get PostgreSQL database:**
   - [Neon.tech](https://neon.tech) (free) ⭐
   - [Supabase.com](https://supabase.com) (free)
   - [Railway.app](https://railway.app)

2. **Copy connection string:**
   ```
   postgresql://user:password@host.region.neon.tech:5432/database?sslmode=require
   ```

3. **Add to Netlify:**
   - Site settings → Environment variables
   - Add: `DATABASE_URL` = `your-connection-string`
   - Save

4. **Redeploy site:**
   - Deploys → Trigger deploy → Deploy site

---

### Issue #3: Database Tables Don't Exist

**Symptoms:**
- Diagnostic shows: "User table does not exist"
- Login error: "Database not initialized"
- Error code: P2021

**Solution:**

This means migrations weren't run. Two options:

**Option A: Use Setup Route (Easiest)**
1. Visit `/api/setup-db?secret=YOUR_SETUP_SECRET`
2. This creates tables AND populates data

**Option B: Manual Migration**
1. Clone repository locally
2. Set DATABASE_URL in `.env.local`
3. Run: `npx prisma migrate deploy`
4. Run: `npm run db:seed`

---

### Issue #4: JWT_SECRET Not Set

**Symptoms:**
- Diagnostic shows: "JWT_SECRET: ❌ Missing"
- Login might work but sessions fail
- Dashboard access issues

**Solution:**

1. **Generate secret:**
   ```bash
   openssl rand -base64 32
   ```
   Or use any secure random string

2. **Add to Netlify:**
   - Site settings → Environment variables
   - Add: `JWT_SECRET` = `your-generated-secret`
   - Save and redeploy

---

### Issue #5: Wrong Credentials

**Symptoms:**
- Database is initialized
- User exists
- Still can't login

**Check:**

1. **Are you using correct default credentials?**
   - Username: `admin` (not "admin@ric-sau.com")
   - Password: `admin123`

2. **Did you change the password?**
   - If you already changed it, use new password
   - Check Prisma Studio to verify: `npx prisma studio`

3. **Is username spelled correctly?**
   - Case-sensitive!
   - No extra spaces

---

### Issue #6: Environment Variables Not Applied

**Symptoms:**
- Added environment variables
- Site still shows missing variables
- Login still fails

**Solution:**

Environment variables only apply to NEW deployments:

1. Go to **Deploys**
2. Click **Trigger deploy**
3. Select **Deploy site**
4. Wait for deployment to complete
5. Try again

**Note:** Simply adding environment variables doesn't automatically redeploy!

---

## 📋 Complete Checklist

Go through this checklist in order:

### ✅ Environment Variables Set

- [ ] `DATABASE_URL` - PostgreSQL connection string
- [ ] `JWT_SECRET` - Secure random string
- [ ] `SETUP_SECRET` - Secret for initial setup (optional)
- [ ] `NEXT_PUBLIC_BASE_URL` - Your Netlify site URL
- [ ] `NEXT_PUBLIC_SITE_URL` - Your Netlify site URL

### ✅ Database Setup

- [ ] PostgreSQL database created
- [ ] Database accessible from internet
- [ ] Tables created (via migration or setup route)
- [ ] Admin user exists in database
- [ ] Can connect to database from local machine

### ✅ Deployment

- [ ] Site deployed successfully to Netlify
- [ ] No build errors in deploy log
- [ ] Functions are working (check Functions tab)
- [ ] Environment variables applied (redeploy after adding)

### ✅ Initialization

- [ ] Visited `/api/diagnose` - shows all checks passed
- [ ] Visited `/api/setup-db` (if database was empty)
- [ ] Can see admin user in database (Prisma Studio)
- [ ] Settings exist in database (for logo)

### ✅ Login Test

- [ ] Go to `/login` page
- [ ] Username: `admin`
- [ ] Password: `admin123`
- [ ] Click Login
- [ ] Redirected to `/dashboard`

---

## 🔧 Advanced Troubleshooting

### Check Netlify Function Logs

1. Netlify Dashboard → **Functions**
2. Click on the function (e.g., `___netlify-handler`)
3. View real-time logs
4. Look for errors when trying to login

Common errors to look for:
- `Connection refused` - Database not accessible
- `P2021` - Tables don't exist
- `Invalid password` - Wrong credentials
- `Cannot find module` - Build issue

### Check Browser Console

1. Open browser DevTools (F12)
2. Go to Console tab
3. Try to login
4. Look for errors

Common errors:
- `Failed to fetch` - API route not working
- `500 Internal Server Error` - Server-side issue
- `401 Unauthorized` - Wrong credentials
- Network errors - Connection issues

### Test Database Connection Locally

Use the same DATABASE_URL locally:

```bash
# Create .env.local
echo "DATABASE_URL=your-production-url" > .env.local

# Test connection
npx prisma studio

# Try to login locally
npm run dev
# Visit http://localhost:3000/login
```

If it works locally but not on Netlify, the issue is with Netlify configuration.

### Check Database from PostgreSQL Client

Use a database client to verify data:

**Tools:**
- [Prisma Studio](https://www.prisma.io/studio): `npx prisma studio`
- [TablePlus](https://tableplus.com/)
- [DBeaver](https://dbeaver.io/)
- psql command-line

**What to check:**
1. Database has tables (User, Settings, etc.)
2. User table has at least one admin user
3. Admin user has a `password` field (hashed)
4. Settings table has a record

**SQL Queries:**
```sql
-- Check if tables exist
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

-- Check users
SELECT id, username, email, role FROM "User";

-- Check if admin exists
SELECT * FROM "User" WHERE username = 'admin';

-- Check settings
SELECT * FROM "Settings";
```

---

## 🆘 Still Not Working?

If you've tried everything above and login still doesn't work:

### 1. Start Fresh

**Option A: Reset Database**
- Delete all data from database
- Run `/api/setup-db?secret=YOUR_SETUP_SECRET` again
- Try login with default credentials

**Option B: New Database**
- Create a brand new PostgreSQL database
- Update DATABASE_URL in Netlify
- Redeploy
- Initialize with setup route

### 2. Verify Deployment

Check that everything deployed correctly:

```bash
# Via Netlify CLI
netlify status
netlify build --context production

# Check if API routes exist
curl https://your-site.netlify.app/api/diagnose
curl -X POST https://your-site.netlify.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### 3. Check for Deployment Errors

Look at build logs:
- Netlify Dashboard → Deploys
- Click on latest deploy
- Scroll through deploy log
- Look for:
  - Database connection errors
  - Prisma generation errors
  - Missing dependencies
  - Build failures

---

## 📞 Get Help

If you're still stuck:

1. **Run diagnostics and save output:**
   ```
   https://your-site.netlify.app/api/diagnose
   ```
   Copy the entire JSON response

2. **Check Netlify function logs** and copy errors

3. **Gather information:**
   - What error message do you see?
   - What have you tried?
   - What does `/api/diagnose` show?
   - Are environment variables set?
   - Was database initialized?

4. **Review documentation:**
   - [DATABASE_SETUP.md](./DATABASE_SETUP.md)
   - [NETLIFY_DEPLOYMENT.md](./NETLIFY_DEPLOYMENT.md)
   - [QUICK_FIX.md](./QUICK_FIX.md)

---

## 🎯 Quick Command Reference

**Visit diagnostic page:**
```
https://YOUR-SITE.netlify.app/api/diagnose
```

**Initialize database:**
```
https://YOUR-SITE.netlify.app/api/setup-db?secret=YOUR_SETUP_SECRET
```

**Default login:**
- Username: `admin`
- Password: `admin123`

**Netlify environment variables:**
```
Site settings → Environment variables → Add variable
```

**Trigger new deploy:**
```
Deploys → Trigger deploy → Deploy site
```

---

*Last Updated: March 10, 2026*
