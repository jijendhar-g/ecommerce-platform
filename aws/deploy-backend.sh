#!/usr/bin/env bash
# ============================================================
# deploy-backend.sh - Deploy Spring Boot backend to AWS ECS
# ============================================================
set -euo pipefail

# Load AWS environment variables
if [ -f ".env.aws" ]; then
  export $(grep -v '^#' .env.aws | xargs)
fi

# Validate required variables
: "${AWS_ECR_REGISTRY:?AWS_ECR_REGISTRY must be set}"
: "${AWS_ECR_BACKEND_REPO:?AWS_ECR_BACKEND_REPO must be set}"
: "${AWS_ECS_CLUSTER:?AWS_ECS_CLUSTER must be set}"
: "${AWS_ECS_SERVICE:?AWS_ECS_SERVICE must be set}"
: "${AWS_REGION:?AWS_REGION must be set}"

IMAGE_TAG="${1:-latest}"
ECR_IMAGE="${AWS_ECR_REGISTRY}/${AWS_ECR_BACKEND_REPO}:${IMAGE_TAG}"

echo "🚀 Deploying backend to AWS ECS..."
echo "   Image: ${ECR_IMAGE}"
echo "   Cluster: ${AWS_ECS_CLUSTER}"
echo "   Service: ${AWS_ECS_SERVICE}"

# 1. Build the Docker image
echo ""
echo "📦 Building Docker image..."
docker build -t "${AWS_ECR_BACKEND_REPO}:${IMAGE_TAG}" .
docker tag "${AWS_ECR_BACKEND_REPO}:${IMAGE_TAG}" "${ECR_IMAGE}"

# 2. Authenticate to ECR
echo ""
echo "🔐 Authenticating to ECR..."
aws ecr get-login-password --region "${AWS_REGION}" | \
  docker login --username AWS --password-stdin "${AWS_ECR_REGISTRY}"

# 3. Push to ECR
echo ""
echo "⬆️  Pushing image to ECR..."
docker push "${ECR_IMAGE}"

# 4. Update ECS service to use new image
echo ""
echo "🔄 Updating ECS service..."
aws ecs update-service \
  --cluster "${AWS_ECS_CLUSTER}" \
  --service "${AWS_ECS_SERVICE}" \
  --force-new-deployment \
  --region "${AWS_REGION}"

# 5. Wait for deployment to complete
echo ""
echo "⏳ Waiting for deployment to complete..."
aws ecs wait services-stable \
  --cluster "${AWS_ECS_CLUSTER}" \
  --services "${AWS_ECS_SERVICE}" \
  --region "${AWS_REGION}"

echo ""
echo "✅ Backend deployment complete!"
