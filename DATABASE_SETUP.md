# 🗄️ Database Initialization Guide for Netlify

**IMPORTANT:** This guide solves the problems where:
- ❌ Admin login doesn't work (no users in database)
- ❌ Logo doesn't show (no settings in database)
- ❌ No content displays (empty database)

---

## 🔍 The Problem

When you deploy to Netlify, your database starts **completely empty**:
- ❗ No tables exist
- ❗ No admin user exists
- ❗ No settings (including logo)
- ❗ No content

This is why:
- Login fails (no admin user)
- Logo doesn't show (no settings)
- Pages are empty (no content)

---

## ✅ The Solution: Database Setup

You have **TWO options** to initialize your database:

### **Option 1: One-Click API Setup** (Easiest ⭐)
### **Option 2: Manual Setup** (More control)

---

## 🚀 Option 1: One-Click API Setup (Recommended)

This method uses a special API route to initialize everything automatically.

### Step 1: Set Up Environment Variables

In Netlify dashboard → **Site settings** → **Environment variables**, add:

```env
# Your PostgreSQL database
DATABASE_URL=postgresql://user:password@host:5432/database

# JWT secret (generate with: openssl rand -base64 32)
JWT_SECRET=your-secure-jwt-secret-key

# Setup secret (for one-time database initialization)
SETUP_SECRET=your-secret-setup-key-change-this

# Site URLs
NEXT_PUBLIC_BASE_URL=https://your-site.netlify.app
NEXT_PUBLIC_SITE_URL=https://your-site.netlify.app
```

**Important:** `SETUP_SECRET` should be a strong, random string. You'll use this once to initialize the database.

### Step 2: Deploy Your Site

Trigger a deploy in Netlify:
- Go to **Deploys** → **Trigger deploy** → **Deploy site**
- Wait for deployment to complete

### Step 3: Initialize Database

Once deployed, visit this URL in your browser:

```
https://your-site.netlify.app/api/setup-db?secret=YOUR_SETUP_SECRET
```

Replace:
- `your-site.netlify.app` with your actual Netlify URL
- `YOUR_SETUP_SECRET` with the value you set in environment variables

**Example:**
```
https://ric-sau-demo.netlify.app/api/setup-db?secret=my-super-secret-key-123
```

### Step 4: Success!

You should see a JSON response:

```json
{
  "success": true,
  "message": "✅ Database setup completed successfully!",
  "data": {
    "adminCreated": true,
    "defaultCredentials": {
      "username": "admin",
      "email": "admin@ric-sau.com",
      "password": "admin123"
    }
  }
}
```

### Step 5: Login

Now you can login:

1. Go to: `https://your-site.netlify.app/login`
2. **Username:** `admin`
3. **Password:** `admin123`
4. Click **Login**

### Step 6: Secure Your Site ⚠️

**IMMEDIATELY** after setup:

1. **Change admin password:**
   - Login to dashboard
   - Go to a future user management section (or update in database directly)

2. **Remove or disable the setup route:**
   - Delete file: `app/api/setup-db/route.ts`
   - Or add authentication to prevent unauthorized access
   - Redeploy

3. **Change default credentials:**
   - Update admin password
   - Update email if needed

---

## 🛠️ Option 2: Manual Setup

If you prefer more control or the API method doesn't work, use this method.

### Prerequisites

- PostgreSQL database (from Neon, Supabase, or Railway)
- Local copy of your project
- Environment variables configured

### Step 1: Configure Local Environment

Create `.env.local` in your project root:

```env
# Use your production database URL
DATABASE_URL=postgresql://user:password@host:5432/database
```

### Step 2: Generate Prisma Client

```bash
cd ric-sau
npm install
npx prisma generate
```

### Step 3: Run Migrations

This creates the database tables:

```bash
npx prisma migrate deploy
```

You should see:
```
✅ Migration applied successfully
```

### Step 4: Seed Database

This populates the database with initial data:

```bash
npm run db:seed
```

You should see:
```
🌱 Seeding database...
✅ Created admin user
✅ Created settings
✅ Created home page
✅ Created about page
...
🎉 Seeding completed successfully!

Default Admin Credentials:
  - Username: admin
  - Email: admin@ric-sau.com
  - Password: admin123
```

### Step 5: Verify

Check that data was created:

```bash
npx prisma studio
```

This opens a web interface at `http://localhost:5555` where you can see all your database tables and data.

### Step 6: Deploy & Login

Your production database is now ready! Go to your Netlify site and login with:
- **Username:** `admin`
- **Password:** `admin123`

---

## 📝 Default Admin Credentials

After database initialization, you can login with:

```
Username: admin
Email: admin@ric-sau.com
Password: admin123
```

