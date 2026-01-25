#!/bin/bash
set -e

echo "Vercel Production 배포 시작"

# Pull Vercel environment
npx vercel pull --yes --environment=production --token=$VERCEL_TOKEN

# Build project
npx vercel build --prod --token=$VERCEL_TOKEN

# Deploy to production
DEPLOY_URL=$(npx vercel deploy --prebuilt --prod --token=$VERCEL_TOKEN)

echo "배포 완료: $DEPLOY_URL"
