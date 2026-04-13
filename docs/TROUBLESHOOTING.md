# Troubleshooting Guide

## Backend Issues

### Application fails to start

**Symptom:** `Unable to start embedded Tomcat`

**Solutions:**
- Port 8080 already in use: `lsof -i :8080` then kill the process
- Check application.properties for correct configuration

---

### Database connection failed

**Symptom:** `Communications link failure` or `Access denied`

**Solutions:**
```bash
# Verify MySQL is running
docker ps | grep mysql

# Check credentials match application-prod.properties
docker exec -it ecommerce-mysql mysql -u ecommerce -p

# Re-create MySQL container
docker compose down -v && docker compose up mysql -d
```

---

### JWT token issues

**Symptom:** `401 Unauthorized` on authenticated endpoints

**Solutions:**
- Ensure `Authorization: Bearer <token>` header is sent
- Check token hasn't expired (default: 24 hours)
- Verify `JWT_SECRET` env var is set and matches what was used to sign the token
- Token must be min 256-bit secret

---

### Tests failing

**Symptom:** `BUILD FAILURE` during `mvn test`

**Solutions:**
```bash
# Run specific test for details
mvn test -Dtest=ProductServiceTest -pl . -e

# Ensure test profile is activated
# src/test/resources/application-test.properties should exist

# Clean and rebuild
mvn clean test
```

---

### Stripe webhook not working

**Symptom:** Payment events not processing

**Solutions:**
- Use Stripe CLI for local testing: `stripe listen --forward-to localhost:8080/api/v1/payments/webhook`
- Verify `STRIPE_WEBHOOK_SECRET` matches the signing secret from Stripe dashboard
- Check ngrok or similar tunnel for local development

---

## Frontend Issues

### Frontend not connecting to backend

**Symptom:** API calls fail with CORS or network errors

**Solutions:**
```bash
# Check VITE_API_BASE_URL in .env.local
cat frontend/.env.local

# Verify backend is running
curl http://localhost:8080/api/v1/actuator/health

# Check Vite proxy config (vite.config.ts)
```

---

### Build fails

**Symptom:** TypeScript errors during `npm run build`

**Solutions:**
```bash
cd frontend
npm run lint       # Check for lint errors
npx tsc --noEmit  # Check TypeScript errors
npm ci            # Clean install dependencies
```

---

### Stripe Elements not loading

**Symptom:** Payment form doesn't appear

**Solutions:**
- Verify `VITE_STRIPE_PUBLISHABLE_KEY` is set in `.env.local`
- Use `pk_test_...` key for development
- Check browser console for errors

---

## Docker Compose Issues

### Services not starting

```bash
# Check logs
docker compose logs mysql
docker compose logs backend
docker compose logs frontend

# Check health
docker compose ps

# Rebuild
docker compose down
docker compose build --no-cache
docker compose up -d
```

---

### MySQL data persistence issues

```bash
# View volumes
docker volume ls

# Remove volume (CAUTION: deletes all data)
docker compose down -v
docker volume rm ecommerce-platform_mysql-data
```

---

### Port conflicts

```bash
# Find process using port
lsof -i :8080   # Backend
lsof -i :3306   # MySQL
lsof -i :3000   # Frontend

# Kill process
kill -9 <PID>
```

---

## AWS Deployment Issues

### ECS task fails to start

1. Check CloudWatch logs: `aws logs tail /ecs/ecommerce-backend-production`
2. Verify environment variables are set in task definition
3. Check security group allows traffic on port 8080
4. Ensure ECR image was pushed successfully

---

### CloudFront returning 403

1. Verify OAC is configured correctly on the S3 origin
2. Check S3 bucket policy allows CloudFront service principal
3. Wait 5-10 minutes for CloudFront to propagate

---

### RDS connection timeout

1. Verify backend security group can reach RDS security group on port 3306
2. Check RDS is in `available` state
3. Verify connection string uses correct endpoint

---

## Common Commands

```bash
# Check all running Docker containers
docker ps

# Restart backend only
docker compose restart backend

# View backend logs (live)
docker compose logs -f backend

# Access MySQL shell
docker exec -it ecommerce-mysql mysql -u ecommerce -pecommerce123 ecommercedb

# Clear all Docker resources (CAUTION)
docker system prune -a --volumes

# Backend health check
curl http://localhost:8080/api/v1/actuator/health | jq

# Test login
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"Admin123!"}'
```