⚠️ **SECURITY WARNING:** 
- Change this password immediately after first login!
- These are PUBLIC default credentials - anyone can see them!
- Update password in production before sharing site URL!

---

## 🎨 Uploading Your Logo

After login:

1. Go to **Dashboard** → **Settings** tab
2. Scroll to **Logo & Branding** section
3. Upload your logo image OR paste image URL
4. Click **Save Settings**
5. Logo will now appear in navbar and throughout site

**Recommended logo size:** 150x50 pixels (transparent PNG)

---

## ❌ Troubleshooting

### Issue: "Unauthorized. Invalid setup secret"

**Solution:** Check that your `SETUP_SECRET` environment variable matches the secret in the URL.

### Issue: "Database tables not created"

**Solution:** Run migrations first:
```bash
npx prisma migrate deploy
```

### Issue: "Database already initialized"

**Solution:** This means setup already ran successfully. Just login with the admin credentials.

### Issue: Connection refused / Can't connect to database

**Solutions:**
1. Verify `DATABASE_URL` is correct in Netlify environment variables
2. Check that database allows connections from external IPs
3. For Neon/Supabase: Check if you need to add `?sslmode=require` to connection string

### Issue: Login still doesn't work

**Check:**
1. Database has User table with admin user
2. JWT_SECRET environment variable is set
3. Check Netlify function logs for errors
4. Verify `/api/auth/login` route exists and works

### Issue: Logo still not showing

**Check:**
1. Settings table exists in database
2. Settings record has `general` JSON with `logo` field
3. Logo URL is valid and accessible
4. Check browser console for image loading errors

---

## 🔒 Security Best Practices

After database initialization:

### 1. Change Default Password
```sql
-- Use Prisma Studio or SQL to update password
UPDATE "User" SET password = '$2a$10$newHashedPassw...' WHERE username = 'admin';
```

Or create a new admin user and delete the default one.

### 2. Remove Setup Route

Delete or secure the setup API:
```bash
rm app/api/setup-db/route.ts
git add .
git commit -m "Remove database setup route"
git push
```

### 3. Rotate Secrets

Change these in Netlify environment variables:
- `JWT_SECRET` - Generate new: `openssl rand -base64 32`
- `SETUP_SECRET` - Delete this after initial setup

### 4. Enable Two-Factor Authentication

(Future feature - add to user management)

### 5. Regular Backups

Most database providers offer automatic backups:
- **Neon:** Automatic daily backups
- **Supabase:** Point-in-time recovery
- **Railway:** Volume backups

---

## 📊 Verify Setup

After initialization, check that you have:

- ✅ **User table** with admin user
- ✅ **Settings table** with logo and site config
- ✅ **Home table** with hero content
- ✅ **About table** with about info
- ✅ **Contact table** with contact details
- ✅ Sample **News** records
- ✅ Sample **Event** records

You can verify using:
```bash
npx prisma studio
```

Or check via SQL:
```sql
SELECT COUNT(*) FROM "User";      -- Should be 1+
SELECT COUNT(*) FROM "Settings";  -- Should be 1
SELECT COUNT(*) FROM "News";      -- Should be 1+
```

---

## 🎯 Quick Checklist

- [ ] PostgreSQL database created and accessible
- [ ] `DATABASE_URL` environment variable set in Netlify
- [ ] `JWT_SECRET` environment variable set in Netlify
- [ ] `SETUP_SECRET` environment variable set in Netlify
- [ ] Site deployed successfully to Netlify
- [ ] Database initialized using Option 1 or Option 2
- [ ] Can login with username: `admin`, password: `admin123`
- [ ] Logo shows in navbar (placeholder or custom)
- [ ] Changed admin password from default
- [ ] Setup route removed or secured
- [ ] Created backups of database

---

## 📚 Related Documentation

- [NETLIFY_DEPLOYMENT.md](./NETLIFY_DEPLOYMENT.md) - Complete deployment guide
- [ADMIN_GUIDE.md](./ADMIN_GUIDE.md) - Using the admin dashboard
- [README.md](./README.md) - Project overview

---

## 🆘 Still Having Issues?

If you're still experiencing problems:

1. **Check Netlify Logs:**
   - Netlify Dashboard → **Functions** → View function logs
   - Look for database connection errors

2. **Test Database Locally:**
   - Use same DATABASE_URL locally
   - Run `npx prisma studio` to verify connection

3. **Verify Environment Variables:**
   - All variables set correctly
   - No typos in variable names
   - Values don't have extra quotes or spaces

4. **Check Network/Firewall:**
   - Database allows connections from Netlify IPs
   - SSL/TLS configured properly

---

*Last Updated: March 10, 2026*
