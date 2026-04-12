# 🛒 E-Commerce Platform

[![CI/CD Pipeline](https://github.com/your-org/ecommerce-platform/actions/workflows/ci.yml/badge.svg)](https://github.com/your-org/ecommerce-platform/actions/workflows/ci.yml)
[![Java](https://img.shields.io/badge/Java-17-orange.svg)](https://openjdk.java.net/projects/jdk/17/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.4-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

A production-ready, full-featured Spring Boot E-Commerce Platform with JWT authentication, Stripe payments, and comprehensive REST API.

## 🚀 Features

- **JWT Authentication** - Secure token-based authentication and authorization
- **Product Management** - Full CRUD with categories, search, and filtering
- **Shopping Cart** - Persistent cart management
- **Order Processing** - Complete order lifecycle management
- **Stripe Payments** - Payment intent creation and webhook handling
- **Email Notifications** - Order confirmation, shipping updates, welcome emails
- **Admin Dashboard** - User and order management with analytics
- **Product Reviews** - Rating and review system
- **Swagger UI** - Interactive API documentation
- **H2 / MySQL** - H2 for dev/test, MySQL for production

## 🛠️ Tech Stack

| Technology | Version |
|---|---|
| Java | 17 |
| Spring Boot | 3.2.4 |
| Spring Security | 6.x |
| Spring Data JPA | 3.x |
| JJWT | 0.12.3 |
| Stripe Java | 23.3.0 |
| Springdoc OpenAPI | 2.3.0 |
| H2 Database | Runtime |
| MySQL | 8.0 |
| Lombok | Latest |

## 📋 Prerequisites

- Java 17+
- Maven 3.8+
- MySQL 8.0+ (for production)
- Docker & Docker Compose (optional)

## ⚡ Quick Start

### Development (H2 in-memory)

```bash
git clone https://github.com/your-org/ecommerce-platform.git
cd ecommerce-platform
mvn spring-boot:run
```

The application will start on `http://localhost:8080`

### API Documentation

Open Swagger UI: `http://localhost:8080/swagger-ui.html`

### H2 Console (Dev)

Open: `http://localhost:8080/h2-console`
- JDBC URL: `jdbc:h2:mem:ecommercedb`
- Username: `sa`
- Password: (empty)

## ⚙️ Configuration

### Environment Variables (Production)

| Variable | Description |
|---|---|
| `DB_USERNAME` | MySQL database username |
| `DB_PASSWORD` | MySQL database password |
| `jwt.secret` | JWT signing secret (Base64) |
| `stripe.api.key` | Stripe API secret key |
| `stripe.webhook.secret` | Stripe webhook signing secret |

### application.properties (Key Settings)

```properties
jwt.secret=your-base64-encoded-secret
jwt.expiration=86400000
stripe.api.key=sk_live_...
stripe.webhook.secret=whsec_...
```

## 🐳 Docker Deployment

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop services
docker-compose down
```

## 📡 API Documentation

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login user |

### Products

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/products` | List products (search/filter) | No |
| GET | `/products/{id}` | Get product by ID | No |
| POST | `/products` | Create product | Admin |
| PUT | `/products/{id}` | Update product | Admin |
| DELETE | `/products/{id}` | Delete product | Admin |
| GET | `/products/{id}/reviews` | Get reviews | No |
| POST | `/products/{id}/reviews` | Add review | Yes |

### Cart

| Method | Endpoint | Description |
|---|---|---|
| GET | `/cart` | Get cart |
| POST | `/cart/items` | Add item to cart |
| PUT | `/cart/items/{id}` | Update cart item |
| DELETE | `/cart/items/{id}` | Remove item |
| DELETE | `/cart` | Clear cart |

### Orders

| Method | Endpoint | Description |
|---|---|---|
| POST | `/orders` | Create order |
| GET | `/orders` | Get user orders |
| GET | `/orders/{id}` | Get order by ID |
| PUT | `/orders/{id}/cancel` | Cancel order |

### Payments

| Method | Endpoint | Description |
|---|---|---|
| POST | `/payments/create-intent` | Create Stripe payment intent |
| POST | `/payments/webhook` | Stripe webhook handler |

### Admin

| Method | Endpoint | Description |
|---|---|---|
| GET | `/admin/dashboard` | Dashboard stats |
| GET | `/admin/users` | List all users |
| DELETE | `/admin/users/{id}` | Delete user |
| GET | `/admin/orders` | List all orders |
| PUT | `/admin/orders/{id}/status` | Update order status |

## 🔒 Security

- JWT tokens expire after 24 hours (configurable)
- Passwords hashed with BCrypt
- Role-based access control (ROLE_CUSTOMER, ROLE_ADMIN)
- CORS configured for cross-origin requests

## 🧪 Testing

```bash
# Run all tests
mvn test

# Run with coverage
mvn test jacoco:report
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.
