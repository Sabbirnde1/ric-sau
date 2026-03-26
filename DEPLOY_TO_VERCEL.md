# Deploy to Vercel

## Prerequisites

- GitHub repository with latest code
- PostgreSQL database URL (Neon recommended)
- Vercel account

## 1. Import Project in Vercel

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Select the `ric-sau` project
4. Keep framework as Next.js (auto-detected)
5. Leave build settings as default:
   - Build Command: `npm run build`
   - Install Command: `npm install`
   - Output Directory: `.next`

## 2. Add Environment Variables

In Vercel Project Settings -> Environment Variables, add:

- `DATABASE_URL` = your PostgreSQL connection string
- `JWT_SECRET` = a long random secret
- `SETUP_SECRET` = a private one-time setup key
- `NEXT_PUBLIC_BASE_URL` = `https://your-project.vercel.app`
- `NEXT_PUBLIC_SITE_URL` = `https://your-project.vercel.app`

Optional:
- `NEXT_PUBLIC_BASE_URL` and `NEXT_PUBLIC_SITE_URL` can be your custom domain once attached.

## 3. Deploy

1. Click Deploy
2. Wait for build to finish
3. Open your production URL

## 4. Initialize Database

After first successful deploy, run:

`https://your-project.vercel.app/api/setup-db?secret=YOUR_SETUP_SECRET`

Expected response should include `"success": true`.

## 5. Verify Application

- Visit `/api/diagnose` for environment/database checks
- Login at `/login` with default credentials:
  - Username: `admin`
  - Password: `admin123`
- Change admin password immediately

## Important Notes

- Serverless file systems are ephemeral on Vercel. Local file uploads to `public/uploads` are not durable.
- Use external image URLs for production logo/media in the admin settings.
- Prisma migrations in production should be applied with `npx prisma migrate deploy`.

## Troubleshooting

### Build fails on Prisma step

- Ensure `DATABASE_URL` is set in Vercel
- Check Vercel build logs for Prisma errors

### Login fails after deploy

- Check `/api/diagnose`
- Confirm `JWT_SECRET` exists in environment variables
- Ensure `/api/setup-db` was run successfully

### Database tables missing

Run migration from CI/CD or a one-off command:

`npx prisma migrate deploy`

## Optional: Deploy via Vercel CLI

If you prefer CLI:

1. `npm i -g vercel`
2. `vercel login`
3. `vercel`
4. `vercel --prod`
