@echo off
REM deploy-package.bat - Windows version
REM Run this to create deployment package

echo 📦 Building production packages...

echo Building backend...
cd backend
npm run build
cd ..

echo Building frontend...
cd vite-frontend
npm run build
cd ..

echo Creating deployment package...
if exist deploy-package rmdir /s /q deploy-package
mkdir deploy-package\public_html
mkdir deploy-package\public_html\api

echo Copying frontend...
xcopy /E /I /Y vite-frontend\dist\* deploy-package\public_html\

echo Copying backend...
xcopy /E /I /Y backend\dist deploy-package\public_html\api\dist\
copy backend\package.json deploy-package\public_html\api\
copy backend\package-lock.json deploy-package\public_html\api\
xcopy /E /I /Y backend\prisma deploy-package\public_html\api\prisma\

echo.
echo ✅ Deployment package ready in .\deploy-package\
echo.
echo 📁 Upload contents:
echo    deploy-package\public_html\*        →  cPanel public_html\
echo    deploy-package\public_html\api\*    →  cPanel public_html\api\
echo.
echo 🔧 After upload, run in cPanel Terminal:
echo    cd ~/public_html/api
echo    npm ci --production
echo    npx prisma generate
echo    npx prisma migrate deploy
echo.
echo 🔄 Then restart Node.js app in cPanel
pause