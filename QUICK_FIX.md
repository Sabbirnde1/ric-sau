# 🚨 QUICK FIX: Login & Logo Issues on Netlify

## Problem

After deploying to Netlify:
- ❌ Can't login (username/password doesn't work)
- ❌ Logo doesn't show
- ❌ Pages are empty

## Why This Happens

Your database is **empty** after deployment. It needs to be initialized with:
- Admin user (for login)
- Settings (including logo)
- Sample content

## Quick Solution (5 Minutes)

### Step 1: Add Setup Secret

In Netlify dashboard:
1. Go to **Site settings** → **Environment variables**
2. Click **Add a variable**
3. Key: `SETUP_SECRET`
4. Value: `my-secret-key-123` (choose your own strong password)
5. Click **Save**
6. Click **Trigger deploy** → **Deploy site**
7. Wait for deployment to finish

### Step 2: Initialize Database

After deploy completes, visit this URL in your browser:

```
https://YOUR-SITE.netlify.app/api/setup-db?secret=my-secret-key-123
```

**Replace:**
- `YOUR-SITE` with your Netlify site name
- `my-secret-key-123` with your actual SETUP_SECRET

**Example:**
```
https://ric-sau-demo.netlify.app/api/setup-db?secret=my-secret-key-123
```

### Step 3: Confirm Success

You should see this in your browser:

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

### Step 4: Login

Go to your site's login page:

```
https://YOUR-SITE.netlify.app/login
```

Login with:
- **Username:** `admin`
- **Password:** `admin123`

✅ **You're in!** Everything should work now.

### Step 5: Upload Logo

1. In Dashboard, click **Settings** tab
2. Scroll to **Logo & Branding**
3. Upload your logo image or paste URL
4. Click **Save Settings**

✅ **Logo now shows!**

### Step 6: Change Password (IMPORTANT!)

⚠️ The default password `admin123` is PUBLIC. Change it immediately!

1. In Dashboard, go to user management
2. Update your password
3. Or use Prisma Studio to update database directly

## Still Not Working?

### Check environment variables:
```
✅ DATABASE_URL = postgresql://...
✅ JWT_SECRET = your-secret
✅ SETUP_SECRET = your-key
✅ NEXT_PUBLIC_BASE_URL = https://your-site.netlify.app
✅ NEXT_PUBLIC_SITE_URL = https://your-site.netlify.app
```

### Check database connection:
- Database URL is correct
- Database allows external connections
- PostgreSQL database is running

### Check Netlify logs:
- Go to **Functions** tab
- Look for error messages
- Check if `/api/setup-db` ran successfully

## Detailed Documentation

For complete instructions and troubleshooting:

📖 [DATABASE_SETUP.md](./DATABASE_SETUP.md) - Complete database initialization guide
📖 [NETLIFY_DEPLOYMENT.md](./NETLIFY_DEPLOYMENT.md) - Full deployment guide

## Default Credentials Reference

After initialization:

```
🔐 Admin Login:
   Username: admin
   Email: admin@ric-sau.com
   Password: admin123

⚠️ CHANGE IMMEDIATELY AFTER FIRST LOGIN!
```

## Security Reminder

After setup:

1. ✅ Change admin password
2. ✅ Delete `/api/setup-db/route.ts` file
3. ✅ Redeploy site
4. ✅ Keep DATABASE_URL secret
5. ✅ Rotate JWT_SECRET regularly

---

**Need more help?** Open an issue or check the detailed guides above.

*Last Updated: March 10, 2026*
