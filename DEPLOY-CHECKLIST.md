# cPanel Deployment Checklist

## Pre-Deployment
- [ ] External PostgreSQL database created (Supabase/Neon)
- [ ] Database allows connections from cPanel IP
- [ ] Domain pointed to cPanel nameservers (zinvid.com)
- [ ] SSL certificate available (AutoSSL)

## Local Build
- [ ] Run `deploy-package.bat` (Windows) or `./deploy-package.sh` (Mac/Linux)
- [ ] Verify `deploy-package/public_html/` has index.html + assets/
- [ ] Verify `deploy-package/public_html/api/` has dist/, package.json, prisma/

## cPanel Upload
- [ ] Upload `deploy-package/public_html/*` → `public_html/`
- [ ] Upload `deploy-package/public_html/api/*` → `public_html/api/`

## cPanel Node.js App Setup (Method A: Express serves everything — RECOMMENDED)
This method lets Express serve both the API and frontend, eliminating MIME type issues.
- [ ] Upload all frontend files to `public_html/` (the actual domain root)
- [ ] Upload backend files to `public_html/api/`
- [ ] Create Node.js App: Root=`public_html/`, Startup=`api/dist/index.js`, URL=`https://zinvid.com`
- [ ] Apache `.htaccess` should NOT be needed (Express handles SPA routing)
- [ ] Add Environment Variables in cPanel Node.js App:
  - [ ] NODE_ENV=production
  - [ ] DATABASE_URL=postgresql://...
  - [ ] JWT_SECRET=...
  - [ ] FRONTEND_URL=https://zinvid.com
  - [ ] FRONTEND_DIST_PATH=../ (or leave blank for auto-detect)
  - [ ] PORT=3000
   - [ ] YOUTUBE_COOKIES_FILE=/home/username/cookies.txt (export from browser first — see below)
   - [ ] FFMPEG_PATH= (set only if ffmpeg is installed at custom path)
- [ ] In cPanel Terminal, export YouTube cookies:
  - [ ] `yt-dlp --cookies-from-browser chrome --cookies ~/cookies.txt --skip-download https://youtube.com`
  - [ ] Verify file exists: `ls -la ~/cookies.txt`
- [ ] Open cPanel Terminal:
  - [ ] `cd ~/public_html/api`
  - [ ] `npm ci --production`
  - [ ] `npx prisma generate`
  - [ ] `npx prisma migrate deploy`
- [ ] Click "Restart" in Node.js App

## cPanel Node.js App Setup (Method B: Apache serves frontend, Node.js serves API only)
Use this if you prefer keeping Apache for the frontend.
- [ ] Create Node.js App: Root=`public_html/api`, Startup=`dist/index.js`, URL=`https://zinvid.com/api`
- [ ] Add Environment Variables in cPanel Node.js App:
  - [ ] NODE_ENV=production
  - [ ] DATABASE_URL=postgresql://...
  - [ ] JWT_SECRET=...
  - [ ] FRONTEND_URL=https://zinvid.com
  - [ ] PORT=3000
     - [ ] YOUTUBE_COOKIES_FILE=/home/username/cookies.txt (export from browser first — see below)
   - [ ] FFMPEG_PATH= (set only if ffmpeg is installed at custom path)
- [ ] In cPanel Terminal, export YouTube cookies:
  - [ ] `yt-dlp --cookies-from-browser chrome --cookies ~/cookies.txt --skip-download https://youtube.com`
  - [ ] Verify file exists: `ls -la ~/cookies.txt`
- [ ] In cPanel "Apache Handlers" or `.htaccess` (already in `public_html/`):
  - Ensure `.htaccess` has correct MIME types and SPA fallback
  - Verify `public_html/assets/` has the JS/CSS files
- [ ] Open cPanel Terminal:
  - [ ] `cd ~/public_html/api`
  - [ ] `npm ci --production`
  - [ ] `npx prisma generate`
  - [ ] `npx prisma migrate deploy`
- [ ] Click "Restart" in Node.js App

## Install yt-dlp & ffmpeg on Server (Required for Download Feature)
In cPanel Terminal:
```bash
# Option 1: Install via npm (inside the api directory)
cd ~/public_html/api
npm install yt-dlp-exec @ffmpeg-installer/ffmpeg

# Option 2: Install globally (better for production)
cd ~
wget https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -O bin/yt-dlp
chmod +x bin/yt-dlp
export PATH=$HOME/bin:$PATH

# Verify installation
yt-dlp --version
```

## Testing
- [ ] Frontend loads: https://zinvid.com
- [ ] API health: https://zinvid.com/api/health (or https://zinvid.com/api/health for Method B)
- [ ] Login/Register works
- [ ] Download feature works — paste a YouTube URL and try downloading
- [ ] Admin panel accessible
- [ ] Payments work (test mode)

## Post-Deploy
- [ ] Set up cron for database backups
- [ ] Configure monitoring/uptime checks
- [ ] Document update procedure

## Update Procedure (Future)
1. Make changes locally
2. Run `deploy-package.bat` or `./deploy-package.sh`
3. Upload files to `public_html/` and `public_html/api/`
4. cPanel Terminal: `cd ~/public_html/api && npm ci --production`
5. Restart Node.js app in cPanel