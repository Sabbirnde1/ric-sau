# 🚀 Netlify Deployment Guide

Complete guide to deploy your Next.js 13 application to Netlify.

---

## 📋 Prerequisites

Before deploying to Netlify, ensure you have:

1. ✅ A GitHub account with your repository pushed
2. ✅ A Netlify account (free tier available at [netlify.com](https://netlify.com))
3. ✅ A PostgreSQL database (recommended providers below)
4. ✅ All environment variables ready

---

## 🗄️ Step 1: Set Up PostgreSQL Database

Choose one of these providers for your PostgreSQL database:

### Option A: Neon (Recommended - Free Tier)
1. Go to [neon.tech](https://neon.tech)
2. Sign up and create a new project
3. Copy the connection string (starts with `postgresql://`)
4. Save it for environment variables

### Option B: Supabase (Free Tier)
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Settings → Database → Connection String
4. Copy the PostgreSQL connection string
5. Save it for environment variables

### Option C: Railway (Hobby Plan)
1. Go to [railway.app](https://railway.app)
2. Create a new project → Add PostgreSQL
3. Copy the DATABASE_URL from variables
4. Save it for environment variables

---

## 🔧 Step 2: Prepare Your Project

### 1. Update Environment Variables

Check your `.env.example` file and prepare these values:

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/database"

# JWT Secret (generate with: openssl rand -base64 32)
JWT_SECRET="your-super-secret-jwt-key-change-this"

# Site URLs (will use Netlify URL)
NEXT_PUBLIC_BASE_URL="https://your-site.netlify.app"
NEXT_PUBLIC_SITE_URL="https://your-site.netlify.app"
```

### 2. Install Dependencies Locally

```bash
cd ric-sau
npm install
```

### 3. Test Build Locally

```bash
npm run build
```

If build succeeds, you're ready to deploy! ✅

---

## 📦 Step 3: Download ZIP for Manual Deployment

### Option A: Download from GitHub
1. Go to your GitHub repository
2. Click the green **Code** button
3. Select **Download ZIP**
4. Extract the ZIP file

### Option B: Create ZIP from Local Files

**Windows:**
```powershell
# Navigate to parent directory
cd D:\SAU

# Create ZIP (excluding node_modules and .next)
Compress-Archive -Path "ric-sau\*" -DestinationPath "ric-sau-deploy.zip" -Force `
  -ExcludePattern "node_modules","node_modules\*",".next",".next\*","*.db","*.log"
```

**Or use Windows Explorer:**
1. Go to `D:\SAU\ric-sau`
2. Select all files EXCEPT:
   - `node_modules` folder
   - `.next` folder
   - `*.db` files
3. Right-click → Send to → Compressed (zipped) folder

---

## 🌐 Step 4: Deploy to Netlify

### Method 1: Drag & Drop (Easiest)

1. **Go to Netlify:**
   - Visit [app.netlify.com](https://app.netlify.com)
   - Log in or sign up

2. **Deploy Site:**
   - Click **"Add new site"** → **"Deploy manually"**
   - Drag and drop your ZIP file or extracted folder
   - Wait for initial deployment (may fail - that's okay!)

3. **Configure Build Settings:**
   - Go to **Site settings** → **Build & deploy**
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Click **Save**

4. **Add Environment Variables:**
   - Go to **Site settings** → **Environment variables**
   - Add each variable:
     ```
     DATABASE_URL = postgresql://your-database-url
     JWT_SECRET = your-jwt-secret-key
     NEXT_PUBLIC_BASE_URL = https://your-site.netlify.app
     NEXT_PUBLIC_SITE_URL = https://your-site.netlify.app
     ```
   - Click **Save**

5. **Install Netlify Next.js Plugin:**
   - Go to **Integrations** → **Search plugins**
   - Find **"Next.js Runtime"** or **"@netlify/plugin-nextjs"**
   - Click **Install**

6. **Trigger Redeploy:**
   - Go to **Deploys**
   - Click **Trigger deploy** → **Deploy site**
   - Wait 2-5 minutes for build to complete

### Method 2: Connect GitHub Repository (Recommended)

1. **Go to Netlify:**
   - Visit [app.netlify.com](https://app.netlify.com)
   - Click **"Add new site"** → **"Import an existing project"**

2. **Connect GitHub:**
   - Select **GitHub**
   - Authorize Netlify to access your repositories
   - Select your `ric-sau` repository

3. **Configure Build:**
   - **Branch to deploy:** `main`
   - **Build command:** `npm run build`
   - **Publish directory:** `.next`
   - Click **Show advanced** → **Add environment variables**

4. **Add Environment Variables:**
   ```
   DATABASE_URL = postgresql://your-database-url
   JWT_SECRET = your-jwt-secret-key
   NEXT_PUBLIC_BASE_URL = https://your-site.netlify.app
   NEXT_PUBLIC_SITE_URL = https://your-site.netlify.app
   ```

5. **Deploy:**
   - Click **Deploy site**
   - Wait for build to complete (2-5 minutes)

---

## �️ Step 5: Initialize Database (CRITICAL!)

**⚠️ IMPORTANT:** Without this step:
- ❌ Admin login will NOT work (no users in database)
- ❌ Logo will NOT show (no settings in database)
- ❌ Pages will be empty (no content in database)

### Quick Setup (Recommended)

1. **Add Setup Secret Environment Variable:**
   - Go to Netlify → **Site settings** → **Environment variables**
   - Add: `SETUP_SECRET` = `your-secret-key-123` (choose a strong random string)
   - Save and trigger a new deploy

2. **Run One-Click Setup:**
   - After deployment completes, visit:
   ```
   https://your-site.netlify.app/api/setup-db?secret=your-secret-key-123
   ```
   - Replace `your-site.netlify.app` with your actual Netlify URL
   - Replace `your-secret-key-123` with your `SETUP_SECRET` value

3. **Success Response:**
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

4. **Login:**
   - Go to: `https://your-site.netlify.app/login`
   - Username: `admin`
   - Password: `admin123`
   - ✅ Your site is now fully functional!

5. **Secure Your Site:**
   - **IMMEDIATELY change the admin password** after first login
   - Delete `app/api/setup-db/route.ts` or add authentication
   - Redeploy

### Default Admin Credentials

After database initialization:
```
Username: admin
Email: admin@ric-sau.com
Password: admin123
```

**⚠️ CHANGE THIS PASSWORD IMMEDIATELY!**

### Detailed Instructions

For complete step-by-step instructions, troubleshooting, and manual setup options:

📖 **See: [DATABASE_SETUP.md](./DATABASE_SETUP.md)**

This guide covers:
- Two initialization methods (API and manual)
- Uploading your logo
- Troubleshooting common issues
- Security best practices
- Verification steps

---

## ✅ Step 6: Verify Deployment

1. **Check Site:**
   - Visit your Netlify URL: `https://your-site.netlify.app`
   - Verify homepage loads correctly

2. **Test Features:**
   - ✅ Homepage and navigation
   - ✅ All pages render correctly
   - ✅ Images load properly
   - ✅ API routes work (test endpoints)

3. **Check Logs:**
   - Go to Netlify dashboard → **Logs**
   - Check for any errors

---

## 🔧 Common Issues & Solutions

### ❌ Admin Login Doesn't Work
**Problem:** Can't login with any credentials, get "Invalid username or password"

**Root Cause:** Database is empty - no admin user exists

**Solution:** 
1. Initialize database using Step 5 above
2. Visit: `https://your-site.netlify.app/api/setup-db?secret=YOUR_SETUP_SECRET`
3. Login with default credentials: username `admin`, password `admin123`
4. See [DATABASE_SETUP.md](./DATABASE_SETUP.md) for detailed instructions

### ❌ Logo Doesn't Show / Header is Blank
**Problem:** Logo is missing from navbar and site header

**Root Cause:** Database has no settings record with logo configuration

**Solution:**
1. Initialize database (see Step 5)
2. After login, go to Dashboard → Settings tab
3. Upload your logo or paste logo URL
4. Click Save Settings
5. Logo will appear immediately

### ❌ Pages Are Empty / No Content Shows
**Problem:** News, events, team pages show no content

**Root Cause:** Database is empty - no sample content

**Solution:**
1. Initialize database using Step 5
2. Sample content will be created automatically
3. Add your own content via Dashboard

### ❌ Build Fails with "Module not found"
**Solution:** Ensure all dependencies are in `package.json`
```bash
npm install --save missing-package
```

### ❌ "DATABASE_URL not defined"
**Solution:** Add environment variable in Netlify settings

### ❌ "Prisma Client not generated"
**Solution:** The `postinstall` script should handle this. If not:
- Add to build command: `prisma generate && npm run build`

### ❌ Images not loading
**Solution:** Ensure images are in `/public` folder and referenced correctly

### ❌ API routes return 404
**Solution:** 
- Verify `netlify.toml` is in root directory
- Ensure `@netlify/plugin-nextjs` plugin is installed
- Check that Next.js version is compatible (13.x is supported)

### ❌ Site loads but CSS is missing
**Solution:** 
- Clear Netlify cache: **Deploys** → **Trigger deploy** → **Clear cache and deploy site**
- Verify `.next` is the publish directory

---

## 🎨 Step 7: Custom Domain (Optional)

1. Go to **Site settings** → **Domain management**
2. Click **Add custom domain**
3. Follow instructions to:
   - Add domain
   - Update DNS records
   - Enable HTTPS (automatic with Netlify)

---

## 📱 Step 8: Update Site URLs

After deployment, update environment variables with your actual Netlify URL:

1. Go to **Site settings** → **Environment variables**
2. Update:
   ```
   NEXT_PUBLIC_BASE_URL = https://your-actual-site.netlify.app
   NEXT_PUBLIC_SITE_URL = https://your-actual-site.netlify.app
   ```
3. **Trigger redeploy**

---

## 🔄 Continuous Deployment

With GitHub connected:
- Every push to `main` branch automatically deploys
- Pull requests create preview deployments
- View deploy status in GitHub and Netlify

---

## 📊 Monitor Your Site

### Netlify Analytics
- Go to **Analytics** tab
- View traffic, performance, and errors

### Function Logs
- Go to **Functions** tab
- View API route logs and errors

---

## 🚀 Performance Optimization

1. **Enable Asset Optimization:**
   - Go to **Site settings** → **Build & deploy** → **Post processing**
   - Enable:
     - ✅ Bundle CSS
     - ✅ Minify CSS
     - ✅ Minify JS
     - ✅ Compress images
     - ✅ Pretty URLs

2. **Configure Caching:**
   - Already configured in `netlify.toml`
   - Static assets cached for 1 year

3. **Prerendering:**
   - Next.js automatically prerenders static pages
   - Dynamic pages use serverless functions

---

## 📝 Deployment Checklist

Before deploying, ensure:

- [ ] All environment variables are set
- [ ] Database is created and accessible
- [ ] `netlify.toml` is in root directory
- [ ] Build succeeds locally (`npm run build`)
- [ ] No sensitive data in code (use env variables)
- [ ] `.gitignore` includes `.env.local`
- [ ] All dependencies are in `package.json`
- [ ] Images are optimized and in `/public`

---

## 🆘 Support

**Netlify Documentation:**
- [Next.js on Netlify](https://docs.netlify.com/frameworks/next-js/)
- [Environment Variables](https://docs.netlify.com/environment-variables/overview/)
- [Troubleshooting](https://docs.netlify.com/configure-builds/troubleshoot-builds/)

**Get Help:**
- [Netlify Community](https://answers.netlify.com/)
- [Netlify Support](https://www.netlify.com/support/)

---

## 🎉 Success!

Your site should now be live at: `https://your-site.netlify.app`

**Next Steps:**
- Set up custom domain
- Configure SEO settings
- Add Google Analytics
- Set up monitoring
- Create backup strategy

---

*Last Updated: March 10, 2026*
