# Quick Deploy Checklist for Netlify

## ✅ Pre-Deploy Steps (Run Locally)

```bash
# 1. Make sure database is set up
npm run db:test

# 2. Build the project to test
npm run build

# 3. Commit all changes
git add .
git commit -m "Ready for Netlify deployment"
git push
```

---

## 🚀 Deploy Steps (5 Minutes)

### 1. Get Your Neon Connection String

From your local `.env.local`:
```bash
# Windows
Get-Content .env.local | Select-String "DATABASE_URL"

# Mac/Linux
grep DATABASE_URL .env.local
```

Copy the full connection string (starts with `postgresql://`)

### 2. Go to Netlify

**URL:** https://app.netlify.com

- Click **"Add new site"** → **"Import an existing project"**
- Choose **GitHub**
- Select repository: **ric-sau**

### 3. Configure Build

Leave defaults:
- Build command: `npm run build` ✓
- Publish directory: `.next` ✓
- Click **"Show advanced"**

### 4. Add Environment Variables

Click **"New variable"** for each:

| Key | Value |
|-----|-------|
| `DATABASE_URL` | `postgresql://user:pass@ep-xxx.neon.tech:5432/neondb?sslmode=require` |
| `JWT_SECRET` | Any random string (32+ characters) |
| `SETUP_SECRET` | Any secret key (e.g., `setup-123`) |
| `NEXT_PUBLIC_BASE_URL` | Leave blank for now |
| `NEXT_PUBLIC_SITE_URL` | Leave blank for now |

**Click "Deploy site"**

### 5. Wait for Build (2-3 minutes)

Watch the deploy log. When done, you'll see:
```
✓ Site is live
```

Your site URL will be: `https://something-random-123.netlify.app`

### 6. Update Site URLs

Go back to: **Site settings** → **Environment variables**

Edit these two:
- `NEXT_PUBLIC_BASE_URL` = Your actual Netlify URL
- `NEXT_PUBLIC_SITE_URL` = Your actual Netlify URL

Click **Deploys** → **Trigger deploy** → **Deploy site**

### 7. Initialize Database

Visit (replace with YOUR site URL and secret):
```
https://your-site.netlify.app/api/setup-db?secret=setup-123
```

Should see:
```json
{
  "success": true,
  "message": "✅ Database setup completed successfully!"
}
```

### 8. Login & Test

Go to: `https://your-site.netlify.app/login`

- Username: `admin`
- Password: `admin123`

✅ **DONE!** You're live on Netlify! 🎉

---

## 🔄 To Update Your Site

```bash
# Make your changes
git add .
git commit -m "Updated content"
git push
```

Netlify auto-deploys! ⚡

---

## 🆘 Quick Fixes

### "Build failed"
Check Node.js version in Netlify:
- Go to **Site settings** → **Environment variables**
- Add: `NODE_VERSION = 18`

### "Database error"
Test connection:
```
https://your-site.netlify.app/api/diagnose
```

### "Can't login"
Make sure you ran the setup route:
```
https://your-site.netlify.app/api/setup-db?secret=YOUR_SECRET
```

---

**Need detailed help?** See [DEPLOY_TO_NETLIFY.md](./DEPLOY_TO_NETLIFY.md)
