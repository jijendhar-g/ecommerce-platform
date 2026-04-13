# CI/CD Pipeline Documentation

## Overview

The GitHub Actions CI/CD pipeline (`.github/workflows/ci.yml`) automates building, testing, and deploying the full-stack application.

## Workflow Triggers

| Event | Branches | Jobs Triggered |
|-------|---------|----------------|
| `push` | main, develop | All jobs |
| `pull_request` | main, develop | Test + Build only |

## Jobs

### 1. `backend-test` – Backend Build & Test
- Sets up JDK 17 (Temurin)
- Builds with Maven (`mvn clean compile`)
- Runs all 17 tests (`mvn test`)
- Uploads test results artifact

### 2. `frontend-build` – Frontend Build
- Sets up Node.js 20
- Installs dependencies (`npm ci`)
- Builds production bundle (`npm run build`)
- Uploads `dist/` as artifact

### 3. `docker-build` – Docker Image Build *(main only)*
- Requires `backend-test` + `frontend-build` to pass
- Builds backend Docker image
- Builds frontend Docker image
- Does not push (push happens in deploy jobs)

### 4. `deploy-backend` – Deploy to AWS ECS *(main push only)*
- Requires `backend-test` to pass
- Configures AWS credentials
- Logs into ECR
- Builds and pushes backend image with commit SHA tag + `latest`
- Updates ECS service (force new deployment)
- Waits for service to stabilize

### 5. `deploy-frontend` – Deploy to S3+CloudFront *(main push only)*
- Requires `frontend-build` to pass
- Downloads frontend dist artifact
- Configures AWS credentials
- Syncs to S3 with appropriate cache headers
  - Static assets: `max-age=31536000` (1 year)
  - `index.html`, `.json`: `no-cache`
- Creates CloudFront cache invalidation

## Required GitHub Secrets

Navigate to: **Repository → Settings → Secrets and variables → Actions → New repository secret**

| Secret Name | Description |
|-------------|-------------|
| `AWS_ACCESS_KEY_ID` | IAM user access key |
| `AWS_SECRET_ACCESS_KEY` | IAM user secret key |
| `AWS_CLOUDFRONT_DISTRIBUTION_ID` | CloudFront distribution ID |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key (for frontend build) |

## Environment Configuration

The `deploy-backend` and `deploy-frontend` jobs use the `production` GitHub environment. Configure environment protection rules at:
**Repository → Settings → Environments → production**

## Pipeline Flow

```
push to main
    │
    ├── backend-test ──────────────────┐
    │   (build + 17 unit tests)        │
    │                                  ▼
    │                           deploy-backend
    │                           (ECR push + ECS update)
    │
    └── frontend-build ─────────────────┐
        (npm ci + npm run build)         │
                                         ▼
                                  deploy-frontend
                                  (S3 sync + CloudFront invalidation)
```

## Local Testing

Test the workflow locally with [act](https://github.com/nektos/act):

```bash
# Install act
brew install act  # macOS

# Run pull_request event (test jobs only)
act pull_request

# Run push event (all jobs)
act push --secret-file .env.aws
```

## Adding New Jobs

To add a new job, append to `.github/workflows/ci.yml`:

```yaml
my-new-job:
  name: My New Job
  runs-on: ubuntu-latest
  needs: [backend-test]  # depends on other jobs
  steps:
    - uses: actions/checkout@v4
    - name: Do something
      run: echo "Hello!"
```
