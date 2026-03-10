# 📦 ZIP File Preparation for Deployment

## ✅ Files to INCLUDE

Include all source files and configuration:
- ✅ `app/` directory
- ✅ `components/` directory
- ✅ `lib/` directory
- ✅ `public/` directory
- ✅ `hooks/` directory
- ✅ `prisma/` directory
- ✅ `package.json`
- ✅ `package-lock.json` (or yarn.lock/pnpm-lock.yaml)
- ✅ `next.config.js`
- ✅ `tailwind.config.ts`
- ✅ `postcss.config.js`
- ✅ `tsconfig.json`
- ✅ `netlify.toml`
- ✅ `.env.example` (for reference only)
- ✅ `components.json`
- ✅ `README.md`
- ✅ `NETLIFY_DEPLOYMENT.md`
- ✅ All `.md` documentation files

## ❌ Files to EXCLUDE

**DO NOT include these in your ZIP:**

### Build Artifacts
- ❌ `.next/` - Next.js build output (will be regenerated)
- ❌ `out/` - Export output directory
- ❌ `build/` - Production build directory
- ❌ `.netlify/` - Netlify local cache
- ❌ `.vercel/` - Vercel deployment files

### Dependencies
- ❌ `node_modules/` - **IMPORTANT:** Never include this (700+ MB)
  - Netlify will install dependencies automatically from package.json

### Environment Files
- ❌ `.env` - Contains sensitive data
- ❌ `.env.local` - Local environment variables
- ❌ `.env.production` - Production secrets
- ❌ `.env.*.local` - Any local env files

### Database Files
- ❌ `*.db` - SQLite database files
- ❌ `*.sqlite` - SQLite files
- ❌ `*.sqlite3` - SQLite files
- ❌ `dev.db` - Development database
- ❌ `prisma/dev.db` - Prisma local database

### Uploaded Files (Optional)
- ❌ `public/uploads/*` - User uploaded images
  - **Note:** These won't persist on Netlify. Use cloud storage (Cloudinary, S3) for production

### IDE & System Files
- ❌ `.vscode/` - VS Code settings
- ❌ `.idea/` - IntelliJ IDEA settings
- ❌ `.DS_Store` - macOS system files
- ❌ `Thumbs.db` - Windows thumbnail cache
- ❌ `*.swp`, `*.swo` - Vim swap files

### Logs & Temporary Files
- ❌ `*.log` - Log files
- ❌ `npm-debug.log*`
- ❌ `yarn-debug.log*`
- ❌ `yarn-error.log*`
- ❌ `logs/` - Log directory
- ❌ `tmp/`, `temp/` - Temporary directories
- ❌ `*.tmp` - Temporary files

### Git Files (Optional)
- ⚠️ `.git/` - Git repository (only needed if using Git deploy)
- ⚠️ `.gitignore` - Can include for reference

---

## 🪟 Windows: Create ZIP Excluding Files

### Method 1: PowerShell Script

Save this as `create-deploy-zip.ps1`:

```powershell
# Navigate to project directory
Set-Location "D:\SAU\ric-sau"

# Define exclusions
$exclude = @(
    "node_modules",
    ".next",
    ".netlify",
    ".vercel",
    "out",
    "build",
    ".git",
    ".env",
    ".env.local",
    ".env.*.local",
    "*.db",
    "*.sqlite*",
    "*.log",
    "public/uploads/*"
)

# Get all files except exclusions
$files = Get-ChildItem -Path . -Recurse -File | 
    Where-Object { 
        $path = $_.FullName
        $shouldInclude = $true
        foreach ($ex in $exclude) {
            if ($path -like "*\$ex\*" -or $path -like "*\$ex") {
                $shouldInclude = $false
                break
            }
        }
        $shouldInclude
    }

# Create ZIP
$zipPath = "..\ric-sau-deploy.zip"
Compress-Archive -Path $files.FullName -DestinationPath $zipPath -Force

Write-Host "✅ Deployment ZIP created: $zipPath"
Write-Host "📦 Ready to upload to Netlify!"
```

Run it:
```powershell
.\create-deploy-zip.ps1
```

### Method 2: Manual Selection

1. **Open File Explorer** → Navigate to `D:\SAU\ric-sau`

2. **Select all files EXCEPT:**
   - `node_modules` folder (most important!)
   - `.next` folder
   - `.git` folder
   - `.env.local` file
   - `*.db` files

3. **Right-click** selected files → **Send to** → **Compressed (zipped) folder**

4. **Name it:** `ric-sau-deploy.zip`

---

## 🐧 Linux/Mac: Create ZIP

```bash
cd ~/projects/ric-sau

# Create ZIP excluding unnecessary files
zip -r ../ric-sau-deploy.zip . \
  -x "node_modules/*" \
  -x ".next/*" \
  -x ".netlify/*" \
  -x ".git/*" \
  -x ".env*" \
  -x "*.db" \
  -x "*.log" \
  -x "public/uploads/*"

echo "✅ Deployment ZIP created!"
```

---

## 📊 Expected ZIP Size

**Without exclusions:** ~800 MB (due to node_modules)
**With exclusions:** ~5-15 MB ✅

If your ZIP is larger than 20 MB, you probably included `node_modules/` or `.next/` by mistake!

---

## ✅ Verify Your ZIP

Before uploading to Netlify:

1. **Extract ZIP to temporary folder**
2. **Check size:** Should be 5-15 MB
3. **Verify exclusions:**
   - ❌ No `node_modules/` folder
   - ❌ No `.next/` folder
   - ❌ No `.env.local` file
   - ✅ Has `package.json`
   - ✅ Has `netlify.toml`
   - ✅ Has `app/` folder
   - ✅ Has `components/` folder

---

## 🚀 After Creating ZIP

1. Go to [app.netlify.com](https://app.netlify.com)
2. Drag and drop your ZIP file
3. Wait for deployment
4. Configure environment variables
5. Done! 🎉

See [NETLIFY_DEPLOYMENT.md](./NETLIFY_DEPLOYMENT.md) for complete deployment instructions.

---

## 💡 Pro Tips

- **Automate it:** Use the PowerShell script for consistent deployments
- **Version control:** Keep deployment ZIPs organized with dates (e.g., `ric-sau-2026-03-10.zip`)
- **Test locally first:** Always run `npm run build` before creating deployment ZIP
- **Use GitHub:** Connect Netlify to GitHub for automatic deployments (no ZIP needed!)

---

*Last Updated: March 10, 2026*
