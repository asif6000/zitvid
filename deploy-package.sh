#!/bin/bash
# deploy-package.sh - Run locally to create deployment package
# Usage: ./deploy-package.sh

set -e

echo "📦 Building production packages..."

# Build backend
echo "Building backend..."
cd backend
npm run build
cd ..

# Build frontend
echo "Building frontend..."
cd vite-frontend
npm run build
cd ..

# Create deployment package
echo "Creating deployment package..."
rm -rf deploy-package
mkdir -p deploy-package/public_html
mkdir -p deploy-package/public_html/api

# Frontend files
cp -r vite-frontend/dist/* deploy-package/public_html/

# Backend files
cp -r backend/dist deploy-package/public_html/api/
cp backend/package.json deploy-package/public_html/api/
cp backend/package-lock.json deploy-package/public_html/api/
cp -r backend/prisma deploy-package/public_html/api/

echo "✅ Deployment package ready in ./deploy-package/"
echo ""
echo "📁 Upload contents:"
echo "   deploy-package/public_html/*        →  cPanel public_html/"
echo "   deploy-package/public_html/api/*    →  cPanel public_html/api/"
echo ""
echo "🔧 After upload, run in cPanel Terminal:"
echo "   cd ~/public_html/api"
echo "   npm ci --production"
echo "   npx prisma generate"
echo "   npx prisma migrate deploy"
echo ""
echo "🔄 Then restart Node.js app in cPanel"