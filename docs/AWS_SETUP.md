# AWS Setup Guide

## Prerequisites

1. AWS account (free tier eligible for most services)
2. AWS CLI installed: https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html
3. Configure CLI: `aws configure`

---

## 1. IAM User Setup

Create a deployment IAM user with these policies:
- `AmazonECS_FullAccess`
- `AmazonEC2ContainerRegistryFullAccess`
- `AmazonS3FullAccess`
- `CloudFrontFullAccess`
- `AmazonRDSFullAccess`
- `AWSCloudFormationFullAccess`
- `IAMFullAccess` (for CloudFormation to create roles)

```bash
# Create IAM user for CI/CD
aws iam create-user --user-name ecommerce-deploy
aws iam attach-user-policy --user-name ecommerce-deploy --policy-arn arn:aws:iam::aws:policy/AmazonECS_FullAccess
aws iam attach-user-policy --user-name ecommerce-deploy --policy-arn arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryFullAccess
aws iam attach-user-policy --user-name ecommerce-deploy --policy-arn arn:aws:iam::aws:policy/AmazonS3FullAccess
aws iam attach-user-policy --user-name ecommerce-deploy --policy-arn arn:aws:iam::aws:policy/CloudFrontFullAccess

# Create access key
aws iam create-access-key --user-name ecommerce-deploy
```

Save the `AccessKeyId` and `SecretAccessKey` — you'll need them for GitHub Secrets.

---

## 2. ECR (Elastic Container Registry)

```bash
# Create ECR repository for backend
aws ecr create-repository \
  --repository-name ecommerce-backend \
  --region us-east-1

# Get the registry URI
aws ecr describe-repositories --repository-names ecommerce-backend \
  --query 'repositories[0].repositoryUri' --output text
```

Update `.env.aws` with the registry URI.

---

## 3. Deploy Infrastructure with CloudFormation

```bash
aws cloudformation deploy \
  --template-file aws/cloudformation.yml \
  --stack-name ecommerce-platform \
  --parameter-overrides \
    Environment=production \
    DBPassword=YourSecurePassword123! \
    DBUsername=ecommerce \
    JwtSecret=$(openssl rand -base64 64) \
    StripeSecretKey=sk_live_your_key \
    BackendImage=placeholder \
  --capabilities CAPABILITY_NAMED_IAM \
  --region us-east-1

# Get outputs
aws cloudformation describe-stacks \
  --stack-name ecommerce-platform \
  --query 'Stacks[0].Outputs' \
  --output table
```

---

## 4. S3 Bucket (Frontend)

The CloudFormation template creates the S3 bucket. To manually create:

```bash
# Create bucket
aws s3 mb s3://ecommerce-platform-frontend-prod --region us-east-1

# Block public access (CloudFront uses OAC)
aws s3api put-public-access-block \
  --bucket ecommerce-platform-frontend-prod \
  --public-access-block-configuration \
  BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true
```

---

## 5. CloudFront Distribution

The CloudFormation template creates the CloudFront distribution. Note the distribution domain name from the stack outputs.

To get the domain name:
```bash
aws cloudformation describe-stacks \
  --stack-name ecommerce-platform \
  --query 'Stacks[0].Outputs[?OutputKey==`FrontendURL`].OutputValue' \
  --output text
```

---

## 6. RDS MySQL Database

The CloudFormation template creates RDS. To get the endpoint:

```bash
aws cloudformation describe-stacks \
  --stack-name ecommerce-platform \
  --query 'Stacks[0].Outputs[?OutputKey==`RDSEndpoint`].OutputValue' \
  --output text
```

---

## 7. Custom Domain (Optional)

1. Register domain or use existing (Route 53 recommended)
2. Create ACM certificate in us-east-1:
   ```bash
   aws acm request-certificate \
     --domain-name your-domain.com \
     --subject-alternative-names '*.your-domain.com' \
     --validation-method DNS \
     --region us-east-1
   ```
3. Validate the certificate (add DNS records)
4. Update CloudFront distribution with the certificate ARN
5. Add CNAME record pointing your domain to CloudFront

---

## 8. SES (Email) Setup

```bash
# Verify email address
aws ses verify-email-identity --email-address no-reply@your-domain.com

# Request production access (removes sandbox)
# Go to AWS Console → SES → Account → Request production access
```

---

## Cost Estimation (Monthly)

| Service | Config | Est. Cost |
|---------|--------|-----------|
| RDS MySQL | db.t3.micro | ~$15/mo |
| ECS Fargate | 0.25 vCPU, 0.5 GB | ~$5/mo |
| ALB | 1 instance | ~$16/mo |
| S3 | < 1 GB | < $0.03/mo |
| CloudFront | 10 GB transfer | ~$0.85/mo |
| **Total** | | **~$37/mo** |

*Prices are approximate and may vary by region.*

---

## Security Best Practices

- Use AWS Secrets Manager for sensitive values (DB passwords, API keys)
- Enable CloudTrail for audit logging
- Enable RDS encryption at rest
- Use VPC with private subnets for RDS
- Enable CloudFront WAF for DDoS protection
- Rotate JWT secrets periodically
- Use least-privilege IAM policies
