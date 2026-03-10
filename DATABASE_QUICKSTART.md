# 🚀 Quick Start: Database Connection Setup

## 🎯 Your database is now configured for **PostgreSQL (Neon)**

The schema has been updated from SQLite → PostgreSQL. Follow these steps to get connected:

---

## ✅ STEP 1: Get Free Neon Database (5 minutes)

### Option A: Automated Setup (Recommended)
```bash
npm run db:setup
```
This wizard will guide you through the entire process!

### Option B: Manual Setup

1. **Sign up at Neon:**
   - Go to: https://neon.tech
   - Click "Sign up" (free, no credit card needed)
   - Use GitHub login for instant access

2. **Create Project:**
   - Click "Create Project"
   - Project Name: `ric-sau`
   - Region: `US East (Ohio)` or closest to you
   - PostgreSQL Version: 16
   - Click "Create Project"

3. **Copy Connection String:**
   - After creation, you'll see connection details
   - Copy the **"Pooled"** connection string
   - It looks like: `postgresql://username:password@ep-xxx.us-east-2.aws.neon.tech:5432/neondb?sslmode=require`

4. **Create .env.local file:**
   ```bash
   # Copy the template
   copy .env.local.template .env.local
   
   # Or on Mac/Linux
   cp .env.local.template .env.local
   ```

5. **Edit .env.local:**
   - Open `.env.local` in your editor
   - Replace the DATABASE_URL value with your real Neon connection string
   - Save the file

---

## ✅ STEP 2: Initialize Database

Run these commands in order:

```bash
# 1. Test connection
npm run db:test

# 2. Create tables in database
npm run db:push

# 3. Add initial data (admin user + sample content)
npm run db:seed
```

---

## ✅ STEP 3: Start Development

```bash
# Start the dev server
npm run dev
```

Visit: http://localhost:3000/login

**Default Credentials:**
- Username: `admin`
- Password: `admin123`

---

## 🛠️ Helpful Commands

```bash
npm run db:setup      # Automated setup wizard
npm run db:test       # Test database connection
npm run db:push       # Push schema changes
npm run db:seed       # Seed initial data
npm run db:studio     # Visual database editor
npm run check:neon    # Verify Neon configuration
```

---

## 🌐 For Netlify Deployment

See [NEON_DATABASE_SETUP.md](./NEON_DATABASE_SETUP.md) for complete deployment instructions.

**Quick summary:**
1. Get Neon connection string (same as above)
2. Add to Netlify: **Site Settings** → **Environment Variables**
   - `DATABASE_URL` = your Neon connection string
   - `JWT_SECRET` = any random string
   - `SETUP_SECRET` = any random string
3. Deploy site
4. Visit: `https://your-site.netlify.app/api/setup-db?secret=your-setup-secret`
5. Login with admin/admin123

---

## ❓ Troubleshooting

### "DATABASE_URL is not set"
- Make sure `.env.local` file exists in the project root
- Check that it contains `DATABASE_URL="postgresql://..."`

### "Connection refused" or "ENOTFOUND"
- Verify the connection string is correct (no typos)
- Make sure you copied the **Pooled** connection string from Neon
- Check your internet connection

### "SSL required" error
- Your connection string must end with `?sslmode=require`
- Copy the full connection string from Neon (it includes this automatically)

### "Authentication failed"
- Username or password in connection string is wrong
- Copy the connection string again from Neon dashboard

### Need more help?
Run the diagnostic wizard:
```bash
npm run db:setup
```

Or check the detailed guides:
- [NEON_DATABASE_SETUP.md](./NEON_DATABASE_SETUP.md) - Complete Neon guide
- [FIX_DATABASE_CONNECTION.md](./FIX_DATABASE_CONNECTION.md) - Troubleshooting
- [DATABASE_SETUP.md](./DATABASE_SETUP.md) - General database info

---

## 📝 What Changed?

✅ **Schema updated:** SQLite → PostgreSQL
✅ **New scripts added:** db:test, db:setup, check:neon
✅ **Helper tools created:** Connection tester, setup wizard
✅ **Documentation added:** Comprehensive guides

Your project is now ready for production deployment on Netlify! 🎉

---

**Need help?** Open an issue or check the documentation files listed above.
