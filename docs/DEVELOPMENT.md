# Development Guide

## Prerequisites

| Tool | Version | Install |
|------|---------|---------|
| Java | 17+ | https://adoptium.net/ |
| Maven | 3.8+ | https://maven.apache.org/ |
| Node.js | 20+ | https://nodejs.org/ |
| Docker | 24+ | https://docs.docker.com/get-docker/ |
| MySQL | 8.0 | via Docker or direct install |

## Quick Start (Local Dev)

```bash
# Clone
git clone https://github.com/jijendhar-g/ecommerce-platform.git
cd ecommerce-platform

# Option A: Docker Compose (recommended - runs everything)
docker compose up --build -d

# Option B: Manual
# Terminal 1 - Start MySQL
docker run -d --name mysql \
  -e MYSQL_ROOT_PASSWORD=rootpassword \
  -e MYSQL_DATABASE=ecommercedb \
  -e MYSQL_USER=ecommerce \
  -e MYSQL_PASSWORD=ecommerce123 \
  -p 3306:3306 mysql:8.0

# Terminal 2 - Start backend
mvn spring-boot:run -Dspring-boot.run.profiles=dev

# Terminal 3 - Start frontend
cd frontend && npm install && npm run dev
```

## Backend Development

### Build Commands
```bash
mvn clean compile          # Compile
mvn test                   # Run tests (17 tests)
mvn clean package -DskipTests  # Build JAR
mvn spring-boot:run        # Run application
```

### API Testing
- Swagger UI: http://localhost:8080/api/v1/swagger-ui.html
- H2 Console (dev): http://localhost:8080/api/v1/h2-console
- Health: http://localhost:8080/api/v1/actuator/health

### Adding a New Feature
1. Create entity in `com.ecommerce.entity`
2. Create repository in `com.ecommerce.repository`
3. Create service in `com.ecommerce.service`
4. Create controller in `com.ecommerce.controller`
5. Add DTOs in `com.ecommerce.dto.request` and `dto.response`
6. Write tests in `src/test/`

### Project Structure
```
src/main/java/com/ecommerce/
├── config/          # Spring configuration
├── controller/      # REST controllers
├── dto/             # Request/Response DTOs
│   ├── request/
│   └── response/
├── entity/          # JPA entities
├── exception/       # Exception handling
├── repository/      # Spring Data JPA repositories
├── security/        # JWT + Spring Security
└── service/         # Business logic
```

## Frontend Development

```bash
cd frontend
npm install
npm run dev       # http://localhost:5173
```

### Adding a New Page
1. Create component in `src/pages/`
2. Add route in `src/App.tsx`
3. Add navigation link in `src/components/shared/Navbar.tsx`

### Adding a New API Service
1. Add method to appropriate file in `src/services/`
2. Add corresponding Redux slice action in `src/store/slices/`
3. Use `useAppDispatch()` and `useAppSelector()` in components

## Code Style

### Backend (Java)
- Follow Google Java Style Guide
- Use Lombok for boilerplate reduction
- Always use `@Valid` on request bodies
- Use `ResponseEntity<ApiResponse<T>>` for consistent responses
- Handle exceptions in `GlobalExceptionHandler`

### Frontend (TypeScript)
- Strict TypeScript – no `any` unless unavoidable
- Tailwind CSS for all styling (no custom CSS)
- Redux Toolkit patterns for state management
- Toast notifications for user feedback

## Testing

### Backend Tests
```bash
mvn test                    # Run all tests
mvn test -Dtest=UserServiceTest  # Run specific test class
```

Tests use H2 in-memory database (no MySQL required).

### Frontend Tests (future)
```bash
npm test                    # Run frontend tests
```

## Git Workflow

```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make changes, then commit
git add .
git commit -m "feat: add your feature"

# Push and create PR
git push origin feature/your-feature-name
```

### Commit Message Format
```
feat: add new feature
fix: fix a bug
docs: update documentation
style: code formatting
refactor: code refactoring
test: add tests
chore: maintenance
```

## Environment Profiles

| Profile | Database | Email | Purpose |
|---------|----------|-------|---------|
| `dev` | H2 in-memory | Mailhog | Local dev |
| `test` | H2 in-memory | Mock | Unit tests |
| `prod` | MySQL | Real SMTP | Production |

Set profile: `SPRING_PROFILES_ACTIVE=dev`
