#!/bin/bash
# Deploy from GitHub - run this in cPanel Terminal
cd ~/public_html
git pull origin master
cd api
npm install --production
npx prisma generate
npx prisma migrate deploy
pkill node 2>/dev/null
nohup node dist/index.js > /dev/null 2>&1 &
echo "Deployed! Check https://zinvid.com/api/health"
