# Deployment Guide

## Overview

The E-Commerce Platform can be deployed in two ways:
1. **Local Docker Compose** – for development/testing
2. **AWS Production** – ECS (backend) + S3+CloudFront (frontend) + RDS (database)

---

## Local Deployment with Docker Compose

### Prerequisites
- Docker and Docker Compose installed
- `.env` file configured (copy from `.env.example`)

```bash
# Clone the repo
git clone https://github.com/jijendhar-g/ecommerce-platform.git
cd ecommerce-platform

# Copy and configure environment
cp .env.example .env
# Edit .env with your Stripe keys and other secrets

# Start all services
docker compose up --build -d

# View logs
docker compose logs -f

# Stop
docker compose down
```

### Services started by Docker Compose

| Service | Port | Description |
|---------|------|-------------|
| MySQL | 3306 | Database |
| Backend (Spring Boot) | 8080 | REST API |
| Frontend (React/Nginx) | 3000 | Web app |
| Mailhog | 8025 | Email UI (dev) |

- Frontend: http://localhost:3000
- Backend API: http://localhost:8080/api/v1
- Swagger UI: http://localhost:8080/api/v1/swagger-ui.html
- Mailhog: http://localhost:8025

---

## AWS Production Deployment

### Architecture

```
Internet → CloudFront (frontend) → S3 Bucket
         → ALB → ECS Fargate (backend) → RDS MySQL
```

### Prerequisites

- AWS CLI configured with appropriate permissions
- AWS account with the following services available:
  - ECS, ECR, RDS, S3, CloudFront, ALB, VPC
- Docker installed locally
- `jq` installed (for scripts)

### Step 1: Deploy AWS Infrastructure

Using CloudFormation:

```bash
aws cloudformation deploy \
  --template-file aws/cloudformation.yml \
  --stack-name ecommerce-platform \
  --parameter-overrides \
    Environment=production \
    DBPassword=your-secure-password \
    DBUsername=ecommerce \
    JwtSecret=your-jwt-secret-min-256-bits \
    StripeSecretKey=sk_live_your_key \
    BackendImage=your-account.dkr.ecr.us-east-1.amazonaws.com/ecommerce-backend:latest \
  --capabilities CAPABILITY_NAMED_IAM \
  --region us-east-1
```

### Step 2: Deploy Backend

```bash
# Configure AWS credentials
cp .env.aws .env.aws.local
# Edit .env.aws.local with your actual values

# Deploy backend to ECS
bash aws/deploy-backend.sh latest
```

### Step 3: Deploy Frontend

```bash
# Set production environment variables
cp .env.production .env.production.local
# Edit with your actual API URL and Stripe key

# Deploy frontend to S3 + CloudFront
bash aws/deploy-frontend.sh
```

### Step 4: Deploy Everything

```bash
bash aws/deploy-all.sh
```

---

## GitHub Actions CI/CD

The `.github/workflows/ci.yml` workflow:

1. **On every push/PR**: Runs backend tests + frontend build
2. **On push to main**: Also deploys backend to ECS and frontend to S3+CloudFront

### Required GitHub Secrets

| Secret | Description |
|--------|-------------|
| `AWS_ACCESS_KEY_ID` | AWS IAM access key |
| `AWS_SECRET_ACCESS_KEY` | AWS IAM secret key |
| `AWS_CLOUDFRONT_DISTRIBUTION_ID` | CloudFront distribution ID |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |

Set these in GitHub → Settings → Secrets and variables → Actions.

---

## Environment Configuration

| File | Purpose |
|------|---------|
| `.env.example` | Template with all variables |
| `.env.development` | Local development settings |
| `.env.production` | Production settings template |
| `.env.aws` | AWS-specific settings |

---

## Health Checks

| Endpoint | Description |
|----------|-------------|
| `GET /api/v1/actuator/health` | Backend health |
| `GET /api/v1/actuator/info` | Application info |

---

## Troubleshooting

See [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for common issues and solutions.
