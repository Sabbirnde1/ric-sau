# 🚀 Neon Database Setup for RIC-SAU

## Quick Setup (5 Minutes)

### Step 1: Create Neon Account & Database

1. **Go to Neon:** https://neon.tech
2. **Sign Up:** Click "Sign up" (recommend using GitHub for instant access)
3. **Create Project:**
   - Click "Create Project"
   - Project Name: `ric-sau`
   - Region: Choose closest to your users (e.g., `US East (Ohio)` for USA)
   - PostgreSQL Version: 16 (latest)
   - Click "Create Project"

### Step 2: Get Your Connection String

After project creation, you'll see your connection details:

```
Connection String (Pooled):
postgresql://username:password@ep-random-123.us-east-2.aws.neon.tech:5432/neondb?sslmode=require
```

**Copy the entire "Connection String (Pooled)"** - this is your `DATABASE_URL`

### Step 3: Add to Netlify

#### Via Netlify Dashboard:

1. Go to your Netlify site dashboard
2. **Site settings** → **Environment variables**
3. Click **Add a variable**
4. Add:
   ```
   Key: DATABASE_URL
   Value: postgresql://username:password@ep-xxx.region.aws.neon.tech:5432/neondb?sslmode=require
   ```
5. Click **Save**

#### Also Add These Variables:

```env
JWT_SECRET=your-secure-random-string-here
SETUP_SECRET=your-setup-key-123
NEXT_PUBLIC_BASE_URL=https://your-site.netlify.app
NEXT_PUBLIC_SITE_URL=https://your-site.netlify.app
```

### Step 4: Deploy Site

1. Go to **Deploys** tab
2. Click **Trigger deploy** → **Deploy site**
3. Wait for deployment to complete

### Step 5: Initialize Database

Visit this URL (replace with your actual values):

```
https://your-site.netlify.app/api/setup-db?secret=your-setup-key-123
```

You should see:
```json
{
  "success": true,
  "message": "✅ Database setup completed successfully!",
  "data": {
    "defaultCredentials": {
      "username": "admin",
      "password": "admin123"
    }
  }
}
```

### Step 6: Login

Go to: `https://your-site.netlify.app/login`

- Username: `admin`
- Password: `admin123`

✅ **Done!**

---

## 🎯 Neon Features

### Why Neon for This Project?

- ✅ **Free Tier:** 0.5 GB storage, 10 branches
- ✅ **Serverless:** Perfect for Netlify
- ✅ **Auto-pause:** Saves resources when inactive
- ✅ **Instant Branching:** Create dev/staging databases
- ✅ **No Credit Card:** Truly free to start
- ✅ **Great Performance:** Fast response times

### Free Tier Limits

- **Storage:** 0.5 GB
- **Compute:** 100 hours/month (auto-pause saves hours)
- **Branches:** 10 branches
- **Perfect for:** Small to medium sites like RIC-SAU

---

## 🔧 Local Development with Neon

You can use the same Neon database for local development:

### Option 1: Use Production Database

```bash
# .env.local
DATABASE_URL=postgresql://username:password@ep-xxx.neon.tech:5432/neondb?sslmode=require
```

**Pros:** Same data as production
**Cons:** Could accidentally modify production data

### Option 2: Create Branch Database

Neon allows database branches (like Git branches):

1. In Neon dashboard → Click **Branches**
2. Click **Create branch**
3. Name: `development`
4. Copy branch connection string
5. Use in `.env.local`

**Pros:** Separate dev data, safe testing
**Cons:** Uses another branch from your limit

### Option 3: Use SQLite Locally

```bash
# .env.local
DATABASE_URL=file:./dev.db
```

**Pros:** Fast, no network needed
**Cons:** Need to seed data separately

---

## 📊 Manage Your Neon Database

### View Data in Neon Console

1. Go to Neon dashboard
2. Click on your project
3. Click **SQL Editor**
4. Run queries:
   ```sql
   -- See all users
   SELECT * FROM "User";
   
   -- See all news
   SELECT * FROM "News";
   
   -- Check settings
   SELECT * FROM "Settings";
   ```

### View Data with Prisma Studio

```bash
# Make sure DATABASE_URL is set in .env.local
npx prisma studio
```

Opens at http://localhost:5555 with a visual interface

