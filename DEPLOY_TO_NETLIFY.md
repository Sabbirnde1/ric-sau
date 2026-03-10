# 🚀 Deploy to Netlify - Quick Guide

## ✅ Prerequisites

Before deploying, make sure you have:
- [x] Neon PostgreSQL database created (from `npm run setup`)
- [x] Database connection string ready
- [x] All changes committed to GitHub

---

## 🎯 Method 1: GitHub Auto-Deploy (Recommended - 5 minutes)

### Step 1: Push to GitHub

```bash
git add .
git commit -m "Ready for Netlify deployment"
git push
```

### Step 2: Connect to Netlify

1. Go to: **https://app.netlify.com**
2. Click **"Add new site"** → **"Import an existing project"**
3. Choose **GitHub** and authorize
4. Select your repository: `ric-sau`
5. Configure build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `.next`
   - Click **"Show advanced"**

### Step 3: Add Environment Variables

Click **"New variable"** for each:

```env
DATABASE_URL = postgresql://user:pass@ep-xxx.neon.tech:5432/neondb?sslmode=require
JWT_SECRET = your-random-secret-key-here
SETUP_SECRET = setup-secret-123
NEXT_PUBLIC_BASE_URL = https://your-site-name.netlify.app
NEXT_PUBLIC_SITE_URL = https://your-site-name.netlify.app
```

**Important:** Use your **actual Neon connection string** from earlier!

### Step 4: Deploy

1. Click **"Deploy site"**
2. Wait 2-3 minutes for build
3. Your site will be live at: `https://random-name.netlify.app`

### Step 5: Initialize Database

Visit this URL (replace with your site URL and secret):

```
https://your-site.netlify.app/api/setup-db?secret=setup-secret-123
```

You should see:
```json
{
  "success": true,
  "message": "✅ Database setup completed successfully!"
}
```

### Step 6: Login & Test

Go to: `https://your-site.netlify.app/login`

- **Username:** `admin`
- **Password:** `admin123`

✅ **Done!** Upload a logo in Settings and change admin password.

---

## 🎯 Method 2: Manual ZIP Upload (Backup method)

### Step 1: Create Deployment Package

```bash
npm run build
```

### Step 2: Upload to Netlify

1. Go to: **https://app.netlify.com**
2. Drag and drop your project folder
3. Wait for upload and build
4. Follow Steps 3-6 from Method 1

---

## 🔧 After Deployment

### Custom Domain (Optional)

1. Netlify dashboard → **Domain Settings**
2. Click **"Add custom domain"**
3. Follow DNS setup instructions

### Update Site URLs

1. Netlify dashboard → **Site settings** → **Environment variables**
2. Edit these variables with your actual domain:
   ```
   NEXT_PUBLIC_BASE_URL = https://yourdomain.com
   NEXT_PUBLIC_SITE_URL = https://yourdomain.com
   ```
3. Click **Deploys** → **Trigger deploy** → **Clear cache and deploy**

---

## 🐛 Troubleshooting

### Build Failed

**Check Netlify build logs for errors:**
1. Netlify dashboard → **Deploys** → Click latest deploy
2. Check **Deploy log**

**Common fixes:**
- Ensure `package.json` has `"build": "prisma generate && next build"`
- Check Node.js version (should be 18+)

### "Database connection failed"

**Solution:**
1. Verify DATABASE_URL is set in Netlify
2. Check connection string includes `?sslmode=require`
3. Test connection: visit `/api/diagnose`

### "Login not working"

**Solution:**
1. Make sure you ran `/api/setup-db?secret=your-secret`
2. Check `/api/diagnose` for issues
3. Verify JWT_SECRET is set

### Logo not showing

**Solution:**
1. Login to admin dashboard
2. Go to **Settings** tab
3. Upload logo under "Site Logo"
4. Click **Save Settings**

---

## 📊 Monitor Your Site

### Check Site Health

Visit: `https://your-site.netlify.app/api/diagnose`

This shows:
- ✅ Environment variables status
- ✅ Database connection
- ✅ Tables existence
- ✅ Admin user status
- ✅ Settings configured

### View Logs

Netlify dashboard → **Functions** → Select function → View logs

---

## 🔄 Update Deployment

When you make changes:

```bash
git add .
git commit -m "Your change description"
git push
```

Netlify auto-deploys on every push! 🎉

---

## 📋 Quick Checklist

Before going live:

- [ ] Database initialized (`/api/setup-db` ran successfully)
- [ ] Can login with admin/admin123
- [ ] Logo uploaded in Settings
- [ ] Admin password changed
- [ ] Test all pages (Home, About, News, Events, etc.)
- [ ] Contact form works
- [ ] Custom domain configured (optional)

---

## 🆘 Need Help?

**Diagnostic Tools:**
- `/api/diagnose` - Full system check
- `/api/setup-db?secret=xxx` - Initialize database

**Configuration Files:**
- `netlify.toml` - Build configuration
- `.env.example` - Environment variables template

**Documentation:**
- [DATABASE_QUICKSTART.md](./DATABASE_QUICKSTART.md) - Database setup
- [README.md](./README.md) - Project overview

---

**Your site is now live! 🎉**

*Default URL:* `https://your-site-name.netlify.app`  
*Admin Panel:* `https://your-site-name.netlify.app/dashboard`  
*Login:* `https://your-site-name.netlify.app/login`

---

*Last Updated: March 10, 2026*
