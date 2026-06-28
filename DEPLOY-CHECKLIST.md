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
- [ ] Verify `.htaccess` exists in `public_html/`

## Backend Setup (cPanel)
- [ ] Create Node.js App: Root=`public_html/api`, Startup=`dist/index.js`, URL=`yourdomain.com/api`
- [ ] Add Environment Variables in cPanel Node.js App:
  - [ ] NODE_ENV=production
  - [ ] DATABASE_URL=postgresql://...
  - [ ] JWT_SECRET=...
  - [ ] FRONTEND_URL=https://zinvid.com
  - [ ] PORT=3000
- [ ] Open cPanel Terminal:
  - [ ] `cd ~/public_html/api`
  - [ ] `npm ci --production`
  - [ ] `npx prisma generate`
  - [ ] `npx prisma migrate deploy`
- [ ] Click "Restart" in Node.js App

## Frontend Config
- [ ] Update `vite-frontend/.env.production` with `VITE_API_URL=https://zinvid.com/api`
- [ ] Rebuild frontend: `cd vite-frontend && npm run build`
- [ ] Re-upload `vite-frontend/dist/*` to `public_html/`

## Testing
- [ ] Frontend loads: https://zinvid.com
- [ ] API health: https://zinvid.com/api/health
- [ ] Login/Register works
- [ ] Download feature works
- [ ] Admin panel accessible
- [ ] Payments work (test mode)

## Post-Deploy
- [ ] Set up cron for database backups
- [ ] Configure monitoring/uptime checks
- [ ] Document update procedure

## Update Procedure (Future)
1. Make changes locally
2. Run `deploy-package.bat`
3. Upload new `dist/` folders only
4. cPanel Terminal: `cd ~/public_html/api && npm ci --production`
5. Restart Node.js app in cPanel