### Backup Your Data

**Export from Neon:**
1. Neon dashboard → Your project
2. **Settings** → **Backup**
3. Download backup

**Or use pg_dump:**
```bash
pg_dump "postgresql://user:pass@ep-xxx.neon.tech:5432/neondb" > backup.sql
```

### Reset Database

If you need to start fresh:

**Option 1: Delete & Recreate Project**
1. Neon dashboard → Project settings → Delete project
2. Create new project
3. Update DATABASE_URL in Netlify
4. Redeploy and run setup

**Option 2: Drop All Tables**
```sql
-- In Neon SQL Editor
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
```
Then run `/api/setup-db` again

---

## 🔐 Security Best Practices

### 1. Never Commit Connection Strings

❌ **Don't:**
```javascript
const db = 'postgresql://user:pass@host/db';
```

✅ **Do:**
```javascript
const db = process.env.DATABASE_URL;
```

### 2. Use Different Databases for Environments

- **Production:** Main Neon project
- **Staging:** Branch database
- **Development:** Another branch or SQLite

### 3. Rotate Passwords

In Neon dashboard:
1. Go to **Settings** → **Reset password**
2. Update DATABASE_URL in Netlify
3. Redeploy

### 4. Monitor Usage

Check your usage in Neon dashboard to avoid hitting limits.

---

## 🐛 Troubleshooting

### Error: "Connection refused"

**Cause:** Wrong connection string or Neon service down

**Fix:**
1. Verify connection string is correct
2. Check Neon status: https://neon.tech/status
3. Try regenerating connection string in Neon dashboard

### Error: "SSL required"

**Cause:** Missing `?sslmode=require` parameter

**Fix:** Add `?sslmode=require` to end of connection string:
```
postgresql://user:pass@host/db?sslmode=require
```

### Error: "Too many connections"

**Cause:** Connection pooling issue

**Fix:** Use the **Pooled** connection string from Neon (default), not direct connection

### Slow Queries

**Cause:** Database auto-paused (cold start on free tier)

**Fix:**
- First query after pause takes ~200-500ms
- Subsequent queries are fast
- Upgrade to paid tier for always-on compute

---

## 📈 Scaling with Neon

### When to Upgrade?

Free tier is sufficient until you reach:
- 0.5 GB storage
- High traffic requiring always-on compute
- Need for more branches
- Need for point-in-time recovery

### Paid Tiers

**Pro Plan ($19/month):**
- 10 GB storage
- Unlimited compute hours
- Always-on compute
- Point-in-time recovery

**Custom:**
- Contact Neon for enterprise needs

---

## 🎓 Learning Resources

**Neon Documentation:**
- Quickstart: https://neon.tech/docs/get-started-with-neon
- Branching: https://neon.tech/docs/guides/branching
- Prisma Guide: https://neon.tech/docs/guides/prisma

**Prisma Documentation:**
- Getting Started: https://www.prisma.io/docs/getting-started
- Schema Reference: https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference

---

## ✅ Quick Checklist

- [ ] Created Neon account at neon.tech
- [ ] Created project named `ric-sau`
- [ ] Copied **Pooled** connection string
- [ ] Connection string includes `?sslmode=require`
- [ ] Added DATABASE_URL to Netlify environment variables
- [ ] Added JWT_SECRET to Netlify
- [ ] Added SETUP_SECRET to Netlify
- [ ] Triggered new Netlify deployment
- [ ] Visited `/api/setup-db?secret=your-secret`
- [ ] Saw success message
- [ ] Can login with admin/admin123
- [ ] Logo shows after uploading in settings

---

## 🆘 Need Help?

1. **Run diagnostics:**
   ```
   https://your-site.netlify.app/api/diagnose
   ```

2. **Check guides:**
   - [FIX_DATABASE_CONNECTION.md](./FIX_DATABASE_CONNECTION.md)
   - [DATABASE_SETUP.md](./DATABASE_SETUP.md)
   - [LOGIN_TROUBLESHOOTING.md](./LOGIN_TROUBLESHOOTING.md)

3. **Neon Support:**
   - Community: https://community.neon.tech
   - Discord: https://discord.gg/neon

---

**Your Neon database is ready! 🎉**

*Last Updated: March 10, 2026*
