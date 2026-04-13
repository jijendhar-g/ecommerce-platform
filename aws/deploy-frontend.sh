#!/usr/bin/env bash
# ============================================================
# deploy-frontend.sh - Deploy React frontend to AWS S3 + CloudFront
# ============================================================
set -euo pipefail

# Load AWS environment variables
if [ -f ".env.aws" ]; then
  export $(grep -v '^#' .env.aws | xargs)
fi

# Load production frontend vars
if [ -f ".env.production" ]; then
  export $(grep -v '^#' .env.production | grep 'VITE_' | xargs)
fi

# Validate required variables
: "${AWS_S3_BUCKET:?AWS_S3_BUCKET must be set}"
: "${AWS_CLOUDFRONT_DISTRIBUTION_ID:?AWS_CLOUDFRONT_DISTRIBUTION_ID must be set}"
: "${AWS_REGION:?AWS_REGION must be set}"

echo "🚀 Deploying frontend to S3 + CloudFront..."
echo "   Bucket: s3://${AWS_S3_BUCKET}"
echo "   CloudFront: ${AWS_CLOUDFRONT_DISTRIBUTION_ID}"

# 1. Build the frontend
echo ""
echo "📦 Building frontend..."
cd frontend
npm ci
npm run build
cd ..

# 2. Upload to S3
echo ""
echo "⬆️  Uploading to S3..."
# Upload JS/CSS with long-term caching
aws s3 sync frontend/dist/ "s3://${AWS_S3_BUCKET}/" \
  --region "${AWS_REGION}" \
  --delete \
  --cache-control "max-age=31536000,public" \
  --exclude "index.html" \
  --exclude "*.json"

# Upload HTML and JSON without caching (so users get latest version)
aws s3 sync frontend/dist/ "s3://${AWS_S3_BUCKET}/" \
  --region "${AWS_REGION}" \
  --cache-control "no-cache,no-store,must-revalidate" \
  --include "index.html" \
  --include "*.json"

# 3. Invalidate CloudFront cache
echo ""
echo "🔄 Invalidating CloudFront cache..."
INVALIDATION_ID=$(aws cloudfront create-invalidation \
  --distribution-id "${AWS_CLOUDFRONT_DISTRIBUTION_ID}" \
  --paths "/*" \
  --query 'Invalidation.Id' \
  --output text)

echo "   Invalidation ID: ${INVALIDATION_ID}"
echo "⏳ Waiting for invalidation to complete..."
aws cloudfront wait invalidation-completed \
  --distribution-id "${AWS_CLOUDFRONT_DISTRIBUTION_ID}" \
  --id "${INVALIDATION_ID}"

echo ""
echo "✅ Frontend deployment complete!"
echo "   Visit: https://$(aws cloudfront get-distribution --id ${AWS_CLOUDFRONT_DISTRIBUTION_ID} --query 'Distribution.DomainName' --output text)"
