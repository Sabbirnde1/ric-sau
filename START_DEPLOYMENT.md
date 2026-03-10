# Deploy to Netlify - Step by Step

## Your Database Connection

You already have a Neon database set up! Here's your connection string:

```
postgresql://neondb_owner:npg_4iXNpk2rHPLv@ep-dry-sky-aecaxbad-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

**Keep this safe! You'll need it for Netlify.**

---

## 🚀 Deploy Now (5 Steps)

### Step 1: Commit & Push to GitHub

```bash
git add .
git commit -m "Ready for Netlify deployment  with Neon database"
git push
```

### Step 2: Create Netlify Site

1. Go to: **https://app.netlify.com**
2. Click **"Add new site"** → **"Import an existing project"**
3. Choose **GitHub**
4. Authorize GitHub if needed
5. Select your repository: **`ric-sau`** or **`Sabbirnde1/ric-sau`**

### Step 3: Configure Build Settings

Netlify should auto-detect Next.js. Verify:

- **Build command:** `npm run build`
- **Publish directory:** `.next`
- **Site name:** Choose a name (e.g., `ric-sau` or `sau-research`)

Click **"Show advanced"** to add environment variables

### Step 4: Add Environment Variables

Click **"New variable"** for EACH of these:

#### 1. DATABASE_URL
```
postgresql://neondb_owner:npg_4iXNpk2rHPLv@ep-dry-sky-aecaxbad-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

#### 2. JWT_SECRET
```
sau-jwt-secret-2026-change-this-in-production
```

#### 3. SETUP_SECRET
```
setup-sau-2026
```

#### 4. NEXT_PUBLIC_BASE_URL
```
https://YOUR-SITE-NAME.netlify.app
```
*(Replace YOUR-SITE-NAME with the name you chose)*

#### 5. NEXT_PUBLIC_SITE_URL
```
https://YOUR-SITE-NAME.netlify.app
```
*(Same as above)*

**Click "Deploy site"**

### Step 5: Initialize Database (IMPORTANT!)

After deploy completes (2-3 minutes), visit:

```
https://YOUR-SITE-NAME.netlify.app/api/setup-db?secret=setup-sau-2026
```

**Expected response:**
```json
{
  "success": true,
  "message": "✅ Database setup completed successfully!",
  "data": {
    "tablesCreated": ["User", "News", "Event", ...],
    "defaultCredentials": {
      "username": "admin",
      "password": "admin123"
    }
  }
}
```

If you see this, **SUCCESS!** 🎉

---

## ✅ Test Your Live Site

### 1. Visit Your Site
```
https://YOUR-SITE-NAME.netlify.app
```

### 2. Login to Admin
Go to:
```
https://YOUR-SITE-NAME.netlify.app/login
```

- **Username:** `admin`
- **Password:** `admin123`

### 3. Upload Logo
1. In dashboard, click **Settings** tab
2. Under "Site Logo", upload your logo
3. Click **Save Settings**

### 4. Change Password
1. In dashboard, click **Settings** or **Profile**
2. Change the default password
3. Use a strong password!

---

## 🐛 Troubleshooting

### Build Failed?

**Check the deploy log on Netlify:**
- Click on the failed deploy
- Read the error message
- Common fix: Make sure `NODE_VERSION=18` is set

### Can't Access /api/setup-db?

**Solutions:**
1. Wait 30 seconds after deploy completes
2. Try accessing `/api/diagnose` first
3. Check Netlify Functions logs

### Database Connection Error?

**Visit diagnostic page:**
```
https://YOUR-SITE-NAME.netlify.app/api/diagnose
```

This shows what's wrong and how to fix it.

### Login Not Working?

**Make sure you ran setup:**
```
https://YOUR-SITE-NAME.netlify.app/api/setup-db?secret=setup-sau-2026
```

Check the response - should say "success": true

---

## 🔄 Update Your Site

Whenever you make changes:

```bash
git add .
git commit -m "Updated content"
git push
```

Netlify auto-deploys every push! ⚡

---

## 📊 Monitor Your Site

### Check Everything Works
```
https://YOUR-SITE-NAME.netlify.app/api/diagnose
```

Shows:
- ✅ Environment variables
- ✅ Database connection  
- ✅ Tables exist
- ✅ Admin user exists
- ✅ Settings configured

### View Netlify Logs

1. Netlify dashboard
2. Click **Functions**
3. See all API calls and errors

---

## 🎯 Next Steps

- [ ] Change admin password
- [ ] Upload logo
- [ ] Add your content (News, Events, Projects)
- [ ] Test all pages
- [ ] Configure custom domain (optional)
- [ ] Share your live site!

---

**Your live site:** `https://YOUR-SITE-NAME.netlify.app`  
**Admin panel:** `https://YOUR-SITE-NAME.netlify.app/dashboard`  
**API health:** `https://YOUR-SITE-NAME.netlify.app/api/diagnose`

---

**Need help?** Open the Netlify deploy log or check `/api/diagnose`

🎉 **Congratulations! Your site is live!** 🎉
